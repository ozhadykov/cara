import { useEffect, useMemo, useState } from "react"
import { Child } from "../../lib/models.ts"
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import Checkbox from "../input/Checkbox.tsx"
import Table from "./Table.tsx"
import { usePairsGenerator } from "../../contexts/providers/PairsGeneratorContext.tsx"
import { useToast } from "../../contexts"
import { toastTypes } from "../../lib/constants.ts"
import { TabCard } from "../index.tsx"

interface IChildrenTable {
    children: Child[],
    next: () => void
}

const ChildrenTable = ({ children, next }: IChildrenTable) => {
    const [selectedChildrenLocal, setSelectedChildrenLocal] = useState({})
    const { setSelectedChildrenObj, selectedChildrenObj } = usePairsGenerator()
    const { sendMessage } = useToast()

    const columns = useMemo<ColumnDef<Child>[]>(
        () => [
            {
                id: "select",
                header: ({ table }) => (
                    <Checkbox id="select" onChange={table.getToggleAllRowsSelectedHandler()} name="selec-all" checked={table.getIsAllRowsSelected()}></Checkbox>
                ),
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
                accessorKey: "required_qualification_text",
                header: "required qualification",
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
        const rowIds = Object.keys(selectedInTable)
        if (rowIds.length) {
            const childrenToSave: Child[] = []
            rowIds.forEach(rowId => {
                const rowData = table.getRow(rowId)
                childrenToSave.push(rowData.original)
            })
            setSelectedChildrenObj(childrenToSave)
            next()
        } else
            sendMessage("Select some children to continue", toastTypes.error)

    }

    useEffect(() => {
        const restoredSelection = selectedChildrenObj.reduce((acc: { [key: number]: boolean }, currVal) => {
            acc[currVal.id] = true
            return acc
        }, {} as { [key: number]: boolean })

        setSelectedChildrenLocal(restoredSelection)
    }, [])


    return (
        <TabCard title="Step 1: Choose children">
            <div className="overflow-y-hidden step-1-chidlren-pick">
                <Table table={table} />
                <div className="generator-controls flex items-center justify-end gap-3 mt-6">
                    <button className="btn btn-soft btn-wide btn-secondary" onClick={handleNextStep}>next step</button>
                </div>
            </div>
        </TabCard>
    )
}

export default ChildrenTable