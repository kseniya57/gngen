import React from 'react';
import { Table } from 'gngen-ui';
import * as queries from 'graphql/users';

const headers = [
    { key: 'id', name: '#', editable: false },
	{ key: 'name', name: 'name', type: 'string', required: false, editable: true },
	{ key: 'email', name: 'email', type: 'string', required: true, editable: true },
	{ key: 'avatar', name: 'avatar', type: 'string', required: false, editable: true, format: 'image' },
	{ key: 'tasks', name: 'tasks', type: 'multiRelation' }
];

const enums = {
    
};

export default function Users() {
    return (
        <div>
            <Table
                headers={headers}
                entityName="users"
                queries={queries}
                enums={enums}
            />
        </div>
    );
}
