import React, {useEffect, useState} from "react"
import {Icon} from "@iconify/react"
import {Assistant, Child} from "../lib/models.ts"
import {createColumnHelper, getCoreRowModel, useReactTable, flexRender} from "@tanstack/react-table";
import {useLoading, useToast} from "../contexts";
import {toastTypes} from "../lib/constants.ts";

const PairGenerator = () => {
    const [children, setChildren] = useState<Child[]>([])
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const [pairs, setPairs] = useState([])
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [isLoading, setIsLoading] = useState(true);
    const {toggleLoading} = useLoading()
    const {sendMessage} = useToast()

    useEffect(() => {
        const getInitData = async () => {
            try {
                toggleLoading(true)
                const url = "/api/pair_generator"
                const response = await fetch(url)
                const responseData = await response.json()
                setChildren(responseData.data.children)
                setAssistants(responseData.data.assistants)
                setPairs(responseData.data.pairs)
                toggleLoading(false)
            } catch (error: unknown) {
                toggleLoading(false)
                if (error instanceof Error) {
                    console.error("Failed to fetch initial data:", error.message)
                    sendMessage(error.message, toastTypes.error) // Use error.message for more specific feedback
                } else {
                    console.error("An unknown error occurred:", error)
                    sendMessage('An unknown error occurred.', toastTypes.error)
                }
            }
        }

        getInitData()

    }, [])

    // 1. select children to pass in model
    // 2. select assistants to pass in model
    // 3. some settings for some constraints?
    // 4. generate button

    const columnHelper = createColumnHelper<Child>()

    const columns = [
        {
            id: 'select',

        },
        columnHelper.accessor('id', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('first_name', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('family_name', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('city', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('required_qualification', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('requested_hours', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('street', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('street_number', {
            cell: info => info.getValue()
        }),
        columnHelper.accessor('zip_code', {
            cell: info => info.getValue()
        }),
    ]

    const table = useReactTable({
        data: children,
        columns,
        getCoreRowModel: getCoreRowModel(),
        enableRowSelection: true
    })

    console.log(table.getRowModel())
    console.log(table.getHeaderGroups())


    return (
        <div className="generator-content flex flex-col gap-3 w-full h-full">
            <div className="generator-header mb-5">
                <h1 className="text-3xl font-semibold">Pairs generator</h1>
                <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:info-circle-linear"/> Here you can generate and edit pairs
                </span>
            </div>
            <div className="generator-body card shadow-md">
                <div className="card-body bg-white rounded-lg flex flex-row">
                    <div
                        className="flex flex-col items-center justify-center w-1/4 flex-none pr-4 border-r-1 border-gray-300">
                        <div className="generator-steps-navigation">
                            <ul className="steps steps-vertical">
                                <li className="step step-primary">Choose children</li>
                                <li className="step step-primary">Choose assistants</li>
                                <li className="step">Calculate best assigment</li>
                                <li className="step">Get result</li>
                            </ul>
                        </div>
                    </div>
                    <div className="generator-step-content pl-4 h-full">
                        {children && assistants && (
                            <table className="table">
                                <thead>
                                {table.getHeaderGroups().map(headerGroup => (
                                    <tr key={headerGroup.id} className="border-gray-200 border-b-1">
                                        {headerGroup.headers.map(header => (
                                            <th key={header.id}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext()
                                                    )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                                </thead>
                                <tbody>
                                {table.getRowModel().rows.map(row => (
                                    <tr key={row.id}>
                                        {row.getVisibleCells().map(cell => (
                                            <td key={cell.id}>
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PairGenerator
