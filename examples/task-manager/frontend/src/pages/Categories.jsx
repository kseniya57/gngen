import React from 'react';
import { Table } from 'gngen-ui';
import * as queries from 'graphql/categories';

const headers = [
    { key: 'id', name: '#', editable: false },
	{ key: 'name', name: 'name', type: 'string', required: false, editable: true }
];

const enums = {
    
};

export default function categories_AND_CAPITALIZED() {
    return (
        <div>
            <Table
                headers={headers}
                entityName="categories"
                queries={queries}
                enums={enums}
            />
        </div>
    );
}
