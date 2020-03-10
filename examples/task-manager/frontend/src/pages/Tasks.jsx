import React from 'react';
import { Table } from 'gngen-ui';
import * as queries from 'graphql/tasks';

const headers = [
    { key: 'id', name: '#', editable: false },
	{ key: 'name', name: 'name', type: 'string', required: false, editable: true },
	{ key: 'content', name: 'content', type: 'text', required: false, editable: true },
	{ key: 'done', name: 'done', type: 'boolean', required: false, editable: true },
	{ key: 'categories', name: 'categories', type: 'multiRelation' }
];

const enums = {
    
};

export default function Task() {
    return (
        <div>
            <Table
                headers={headers}
                entityName="tasks"
                queries={queries}
                enums={enums}
            />
        </div>
    );
}
