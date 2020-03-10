import gql from 'graphql-tag';

const TASK_FIELDS = `
    id
	name
	content
	done
	categories {
		id
		name
	}
`;

export const GET_ALL_QUERY = gql`
    query tasks($pagination: Pagination) {
        tasks(pagination: $pagination) {
            ${TASK_FIELDS}
        }
    }
`;

export const GET_COUNT_QUERY = gql`
    query tasksCount {
        tasksCount
    }
`;

export const GET_DICTIONARIES_QUERY = gql`
    query tasksDictionaries {
        categories {
			id
			name
		}
    }
`;

export const GET_ONE_QUERY = gql`
    query task($id: Int!) {
        task(id: $id) {
            ${TASK_FIELDS}
        }
    }
`;

export const ADD_MUTATION = gql`
    mutation addTask($input: TaskInput!) {
        addTask(input: $input)
    }
`;

export const UPDATE_MUTATION = gql`
    mutation updateTask($id: Int!, $input: TaskInput!) {
        updateTask(id: $id, input: $input)
    }
`;

export const DELETE_MUTATION = gql`
    mutation deleteTask($id: Int!) {
        deleteTask(id: $id)
    }
`;

export const ADDED_EVENT = gql`
    subscription taskAdded {
        taskAdded {
            ${TASK_FIELDS}
        }
    }
`;

export const UPDATED_EVENT = gql`
    subscription taskUpdated {
        taskUpdated {
            ${TASK_FIELDS}
        }
    }
`;

export const DELETED_EVENT = gql`
    subscription taskDeleted {
        taskDeleted
    }
`;
