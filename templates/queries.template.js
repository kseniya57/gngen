import gql from 'graphql-tag';

const $NAME_UPPERCASED_FIELDS = `
    $FIELDS
`;

export const GET_ALL_QUERY = gql`
    query $NAME_PLURALIZED($pagination: Pagination) {
        $NAME_PLURALIZED(pagination: $pagination) {
            ${$NAME_UPPERCASED_FIELDS}
        }
    }
`;

export const GET_COUNT_QUERY = gql`
    query $NAME_PLURALIZEDCount {
        $NAME_PLURALIZEDCount
    }
`;

/* dictionaries */

export const GET_ONE_QUERY = gql`
    query $NAME($id: Int!) {
        $NAME(id: $id) {
            ${$NAME_UPPERCASED_FIELDS}
        }
    }
`;

export const ADD_MUTATION = gql`
    mutation add$NAME_CAPITALIZED($input: $NAME_CAPITALIZEDInput!) {
        add$NAME_CAPITALIZED(input: $input)
    }
`;

export const UPDATE_MUTATION = gql`
    mutation update$NAME_CAPITALIZED($id: Int!, $input: $NAME_CAPITALIZEDInput!) {
        update$NAME_CAPITALIZED(id: $id, input: $input)
    }
`;

export const DELETE_MUTATION = gql`
    mutation delete$NAME_CAPITALIZED($id: Int!) {
        delete$NAME_CAPITALIZED(id: $id)
    }
`;

export const ADDED_EVENT = gql`
    subscription $NAMEAdded {
        $NAMEAdded {
            ${$NAME_UPPERCASED_FIELDS}
        }
    }
`;

export const UPDATED_EVENT = gql`
    subscription $NAMEUpdated {
        $NAMEUpdated {
            ${$NAME_UPPERCASED_FIELDS}
        }
    }
`;

export const DELETED_EVENT = gql`
    subscription $NAMEDeleted {
        $NAMEDeleted
    }
`;
