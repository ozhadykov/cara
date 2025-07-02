import React, { useEffect, useMemo, useState } from "react"
import Table from "./Table.tsx"
import { ColumnDef, getCoreRowModel, getPaginationRowModel, useReactTable } from "@tanstack/react-table"
import { Assistant } from "../../lib/models.ts"
import Checkbox from "../input/Checkbox.tsx"
import { usePairsGenerator } from "../../contexts/providers/PairsGeneratorContext.tsx"
import { useToast } from "../../contexts"
import { toastTypes } from "../../lib/constants.ts"
import { TabCard } from "../index.tsx"

interface IAssistantTable {
    assistants: Assistant[]
    next: () => void
    prev: () => void
}

const AssistantTable = ({ assistants, next, prev }: IAssistantTable) => {
    const [selectedAssistants, setSelectedAssistants] = useState({})
    const { setSelectedAssistantsObj, selectedAssistantsObj } = usePairsGenerator()
    const { sendMessage } = useToast()

    const columns = useMemo<ColumnDef<Assistant>[]>(
        () => [
            {
                id: "select",
               header: ({ table }) => (
                    <Checkbox id="select" onChange={table.getToggleAllRowsSelectedHandler()} name="selec-all" checked={table.getIsAllRowsSelected()}></Checkbox>
                ),
                cell: ({ row }) => {
                    return (
                        <div>
                            <Checkbox id={`assistant_checkbox_${row.id}`} onChange={row.getToggleSelectedHandler()}
                                      name="assistant_id"
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
                accessorKey: "qualification_text",
                header: "qualification",
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
        //@ts-ignore
        getRowId: originalRow => originalRow.id,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true,
        onRowSelectionChange: setSelectedAssistants,
        getPaginationRowModel: getPaginationRowModel(),
    })

    const handleNextStep = () => {
        const selectedInTable = table.getState().rowSelection
        const rowIds = Object.keys(selectedInTable)
        if (rowIds.length) {
            const assistantsToSave: Assistant[] = []
            rowIds.forEach(rowId => {
                const rowData = table.getRow(rowId)
                assistantsToSave.push(rowData.original)
            })
            setSelectedAssistantsObj(assistantsToSave)
            next()
        } else
            sendMessage("Select some children to continue", toastTypes.error)

    }

    useEffect(() => {
        const restoredSelection = selectedAssistantsObj.reduce((acc: { [key: number]: boolean }, currVal) => {
            acc[currVal.id] = true
            return acc
        }, {} as { [key: number]: boolean })

        setSelectedAssistants(restoredSelection)
    }, [])


    return (
        <TabCard title="Step 2: Choose assistants">
            <div className="step-2-assistant-pick overflow-y-hidden">
                <Table table={table} />
                <div className="generator-controls flex items-center justify-between gap-3 mt-6">
                    <button className="btn btn-soft btn-wide" onClick={prev}>previous step</button>
                    <button className="btn btn-soft btn-wide btn-secondary" onClick={handleNextStep}>next step</button>
                </div>
            </div>
        </TabCard>
    )
}

export default AssistantTable