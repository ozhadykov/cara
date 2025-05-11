import { ChangeEvent, FormEvent, useState } from "react"
import { Upload } from "solar-icon-set"
import { useToast } from "../../contexts/ToastContext.tsx"
import Papa from "papaparse"


export type CSVImportProps = {
    importLabel: string,
    sendData: () => void
}

const CsvImport = (props: CSVImportProps) => {
    const [csvData, setCsvData] = useState<object | null>(null)
    const [csvCols, setCsvCols] = useState<string[]>([])
    const [error, setError] = useState<string>("")
    const { sendMessage, toggle } = useToast()


    const handleSubmit = (e: FormEvent) => {
        console.log(e)
        e.preventDefault()
        props.sendData()
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log('hi')
        // reading file
        const file = e.target.files?.[0]
        if (file) {
            if (file.type !== "text/csv") {
                sendMessage("Input only accepts csv files")
                toggle()
                setCsvData(null)
                return
            }

            const reader = new FileReader()
            reader.onload = (e) => {
                const content = e.target.result

                Papa.parse(content, {
                    header: true,
                    complete: (result) => {
                        setCsvData(result.data)
                        setCsvCols(result.meta.fields)
                    },
                    error: (error) => {
                        console.error(error)
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
                                <span className="text-gray-400 flex items-center gap-1"><Upload /> please upload a CSV file, for an import.</span>
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