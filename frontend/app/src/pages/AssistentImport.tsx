import { Icon } from "@iconify/react"
import { CSVImport, AssistentSingleImport } from "../components"
import { postRequest } from "../lib/request"
import { toastTypes } from "../lib/constants"
import { useLoading, useToast } from "../contexts"
import { useState } from "react"
import { Assistant } from "../lib/models"

const AssistentImport = () => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const [refreshAssistants, setRefreshAssistants] = useState(false)

    const sendData = async (assistant: Assistant[]) => {
        console.log("Sending data...")
        const url = "/api/db/assistants?multiple=1"
        const requestBody = {
            assistant,
        }
        const response = await postRequest(url, requestBody, sendMessage, toggleLoading)
        if (response)
            sendMessage(response.message, response.success ? toastTypes.success : toastTypes.error)

        if (response.success) setRefreshAssistants(!refreshAssistants)
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
                        <input type="radio" name="my_tabs_4" defaultChecked />
                        <Icon icon="solar:smile-circle-linear" />
                        <span className="ml-1">Single Import</span>
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <AssistentSingleImport refresh={refreshAssistants} />
                    </div>

                    <label className="tab">
                        <input type="radio" name="my_tabs_4" />
                        <Icon icon="solar:import-linear" />
                        CSV Import
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <CSVImport importLabel={"Assistent Import"} sendData={() => sendData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssistentImport
