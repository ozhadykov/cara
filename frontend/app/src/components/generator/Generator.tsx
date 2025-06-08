import { useLoading, usePairsGenerator, useToast } from "../../contexts"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { useMemo } from "react"
import { Assistant, Child } from "../../lib/models.ts"
import {postRequest} from "../../lib/request.ts"
import Table from "./Table.tsx"

interface IGeneratorProps {
    next: () => void
    prev: () => void
}

const Generator = ({ next, prev }: IGeneratorProps) => {
    const { selectedChildrenObj, selectedAssistantsObj } = usePairsGenerator()
    const {sendMessage} = useToast()
    const {toggleLoading} = useLoading()

    // region children table
    const childrenColumns = useMemo<ColumnDef<Child>[]>(
        () => [
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

    const childrenPreviewTable = useReactTable({
        data: selectedChildrenObj,
        columns: childrenColumns,
        getCoreRowModel: getCoreRowModel(),
    })

    // endregion

    // region assistants table
    const assistantsColumns = useMemo<ColumnDef<Assistant>[]>(
        () => [
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
        []
    )

    const assistantsPreviewTable = useReactTable({
        data: selectedAssistantsObj,
        columns: assistantsColumns,
        getCoreRowModel: getCoreRowModel(),
    })
    // endregion

    const handleGenerate = async () => {

        const url = '/api/pair_generator'
        const data = {
            children: selectedChildrenObj,
            assistants: selectedAssistantsObj
        }
        const response = await postRequest(url, data, sendMessage, toggleLoading)
        console.log(response)

        //next()
    }

    return (
        <div className="step-3-generator-content w-full h-full flex flex-col gap-4">
            <div className="header">
                <span className="text-2xl font-semibold">Generate pairs</span>
            </div>
            <div className="body grid grid-cols-2 gap-6">
                <div className="children-list-container w-full">
                    <span className="list-header text-lg">Selected children</span>
                    <div className="table-container mt-4">
                        <Table table={childrenPreviewTable} controls={false}/>
                    </div>
                </div>
                <div className="assistant-list-container w-full">
                    <span className="list-header text-lg">Selected assistants</span>
                    <div className="table-container mt-4">
                        <Table table={assistantsPreviewTable} controls={false} />
                    </div>
                </div>
            </div>
            <div className="generator-controls flex items-center justify-between gap-3 mt-6">
                <button className="btn btn-soft btn-wide" onClick={prev}>previous step</button>
                <button className="btn btn-soft btn-wide btn-secondary" onClick={handleGenerate}>generate!</button>
            </div>
        </div>
    )
}

export default Generator