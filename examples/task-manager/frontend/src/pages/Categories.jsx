import React from 'react';
import { Table } from 'gngen-ui';
import * as queries from 'graphql/categories';

const headers = [
    { key: 'id', name: '#', editable: false },
	{ key: 'name', name: 'name', type: 'string', required: undefined, editable: true }
];

const enums = {
    
};

export default function Category() {
    return (
        <div>
            <Table
                headers={headers}
                entityName="Categories"
                queries={queries}
                enums={enums}
            />
        </div>
    );
}
