import _ from 'lodash';
import chalk from 'chalk';
import pluralize from 'pluralize';
import {FileManager} from '../../managers';
import {fs, safeAwait, getConfig, cp, dirname} from '../../utils';
import {
    idConfig,
    emailConfig,
    passwordConfig,
    rightConfig,
    userConfig,
    ENTITY_TEMPLATE,
    RESOLVER_TEMPLATE,
    QUERIES_TEMPLATE,
    DICTIONARIES_QUERY_TEMPLATE,
    PAGE_TEMPLATE,
    SIDEBAR_ITEM_TEMPLATE,
    SET_RELATIONS_TEMPLATE,
    FRONTEND_TYPES_MAPPING,
} from './constants';
import {
    createField,
    createRelatedObjectField,
    createRelatedInputField,
    applyEntityNameReplacers,
    fillMissingRelations,
    makeRelationSetter
} from './helpers';

const generateBackendFiles = async ({ entities = [], enums = {}, db: dbConfig, name: appName, auth: withAuth }) => {

    await FileManager.updateFile('./backend/package.json', text => text
        .replace('$APP_NAME', appName)
    );

    const sourceDirectory = FileManager.makePath('./backend/src');

    await safeAwait(fs.mkdir(`${sourceDirectory}/entities`));
    await safeAwait(fs.mkdir(`${sourceDirectory}/resolvers`), false);

    const enumsArray = _.entries(enums);

    if (enumsArray.length) {
        await safeAwait(fs.mkdir(`${sourceDirectory}/enums`));

        await safeAwait(Object.entries(enums).forEach(([enumName, enumFields]) => fs.writeFile(
            `${sourceDirectory}/enums/${enumName}.ts`,
            `export enum ${enumName} {\n\t${_.entries(enumFields).map(pair => [pair[0], _.isString(pair[1]) ? `'${pair[1]}'` : pair[1]].join(' = ')).join(',\n\t')}\n}`, { flag: 'wx' }))
        );

        await fs.writeFile(
            `${sourceDirectory}/enums/index.ts`,
            `${_.keys(enums).map(enumName => `export * from './${enumName}';`).join('\n')}`
        );
    }

    const createGQLField = createField(enums);

    await fs.writeFile(
        `${sourceDirectory}/entities/index.ts`,
        `${entities.map(entity => `import {${entity.capitalizedName}} from './${entity.name}';`).join('\n')}\n\nexport default [\n\t${entities.map(entity => entity.capitalizedName).join(',\n\t')}\n];\n\nexport {\n\t${entities.map(entity => entity.capitalizedName).join(',\n\t')}\n};`
    );
    await fs.writeFile(
        `${sourceDirectory}/resolvers/index.ts`,
        `${withAuth ? 'import {AuthResolver} from \'./auth.resolver\';\n' : ''}${entities.map(entity => `import {${entity.capitalizedName}Resolver} from './${entity.name}.resolver';`).join('\n')}\n\nexport default [${withAuth ? '\n\tAuthResolver,' : ''}\n\t${entities.map(entity => `${entity.capitalizedName}Resolver`).join(',\n\t')}\n];`
    );

    await FileManager.updateFile('./backend/src/index.ts', text => {
            let updatedText = text
                .replace('/* db */', _.entries(dbConfig).map(([key, value]) => `${key}: ${_.isString(value) ? `'${value}'` : value}`).join(',\n\t\t') + ',');

            if (withAuth) {
                updatedText = updatedText
                    .replace(/('\.\/controllers';\n)/, `$1import createContext from './utils/createContext';\nimport { authChecker } from './guards/auth.guard';\n`)
                    .replace(/(resolvers,)/, `$1\n\t\tauthChecker,`)
                    .replace(/(schema,)/, `$1\n\t\tcontext: createContext,`)
            }

            return updatedText;
    });

    if (withAuth) {
        await FileManager.updateFile('./backend/src/middlewares/index.ts', text => text
            .replace(/('\.\/session';\n)/, `$1import auth from './auth';\n`)
            .replace(/(]\.forEach)/, `auth$1`)
        );

        await FileManager.updateFile('./backend/src/types/index.ts', text => `${text}\nexport * from './auth';`)
    }

    await safeAwait(Promise.all(entities.map(async (entity) => {
        const {
            name,
            fields,
            relations = [],
            applyNameReplacers
        } = entity;

        const makeRelationSetterForEntity = makeRelationSetter(name);

        let resolverCode = applyNameReplacers(RESOLVER_TEMPLATE)
            .replace('/* import relations */', `import { ${relations.map(relation => _.upperFirst(relation.entity)).join(', ')} } from '../entities';`)
            .replace(
                '/* relations repositories */',
                relations.map(relation => `@InjectRepository(${_.upperFirst(relation.entity)}) private readonly ${relation.entity}Repository: Repository<${_.upperFirst(relation.entity)}>`).join(',\n\t\t')
            )
            .replace('/* set relations */', applyNameReplacers(SET_RELATIONS_TEMPLATE).replace('$BODY', relations.map(makeRelationSetterForEntity).join('\n\t\t')))
            .replace(/\/\* set relations call \*\//g, `await this.setRelations(${name}, input);`);

        if (!withAuth) {
            resolverCode = resolverCode.replace(/(\t\tAuthorized,|@Authorized\(.*?\))\n/g, '');
        }

        try {
            await fs.writeFile(`${sourceDirectory}/resolvers/${name}.resolver.ts`, resolverCode, { flag: 'wx' });
            console.log(chalk.green(`${name} resolver successfully added!🎈`));
        } catch (e) {
            console.log(chalk.red(`${name} resolver already exists 💣`));
        }

        let inputTypeFields = fields
            .map(field => createGQLField(field, false))
            .join('\n\t\n\t');

        fields.unshift(idConfig);

        let objectTypeFields = fields
            .map(createGQLField)
            .join('\n\t\n\t');

        const createRelatedObjectFieldForEntity = createRelatedObjectField(entity);

        if (relations.length > 0) {
            objectTypeFields += '\n\t\n\t' + relations.map(createRelatedObjectFieldForEntity).join('\n\t\n\t');
            inputTypeFields += '\n\t\n\t' + relations.map(createRelatedInputField).join('\n\t\n\t');
        }

        let entityCode = applyNameReplacers(ENTITY_TEMPLATE)
            .replace(/\$OBJECT_TYPE_FIELDS/, objectTypeFields)
            .replace(/\$INPUT_TYPE_FIELDS/, inputTypeFields);

        const relationImports = relations.map(relation => `import {${_.upperFirst(relation.entity)}} from './${relation.entity}';`).join('\n');
        entityCode = entityCode
            .replace(/\/\* relations \*\//, relationImports);

        if (relations.length > 0) {
            const relationTypes = _.uniq(_.map(relations, 'type'));
            let relationTypesImports = _.map(relationTypes, _.upperFirst).join(', ');
            if (relationTypes.includes('manyToMany')) {
                relationTypesImports += ', JoinTable'
            }
            if (relationTypes.includes('oneToMany')) {
                relationTypesImports += ', JoinColumn'
            }
            entityCode = entityCode.replace(/(}\sfrom\s'typeorm';)/, `, ${relationTypesImports}$1`);
        }

        const enumsToImport = _.map(fields.filter(field => enums[field.type]), 'type');

        entityCode = entityCode
            .replace(/\/\* enums \*\//, enumsToImport.map(enumName => `import {${enumName}} from '../enums/${enumName}'`).join('\n'));

        try {
            await fs.writeFile(`${sourceDirectory}/entities/${name}.ts`, entityCode, { flag: 'wx' });
            console.log(chalk.green(`${name} model successfully added!🎈`));
        } catch (e) {
            console.log(chalk.red(`${name} model already exists 💣`));
        }
    })));
}

const generateFrontendFiles = async ({ entities, enums, name: appName }) => {

    const sourceDirectory = FileManager.makePath('./frontend/src');

    await FileManager.updateFile('./frontend/package.json', text => text
        .replace('$APP_NAME', appName)
    );

    await FileManager.updateFile('./frontend/public/index.html', text => text
        .replace('$APP_NAME', appName)
    );

    await FileManager.updateFile('./frontend/src/App.js', text => text
        .replace(
            '/* pages */',
            `import {\n\t${entities.map(entity => entity.pluralizedAndCapitalizedName).join(',\n\t')}\n} from 'pages';`
        )
        .replace(
            '/* routes */',
            entities.map(entity => `<Route path="${entity.pluralizedName}" component={${entity.pluralizedAndCapitalizedName}} />`).join('\n\t\t\t\t\t')
        )
    );

    await FileManager.updateFile(
        './frontend/src/config/sidebar.js',
        text => text
            .replace('/* icons */', `import {\n\t${entities.map(entity => `${_.upperFirst(entity.icon)}Rounded`).join(',\n\t')}\n} from '@material-ui/icons'`)
            .replace(
            '/* items */',
            entities.map(entity => entity.applyNameReplacers(SIDEBAR_ITEM_TEMPLATE).replace('$ICON', `${_.upperFirst(entity.icon)}Rounded`)).join(',\n\t')
        )
    );

    await safeAwait(fs.mkdir(`${sourceDirectory}/graphql`));
    await safeAwait(fs.mkdir(`${sourceDirectory}/pages`));

    await fs.writeFile(
        `${sourceDirectory}/pages/index.js`,
        `${entities.map(entity => `import ${entity.pluralizedAndCapitalizedName} from './${entity.pluralizedAndCapitalizedName}';`).join('\n')}\n\nexport {\n\t${_.map(entities, 'pluralizedAndCapitalizedName').join(',\n\t')}\n}`
    );

    await safeAwait(Promise.all(entities.map(async (entity) => {
        const {
            fields,
            pluralizedName,
            pluralizedAndCapitalizedName,
            applyNameReplacers,
            relations = []
        } = entity;

        const visibleFields = fields
            .filter(field => !field.hidden);

        const queries = applyNameReplacers(QUERIES_TEMPLATE)
            .replace(
                '$FIELDS',
                `id\n\t${_.map(visibleFields, 'name').join('\n\t')}\n\t${_.map(relations, relation => `${relation.type.endsWith('One') ? relation.entity : pluralize(relation.entity)} {\n\t\tid\n\t\tname\n\t}`).join('\n\t')}`
            )
            .replace('/* dictionaries */', relations.length ? applyNameReplacers(DICTIONARIES_QUERY_TEMPLATE).replace('$DICTIONARIES', _.map(relations, relation => `${pluralize(relation.entity)} {\n\t\t\tid\n\t\t\tname\n\t\t}`).join('\n\t\t')) : '');

        await safeAwait(fs.writeFile(`${sourceDirectory}/graphql/${pluralizedName}.js`, queries));

        const enumsForEntity = _.map(fields.filter(field => enums[field.type]), 'type');

        const pageCode = applyNameReplacers(PAGE_TEMPLATE)
            .replace(
                '/* headers */',
                    `{ key: 'id', name: '#', editable: false },\n\t`
                    + fields.filter(field => !field.hidden)
                        .map(field => `{ key: '${field.name}', name: '${field.name}', type: '${FRONTEND_TYPES_MAPPING[field.type] || field.type}', required: ${field.required ? !field.generated : false}, editable: ${!field.hidden && !field.generated}${field.format ? `, format: '${field.format}'` : ''} }`)
                        .join(',\n\t')
                    + (relations.length ? ',\n\t' : '')
                    + relations.map(relation => {
                        const key = relation.type.endsWith('One') ? relation.entity : pluralize(relation.entity);
                        return `{ key: '${key}', name: '${key}', type: '${enums[relation.type] ? 'enum' : FRONTEND_TYPES_MAPPING[relation.type]}' }`
                      }).join(',\n\t')
            )
            .replace(
                '/* enums */',
                enumsForEntity.length ? enumsForEntity.map((key) => `${key}: [\n\t\t${_.values(enums[key]).map(item => _.isString(item) ? `'${item}'` : item).join(',\n\t\t')}\n\t]`).join(',\n\t') : ''
            );
        await fs.writeFile(`${sourceDirectory}/pages/${pluralizedAndCapitalizedName}.jsx`, pageCode);
    })));
};

export default async () => {

    const config  = await getConfig();

    config.entities.forEach(applyEntityNameReplacers);

    await generateFrontendFiles(config);

    if (config.auth) {
        await FileManager.copyDir(`${dirname}/templates/auth`, 'backend/src');
        config.entities.push(rightConfig);
        let user = _.find(config.entities, ['name', 'user']);
        if (!user) {
            user = { ...userConfig };
            config.entities.push(user);
        } else {
            if (!_.find(user.fields, ['name', 'email'])) {
                user.fields.push(emailConfig);
            }
            if (!_.find(user.fields, ['name', 'password'])) {
                user.fields.push(passwordConfig);
            }
        }
    }

    fillMissingRelations(config.entities);

    await generateBackendFiles(config);

    console.log(chalk.cyan('Installing dependencies...🛠'));

    await Promise.all([
        cp.exec(`cd ./backend && npm install`),
        cp.exec(`cd ./frontend && npm install`)
    ]);

    console.log(chalk.green('Done!🎊🎁😺 Enjoy with your new project!🎈'));
}