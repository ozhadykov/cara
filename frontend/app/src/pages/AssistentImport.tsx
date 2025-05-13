import { Icon } from "@iconify/react"
import { CSVImport, AssistentSingleImport } from "../components"

const AssistentImport = () => {
    const sendData = () => {
        console.log("Sending data...")
    }

    return (
        <div className="data-import flex flex-col gap-3 w-full h-full">
            <div className="data-import-header mb-5">
                <h1 className="text-3xl font-semibold">Assistent Import</h1>
                <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:info-circle-linear" /> Here you can import data with csv or
                    single input
                </span>
            </div>
            <div className="tab-container shadow-md">
                <div className="tabs tabs-lift">
                    <label className="tab">
                        <input type="radio" name="my_tabs_4" />
                        <Icon icon="solar:import-linear" />
                        CSV Import
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <CSVImport importLabel={"Assistent Import"} sendData={sendData} />
                    </div>

                    <label className="tab">
                        <input type="radio" name="my_tabs_4" defaultChecked />
                        <Icon icon="solar:smile-circle-linear" />
                        <span className="ml-1">Single Import</span>
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <AssistentSingleImport />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssistentImport
