import { Upload } from "solar-icon-set"
import { ChangeEvent, FormEvent } from "react"


const CsvImport = () =>  {

    const handleSubmit = (e: FormEvent) => {
        console.log(e)
    }
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e)
    }

    return (
        <>
            <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
                <div className="card shadow-md children-import-form gap-5">
                    <div className="card-body flex-row">
                        <div className="upload-container flex flex-col gap-6 w-1/3 pr-4 border-r-1 border-gray-300">
                            <div className="upload-header flex flex-col">
                                <span className="text-lg mb-1">Children import</span>
                                <span className="text-secondary flex items-center gap-1"><Upload /> please upload a CSV file, for an import.</span>
                            </div>
                            <div className="upload-controls flex flex-col gap-2">
                                <input
                                    type="file"
                                    className="file-input file-input-primary w-full"
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
                <button type="submit" className="btn btn-xl btn-primary">
                    Save
                </button>
            </form>
        </>
    )
}

export default CsvImport