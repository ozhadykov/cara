import { useEffect, useMemo, useState } from "react"
import { Child } from "../../lib/models.ts"
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import Checkbox from "../input/Checkbox.tsx"
import Table from "./Table.tsx"
import { usePairsGenerator } from "../../contexts/providers/PairsGeneratorContext.tsx"
import { useToast } from "../../contexts"
import { toastTypes } from "../../lib/constants.ts"

interface IChildrenTable {
    children: Child[],
    next: () => void
}

const ChildrenTable = ({ children, next }: IChildrenTable) => {
    const [selectedChildrenLocal, setSelectedChildrenLocal] = useState({})
    const { setSelectedChildrenIds, selectedChildrenIds } = usePairsGenerator()
    const { sendMessage } = useToast()

    const columns = useMemo<ColumnDef<Child>[]>(
        () => [
            {
                id: "select",
                header: "select",
                cell: ({ row }) => {
                    return (
                        <div>
                            <Checkbox id={`child_checkbox_${row.id}`} onChange={row.getToggleSelectedHandler()}
                                      name="child_id"
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
                accessorKey: "required_qualification",
                cell: info => info.getValue(),
            },
            {
                accessorKey: "requested_hours",
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
        data: children,
        columns,
        state: {
            rowSelection: selectedChildrenLocal,
        },
        //@ts-ignore
        getRowId: originalRow => originalRow.id,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setSelectedChildrenLocal,
        getPaginationRowModel: getPaginationRowModel(),
    })

    const handleNextStep = () => {
        const selectedInTable = table.getState().rowSelection
        console.log(selectedInTable)
        const rowIds = Object.keys(selectedInTable)
        if (rowIds.length) {
            const childrenToSave: number[] = []
            rowIds.forEach(rowId => {
                const rowData = table.getRow(rowId)
                childrenToSave.push(rowData.original.id)
            })
            setSelectedChildrenIds(childrenToSave)
            next()
        } else
            sendMessage("Select some children to continue", toastTypes.error)

    }

    useEffect(() => {
        console.log(table.getRowModel())
        const restoredSelection = selectedChildrenIds.reduce((acc, currVal) => {
            acc[currVal] = true
            return acc
        }, {})

        setSelectedChildrenLocal(restoredSelection)
    }, [])


    return (
        <div className="overflow-y-hidden">
            <Table table={table} />
            <div className="generator-controls flex items-center justify-between gap-3 mt-6">
                <button className="btn btn-soft btn-wide">previous step</button>
                <button className="btn btn-soft btn-wide btn-secondary" onClick={handleNextStep}>next step</button>
            </div>
        </div>
    )
}

export default ChildrenTable