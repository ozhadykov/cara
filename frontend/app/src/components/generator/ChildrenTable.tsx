import React, {useMemo, useState} from 'react';
import {Child} from "../../lib/models.ts";
import {ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable} from "@tanstack/react-table";
import Checkbox from "../input/Checkbox.tsx";
import Table from "./Table.tsx";

interface IChildrenTable {
    children: Child[]
}

const ChildrenTable = ({children}: IChildrenTable) => {
    const [selectedChildren, setSelectedChildren] = useState({})

    const columns = useMemo<ColumnDef<Child>[]>(
        () => [
            {
                id: 'select',
                header: 'test',
                cell: ({row}) => (
                    <div>
                        <Checkbox id={'test'} onChange={row.getToggleSelectedHandler()} name={'test'}
                                  checked={row.getIsSelected()}/>
                    </div>
                )
            },
            {
                accessorKey: 'id',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'first_name',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'family_name',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'city',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'required_qualification',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'requested_hours',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'street',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'street_number',
                cell: info => info.getValue()
            },
            {
                accessorKey: 'zip_code',
                cell: info => info.getValue()
            },
        ],
        []
    )

    const table = useReactTable({
        data: children,
        columns,
        state: {
            rowSelection: selectedChildren
        },
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setSelectedChildren,
        getPaginationRowModel: getPaginationRowModel(),
    })

    return (
        <div>
            <Table table={table}/>
        </div>
    );
};

export default ChildrenTable;