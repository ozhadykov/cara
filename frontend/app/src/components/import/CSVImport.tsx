import { ChangeEvent, FormEvent, useEffect, useState } from "react"
import { Upload } from "solar-icon-set"
import { useToast } from "../../contexts/ToastContext.tsx"
import { toastTypes } from "../../lib/constants.ts"
import Papa from "papaparse"

export type CSVImportProps = {
    importLabel: string
    sendData: () => void
}

type CsvRow = { [key: string]: string | number }

const CsvImport = (props: CSVImportProps) => {
    const [csvData, setCsvData] = useState<CsvRow[]>([])
    const [csvCols, setCsvCols] = useState<string[]>([])
    const { sendMessage } = useToast()

    useEffect(() => {
        renderCSVPreview()
    }, [csvData, csvCols])

    const renderCSVPreview = () => {
        if (csvData.length && csvCols.length) {
            console.log("rendering csv")
            console.log(csvCols)
            console.log(csvData)
        }
    }

    const handleSubmit = (e: FormEvent) => {
        console.log(e)
        e.preventDefault()
        props.sendData()
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
                                    <Upload /> please upload a CSV file, for an import.
                                </span>
                            </div>
                            <div className="upload-controls flex flex-col gap-2">
                                <input
                                    type="file"
                                    className="file-input file-input-secondary w-full"
                                    onChange={handleFileChange}
                                />
                                <button className="btn">upload</button>
                            </div>
                        </div>
                        <div className="children-preview grow pl-2">
                            <span className="text-lg">Preview:</span>
                            <div className="csv-preview">
                                {csvData.length && csvCols.length && (
                                    <div
                                        className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
                                        <table className="table">
                                            {/* head */}
                                            <thead>
                                            <tr>
                                                <th></th>
                                                {csvCols.map((col, idx) => {
                                                    return (
                                                        <th key={idx}>{col}</th>
                                                    )
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
                                                                <td key={`${i}_${item[itemKey]}`}>{item[itemKey]}</td>
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
                <button type="submit" className="btn btn-xl btn-secondary">
                    Save
                </button>
            </form>
        </>
    )
}

export default CsvImport
