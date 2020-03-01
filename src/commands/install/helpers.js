import _ from "lodash";
import pluralize from "pluralize";
import {
    GRAPHQL_TYPES_MAPPING,
    TYPES_MAPPING,
    SQL_LENGTH_MAPPING,
    SQL_TYPES_MAPPING,
    TYPES_WITHOUT_LENGTH,
    INVERSE_RELATIONS_MAPPING
} from './constants';


export const createField = (enums) => (field, withTypeORMNotation = true) => {
    const options = { nullable: !field.required, type: `"${SQL_TYPES_MAPPING[field.type] || field.type}"` };
    if (field.type === 'enum') {
        options.enum = field.type;
    } else {
        if (!TYPES_WITHOUT_LENGTH.includes(field.type)) {
            options.length = field.length || SQL_LENGTH_MAPPING[field.type]
        }
    }

    const lines = [
        `${field.name}: ${TYPES_MAPPING[field.type] || field.type};`,
    ];

    if (withTypeORMNotation !== false) {
        lines.unshift(
            field.generated ? '@PrimaryGeneratedColumn()' : `@Column({ ${_.entries(options).map(([key, value]) => `${key}: ${value}`).join(', ')} })`,
        )
    }

    lines.unshift(`@Field(${[!enums[field.type] && `type => ${GRAPHQL_TYPES_MAPPING[field.type] || _.upperFirst(field.type)}`, `{ nullable: ${withTypeORMNotation!== false || (!field.required || !!field.hidden)} }`].filter(_.identity).join(', ')})`)

    return lines.join('\n\t')
};

export const createRelatedObjectField = ({ name, pluralizedName }) => ({ type, entity }) => {
    const upperCasedName = _.upperFirst(entity);
    switch (type) {
        case 'manyToMany':
        case 'oneToMany':
            return [
                `@${_.upperFirst(type)}(type => ${upperCasedName}, ${entity} => ${entity}.${type === 'oneToMany' ? name : pluralizedName}, { lazy: true })`,
                `@Join${type === 'manyToMany' ? 'Table' : 'Column'}()`,
                `@Field(type => [${upperCasedName}])`,
                `${pluralize(entity)}: ${upperCasedName}[];`,
            ].join('\n\t');
        case 'oneToOne':
        case 'manyToOne':
            return [
                `@${_.upperFirst(type)}(type => ${upperCasedName}, ${entity} => ${entity}.${type === 'oneToOne' ? name : pluralizedName}, { lazy: true, onDelete: 'CASCADE' })`,
                `@Field(type => ${upperCasedName})`,
                `${entity}: ${upperCasedName};`,
            ].join('\n\t');
    }
};

export const createRelatedInputField = ({ type, entity }) => {
    switch (type) {
        case 'manyToMany':
        case 'oneToMany':
            return [
                `@Field(type => [Int], { nullable: true })`,
                `${entity}Ids: number[];`,
            ].join('\n\t');
        case 'oneToOne':
        case 'manyToOne':
            return [
                `@Field(type => Int, { nullable: true })`,
                `${entity}Id: number;`,
            ].join('\n\t');
    }
};

export const fillMissingRelations = (entities) => {
    const entitiesMap = _.keyBy(entities, 'name');
    entities.forEach(entity => {
        _.get(entity, 'relations', []).forEach(relation => {
            const targetEntity = entitiesMap[relation.entity];
            if (!targetEntity.relations) {
                targetEntity.relations = [];
            }
            const targetEntityRelationsMapping = _.keyBy(targetEntity.relations, 'entity');
            if (!targetEntityRelationsMapping[entity.name]) {
                targetEntity.relations.push({
                    entity: entity.name,
                    type: INVERSE_RELATIONS_MAPPING[relation.type]
                })
            } else {
                targetEntityRelationsMapping[entity.name].type = INVERSE_RELATIONS_MAPPING[relation.type];
            }
        })
    })
};

export const makeRelationSetter = (name) => (relation) => {
    if (relation.type.endsWith('One')) {
        return `if (input.${relation.entity}Id) {
            const ${relation.entity} = await this.${relation.entity}Repository.findOne({ where: { id: input.${relation.entity}Id } });
            if (${relation.entity}) {
                ${name}.${relation.entity} = ${relation.entity};
            }
        }`
    }
    return `if (input.${relation.entity}Ids && input.${relation.entity}Ids.length) {
            ${name}.${pluralize(relation.entity)} = await this.${relation.entity}Repository.findByIds(input.${relation.entity}Ids);
        }`
}

export const applyEntityNameReplacers = entity => {
    entity.upperCasedName = _.upperCase(entity.name);
    entity.capitalizedName = _.upperFirst(entity.name);
    entity.pluralizedName = pluralize(entity.name);
    entity.pluralizedAndUpperCasedName = _.upperCase(entity.pluralizedName);
    entity.pluralizedAndCapitalizedName = _.upperFirst(entity.pluralizedName);
    return template => template
        .replace(/\$NAME_PLURALIZED_AND_UPPERCASED/g, entity.pluralizedAndUpperCasedName)
        .replace(/\$NAME_UPPERCASED/g, entity.upperCasedName)
        .replace(/\$NAME_CAPITALIZED/g, entity.capitalizedName)
        .replace(/\$NAME_PLURALIZED/g, entity.pluralizedName)
        .replace(/\$NAME/g, entity.name);
};