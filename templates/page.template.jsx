import React from 'react';
import { Table } from 'nodegen-ui';
import * as queries from 'graphql/$NAME_PLURALIZED';

const enums = {
    /* enums */
};

export default function $NAME_CAPITALIZED() {
    return (
        <div>
            <Table
                headers={[
                    /* headers */
                ]}
                entityName="$NAME_PLURALIZED"
                queries={queries}
                enums={enums}
            />
        </div>
    );
}
