import gql from 'graphql-tag';

const CATEGORY_FIELDS = `
    id
	name
	
`;

export const GET_ALL_QUERY = gql`
    query categories {
        categories {
            ${CATEGORY_FIELDS}
        }
    }
`;



export const GET_ONE_QUERY = gql`
    query category($id: Int!) {
        category(id: $id) {
            ${CATEGORY_FIELDS}
        }
    }
`;

export const ADD_MUTATION = gql`
    mutation addCategory($input: CategoryInput!) {
        addCategory(input: $input)
    }
`;

export const UPDATE_MUTATION = gql`
    mutation updateCategory($id: Int!, $input: CategoryInput!) {
        updateCategory(id: $id, input: $input)
    }
`;

export const DELETE_MUTATION = gql`
    mutation deleteCategory($id: Int!) {
        deleteCategory(id: $id)
    }
`;

export const ADDED_EVENT = gql`
    subscription categoryAdded {
        categoryAdded {
            ${CATEGORY_FIELDS}
        }
    }
`;

export const UPDATED_EVENT = gql`
    subscription categoryUpdated {
        categoryUpdated {
            ${CATEGORY_FIELDS}
        }
    }
`;

export const DELETED_EVENT = gql`
    subscription categoryDeleted {
        categoryDeleted
    }
`;
