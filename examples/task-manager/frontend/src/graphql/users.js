import gql from 'graphql-tag';

const USER_FIELDS = `
    id
	name
	email
	avatar
	tasks {
		id
		name
	}
`;

export const GET_ALL_QUERY = gql`
    query users($pagination: Pagination) {
        users(pagination: $pagination) {
            ${USER_FIELDS}
        }
    }
`;

export const GET_COUNT_QUERY = gql`
    query usersCount {
        usersCount
    }
`;

export const GET_DICTIONARIES_QUERY = gql`
    query usersDictionaries {
        tasks {
			id
			name
		}
    }
`;

export const GET_ONE_QUERY = gql`
    query user($id: Int!) {
        user(id: $id) {
            ${USER_FIELDS}
        }
    }
`;

export const ADD_MUTATION = gql`
    mutation addUser($input: UserInput!) {
        addUser(input: $input)
    }
`;

export const UPDATE_MUTATION = gql`
    mutation updateUser($id: Int!, $input: UserInput!) {
        updateUser(id: $id, input: $input)
    }
`;

export const DELETE_MUTATION = gql`
    mutation deleteUser($id: Int!) {
        deleteUser(id: $id)
    }
`;

export const ADDED_EVENT = gql`
    subscription userAdded {
        userAdded {
            ${USER_FIELDS}
        }
    }
`;

export const UPDATED_EVENT = gql`
    subscription userUpdated {
        userUpdated {
            ${USER_FIELDS}
        }
    }
`;

export const DELETED_EVENT = gql`
    subscription userDeleted {
        userDeleted
    }
`;
