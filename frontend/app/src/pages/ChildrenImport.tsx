import { Icon } from "@iconify/react"
import { CSVImport, ChildrenSingleImport } from "../components"
import { postRequest } from "../lib/request"
import { toastTypes } from "../lib/constants"
import { useState } from "react"
import { useLoading, useToast } from "../contexts"
import { Assistant, Child, TPersonImport } from "../lib/models.ts"

const ChildrenImport = () => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const [refreshChildren, setRefreshChildren] = useState(false)

    const sendData = async (children: Child[] | Assistant[]) => {
        const url = "/api/children"
        const requestBody: TPersonImport = {
            data: children,
        }
        const response = await postRequest(url, requestBody, sendMessage, toggleLoading)
        if (response)
            sendMessage(response.message, response.success ? toastTypes.success : toastTypes.error)

        if (response.success) setRefreshChildren(!refreshChildren)
    }

    return (
        <div className="data-import flex flex-col gap-3 w-full h-full">
            <div className="data-import-header mb-5">
                <h1 className="text-3xl font-semibold">Children Import</h1>
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
                        <ChildrenSingleImport refresh={refreshChildren} />
                    </div>
                    <label className="tab">
                        <input type="radio" name="my_tabs_4" />
                        <Icon icon="solar:import-linear" />
                        CSV Import
                    </label>
                    <div className="tab-content bg-base-100 border-base-300 p-6">
                        <CSVImport importLabel={"Children Import"} sendData={sendData} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChildrenImport
