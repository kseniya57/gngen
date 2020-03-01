import fs from 'fs';
import { dirname } from '../../utils';

export const RESOLVER_TEMPLATE = fs.readFileSync(`${dirname}/templates/resolver.template.ts`, 'utf8');
export const ENTITY_TEMPLATE = fs.readFileSync(`${dirname}/templates/entity.template.ts`, 'utf8');

export const SET_RELATIONS_TEMPLATE = `async setRelations($NAME: $NAME_CAPITALIZED, input: $NAME_CAPITALIZEDInput) {
        $BODY
    }`;

export const idField = {
    "name": "id",
    "type": "int",
    "required": true,
    "generated": true
};

export const TYPES_MAPPING = {
    int: 'number',
    float: 'number',
    timestamp: 'string',
    text: 'string'
};

export const FRONTEND_TYPES_MAPPING = {
    int: 'number',
    float: 'number',
    timestamp: 'date',
    manyToMany: 'multiRelation',
    oneToMany: 'multiRelation',
    oneToOne: 'singleRelation',
    manyToOne: 'singleRelation',
};

export const GRAPHQL_TYPES_MAPPING = {
    timestamp: 'String',
    text: 'String',
};

export const SQL_TYPES_MAPPING = {
    string: 'varchar',
};

export const TYPES_WITHOUT_LENGTH = ['text', 'timestamp', 'boolean'];

export const SQL_LENGTH_MAPPING = {
    string: 32,
    int: 11,
    float: 11,
};

export const INVERSE_RELATIONS_MAPPING = {
    manyToMany: 'manyToMany',
    manyToOne: 'oneToMany',
    oneToMany: 'manyToOne',
    oneToOne: 'oneToOne'
};

export const SIDEBAR_ITEM_TEMPLATE = `{\n\t\ttitle: '$NAME_PLURALIZED',\n\t\ticon: <$ICON />,\n\t\taction: goTo('/$NAME_PLURALIZED'),\n\t}`;

export const PAGE_TEMPLATE = fs.readFileSync(`${dirname}/templates/page.template.jsx`, 'utf8');
export const QUERIES_TEMPLATE = fs.readFileSync(`${dirname}/templates/queries.template.js`, 'utf8');

export const DICTIONARIES_QUERY_TEMPLATE = `export const GET_DICTIONARIES_QUERY = gql\`
    query $NAME_PLURALIZEDDictionaries {
        $DICTIONARIES
    }
\`;`;