import { ChangeEvent, FormEvent, useState } from "react"
import { Icon } from "@iconify/react"
import { useToast } from "../../contexts/providers/ToastContext.tsx"
import { toastTypes } from "../../lib/constants.ts"
import Papa from "papaparse"

export type CSVImportProps = {
    importLabel: string
    sendData: (dataCols: string[], dataRows: CsvRow[]) => void
}

export type CsvRow = { [key: string]: string | number }

const CsvImport = (props: CSVImportProps) => {
    const [csvData, setCsvData] = useState<CsvRow[]>([])
    const [csvCols, setCsvCols] = useState<string[]>([])
    const { sendMessage } = useToast()

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault()
        props.sendData(csvCols, csvData)
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        // reading file
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== "text/csv") {
                sendMessage("Input only accepts csv files", toastTypes.error)
                setCsvData([])
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target!.result
                //@ts-ignore
                Papa.parse(content, {
                    header: true,
                    skipEmptyLines: true,
                    complete: (result) => {
                        //@ts-ignore
                        setCsvData(result.data)
                        setCsvCols(result.meta.fields!)
                        sendMessage("CSV read successfully", toastTypes.success)
                    },
                    error: (error) => {
                        console.error(error.message)
                        sendMessage("Error reading CSV file", toastTypes.error)
                    },
                })
            }
            reader.readAsText(file)
        }
    }

    return (
        <>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="card shadow-md children-import-form gap-5">
                    <div className="card-body flex-row">
                        <div className="upload-container flex flex-col gap-6 w-1/3 pr-4 border-r-1 border-gray-300">
                            <div className="upload-header flex flex-col">
                                <span className="text-lg mb-1">{props.importLabel}</span>
                                <span className="text-gray-400 flex items-center gap-1">
                                    <Icon icon="solar-upload-minimalistic-linear" /> please upload a
                                    CSV file, for an import.
                                </span>
                            </div>
                            <div className="upload-controls flex flex-col gap-2">
                                <input
                                    type="file"
                                    className="file-input file-input-secondary w-full"
                                    onChange={handleFileChange}
                                />
                                <button type="submit" className="btn">
                                    upload
                                </button>
                            </div>
                        </div>
                        <div className="children-preview grow pl-2">
                            <span className="text-lg">Preview:</span>
                            <div className="csv-preview">
                                {csvData.length && csvCols.length && (
                                    <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                                        <table className="table">
                                            {/* head */}
                                            <thead>
                                                <tr>
                                                    <th></th>
                                                    {csvCols.map((col, idx) => {
                                                        return <th key={idx}>{col}</th>
                                                    })}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {csvData.map((item, i) => {
                                                    return (
                                                        <tr key={i}>
                                                            <th>{i}</th>
                                                            {Object.keys(item).map((itemKey) => {
                                                                return (
                                                                    <td
                                                                        key={`${i}_${item[itemKey]}`}
                                                                    >
                                                                        {item[itemKey]}
                                                                    </td>
                                                                )
                                                            })}
                                                        </tr>
                                                    )
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
}

export default CsvImport
