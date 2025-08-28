import { useLoading, usePairsGenerator, useToast } from "../../contexts"
import { ColumnDef, getCoreRowModel, useReactTable } from "@tanstack/react-table"
import React, { useMemo, useState } from "react"
import { Assistant, Child } from "../../lib/models.ts"
import Table from "./Table.tsx"
import { toastTypes } from "../../lib/constants.ts"
import { Icon } from "@iconify/react"
import { IModelParams } from "../../pages/PairGenerator.tsx"

interface IGeneratorProps {
    next: () => void
    prev: () => void
    modelParams: IModelParams | null
    updateData: () => void
}

const generationSteps = {
    init: "initial",
    progress: "progress",
    done: "done",
}

const Generator = ({ next, prev, modelParams, updateData }: IGeneratorProps) => {
    const [generationStep, setGenerationStep] = useState<string>(generationSteps.init)
    const [generationStatus, setGenerationStatus] = useState<boolean | null>(null)
    const [pairs, setPairs] = useState<[]>([])
    const { selectedChildrenObj, selectedAssistantsObj } = usePairsGenerator()
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()

    // region children table
    const childrenColumns = useMemo<ColumnDef<Child>[]>(
        () => [
            {
                accessorKey: "id",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "first_name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "family_name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "city",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "required_qualification",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "requested_hours",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "street",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "street_number",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "zip_code",
                cell: (info) => info.getValue(),
            },
        ],
        []
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
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "first_name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "family_name",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "city",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "qualification",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "min_capacity",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "max_capacity",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "street",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "street_number",
                cell: (info) => info.getValue(),
            },
            {
                accessorKey: "zip_code",
                cell: (info) => info.getValue(),
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

    const handleGenerate = () => {
        if (!modelParams){
            sendMessage("Model params are not set, aborting execution", toastTypes.error)
            return
        }

        const url = `ws://${window.location.host}/api/pair_generator/ws/generate_pairs`
        const data = {
            children: selectedChildrenObj,
            assistants: selectedAssistantsObj,
            modelParams
        }

        const ws = new WebSocket(url)

        ws.onopen = () => {
            toggleLoading(true)
            sendMessage("Websocket connected", toastTypes.info)
            ws.send(JSON.stringify(data))
        }

        ws.onmessage = (event) => {
            const response = JSON.parse(event.data)
            sendMessage(response.message, response.success ? toastTypes.info : toastTypes.error)
            console.log("Received:", response)
            if (response.status == "done") {
                setGenerationStep(generationSteps.done)
                setGenerationStatus(response.success)
                if (response.success) setPairs(response.data)
            }
        }

        ws.onclose = (event) => {
            console.log("WebSocket disconnected:", event.code, event.reason)
            sendMessage("Websocket disconnected", toastTypes.info)
            toggleLoading(false)
            updateData()
        }

        ws.onerror = (err) => {
            console.error("WebSocket error:", err)
            sendMessage("Unexpected error on server", toastTypes.error)
        }

        //next()
    }

    return (
        <div className="step-3-generator-content w-full h-full flex flex-col gap-4">
            {generationStep === generationSteps.done ? (
                <div className="generator-done flex flex-col gap-5 items-center justify-items-center h-60">
                    {generationStatus ? (
                        <>
                            <Icon
                                icon="solar:check-circle-bold"
                                className="text-success text-8xl"
                            />
                            <p className="text-lg">
                                Pairs generated and saved in Database successfully
                            </p>
                        </>
                    ) : (
                        <>
                            <Icon icon="solar:shield-cross-bold" className="text-error text-8xl" />
                            <p className="text-lg">
                                All or some pairs could not be saved or generated
                            </p>
                            <button className="btn btn-warning">Check system</button>
                        </>
                    )}
                </div>
            ) : (
                <div className="generator-in-progress">
                    <div className="header">
                        <span className="text-2xl font-semibold">Generate pairs</span>
                    </div>
                    <div className="body grid grid-cols-2 gap-6">
                        <div className="children-list-container w-full">
                            <span className="list-header text-lg">Selected children</span>
                            <div className="table-container mt-4">
                                <Table table={childrenPreviewTable} controls={false} />
                            </div>
                        </div>
                        <div className="assistant-list-container w-full">
                            <span className="list-header text-lg">Selected assistants</span>
                            <div className="table-container mt-4">
                                <Table table={assistantsPreviewTable} controls={false} />
                            </div>
                        </div>
                    </div>
                    <div className="flex mt-7 text-md justify-center">
                        <span>
                            Selected <b>{selectedChildrenObj.length}</b> Children and{" "}
                            <b>{selectedAssistantsObj.length}</b> Assistants
                        </span>
                    </div>

                    <div className="generator-controls flex items-center justify-between gap-3 mt-6">
                        <button className="btn btn-soft btn-wide" onClick={prev}>
                            previous step
                        </button>
                        <button
                            className="btn btn-soft btn-wide btn-secondary"
                            onClick={handleGenerate}
                        >
                            generate!
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Generator
