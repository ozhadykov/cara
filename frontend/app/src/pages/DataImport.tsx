import { InfoCircle, Import, Help, SmileCircle } from "solar-icon-set"
import { CSVImport } from "../components"

const DataImport = () => {

    return (
        <div className="data-import flex flex-col gap-3 w-full h-full">
            <div className="data-import-header mb-5">
                <h1 className="text-3xl font-semibold">Data Import</h1>
                <span className="mt-1 text-sm text-secondary flex items-center gap-1"><InfoCircle /> Here you can import data with csv or single input</span>
            </div>
            <div className="tab-container shadow-md">
                <div className="tabs tabs-lift">
                    <label className="tab">
                        <input type="radio" name="my_tabs_4" defaultChecked />
                        <Import />
                        CSV Import
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <CSVImport />
                    </div>

                    <label className="tab">
                        <input type="radio" name="my_tabs_4" />
                        <SmileCircle />
                        <span className="ml-1">Children Import</span>
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 2</div>

                    <label className="tab">
                        <input type="radio" name="my_tabs_4" />
                        <SmileCircle />
                        <span className="ml-1">Children</span>
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 2</div>

                    <label className="tab">
                        <input type="radio" name="my_tabs_4" />
                        <Help />
                        <span className="ml-1">Assistants</span>
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">Tab content 3</div>
                </div>
            </div>

        </div>
    )
}

export default DataImport
