import React, { useMemo, useState } from "react"
import Table from "./Table.tsx"
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Assistant } from "../../lib/models.ts"
import Checkbox from "../input/Checkbox.tsx"

interface IAssistantTable {
    assistants: Assistant[]
}

const AssistantTable = ({ assistants }: IAssistantTable) => {
    const [selectedAssistants, setSelectedAssistants] = useState({})

    const columns = useMemo<ColumnDef<Assistant>[]>(
        () => [
            {
                id: "select",
                header: "select",
                cell: ({ row }) => {
                    return (
                        <div>
                            <Checkbox id={`assistant_checkbox_${row.id}`} onChange={row.getToggleSelectedHandler()} name="assistant_id"
                                      checked={row.getIsSelected()} />
                        </div>
                    )
                },
            },
            {
                accessorKey: "id",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "first_name",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "family_name",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "city",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "qualification",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "min_capacity",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "max_capacity",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "street",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "street_number",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "zip_code",
                cell: info => info.getValue(),
            },
        ],
        [],
    )

    const table = useReactTable({
        data: assistants,
        columns,
        state: {
            rowSelection: selectedAssistants,
        },
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setSelectedAssistants,
        getPaginationRowModel: getPaginationRowModel(),
    })
    return (
        <div>
            <Table table={table} />
        </div>
    )
}

export default AssistantTable