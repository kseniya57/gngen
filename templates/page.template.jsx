import React from 'react';
import { Table } from 'gngen-ui';
import * as queries from 'graphql/$NAME_PLURALIZED';

const headers = [
    /* headers */
];

const enums = {
    /* enums */
};

export default function $NAME_CAPITALIZED() {
    return (
        <div>
            <Table
                headers={headers}
                entityName="$NAME_PLURALIZED_AND_CAPITALIZSED"
                queries={queries}
                enums={enums}
            />
        </div>
    );
}
