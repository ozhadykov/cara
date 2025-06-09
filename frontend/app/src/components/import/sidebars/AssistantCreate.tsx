import { useState } from "react"
import { postRequest } from "../../../lib/request.ts"
import { Assistant, TAssistantImport } from "../../../lib/models.ts"

import { useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext.tsx"
import { useToast } from "../../../contexts/providers/ToastContext.tsx"
import { toastTypes } from "../../../lib/constants.ts"
import { useAssistantData } from "../../../contexts/providers/AssistantDataContext.tsx"
import AssistantsForm from "./forms/AssistantsForm.tsx"

const AssistantCreate = () => {
    const { toggle } = useRecordSidebar()
    const { refreshAssistants } = useAssistantData()
    const { sendMessage } = useToast()

    const initialFormData = {
        id: 0,
        first_name: "",
        family_name: "",
        qualification: -1,
        has_car: false,
        street: "",
        street_number: "",
        city: "",
        zip_code: "",
        time_start: "",
        time_end: "",
        min_capacity: 0,
        max_capacity: 0,
    }
    const [formData, setFormData] = useState<Assistant>(initialFormData)

    const handleChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        setFormData((values) => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formData.qualification === -1) {
            sendMessage("Please select a required qualification", toastTypes.error)
            return
        }

        try {
            const requestBody: TAssistantImport = {
                assistants: [formData],
            }
            const response = await postRequest("/api/assistants", requestBody, sendMessage)
            if (response)
                sendMessage(
                    response.message,
                    response.success ? toastTypes.success : toastTypes.error
                )
            toggle()
            await refreshAssistants()
            setFormData(initialFormData)
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className="border-b-1 border-gray-200 p-7 flex items-center gap-2 shadow-sm shadow-black/5">
                <h3 className="text-xl font-semibold">Add Assistant Record</h3>
            </div>

            <AssistantsForm
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                formData={formData}
                formName="create_record_assistant"
            />

            <div className="flex justify-end gap-6 border-t-1 border-gray-200 p-7 shadow-md shadow-black/5 -translate-y-1">
                <button className="btn btn-ghost px-9" onClick={toggle}>
                    Cancel
                </button>
                <button
                    className="btn btn-secondary px-8"
                    type="submit"
                    form="create_record_assistant"
                >
                    Create
                </button>
            </div>
        </>
    )
}

export default AssistantCreate
