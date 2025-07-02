import { useState } from "react"
import { postRequest } from "../../../lib/request.ts"
import { Assistant } from "../../../lib/models.ts"

import { useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext.tsx"
import { useToast, useLoading } from "../../../contexts"
import { useAssistantData } from "../../../contexts/providers/AssistantDataContext.tsx"
import AssistantsForm from "./forms/AssistantsForm.tsx"
import { toastTypes } from "../../../lib/constants.ts"

const AssistantEdit = () => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const { toggle, selectedData } = useRecordSidebar()
    const { refreshAssistants } = useAssistantData()

    const [formData, setFormData] = useState<Assistant>({
        id: selectedData.id,
        first_name: selectedData.first_name,
        family_name: selectedData.family_name,
        qualification: selectedData.qualification,
        has_car: selectedData.has_car,
        street: selectedData.street,
        street_number: selectedData.street_number,
        city: selectedData.city,
        zip_code: selectedData.zip_code,
        min_capacity: selectedData.min_capacity,
        max_capacity: selectedData.max_capacity,
    })

    const handleChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        setFormData((values) => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            // todo: check if data changed
            const response = await postRequest(
                `/api/assistants/${selectedData.id}`,
                formData,
                sendMessage,
                toggleLoading
            )
            if (response)
                sendMessage(
                    response.message,
                    response.success ? toastTypes.success : toastTypes.error
                )
            toggle()
            await refreshAssistants()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="border-b-1 border-gray-200 p-7 flex items-center gap-2 shadow-sm shadow-black/5">
                <h3 className="text-xl font-semibold">Edit Assistant Record</h3>
            </div>

            <AssistantsForm
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                formData={formData}
                formName="edit_record_assistant"
            />
            <div className="flex justify-end gap-6 border-t-1 border-gray-200 p-7 shadow-md shadow-black/5 -translate-y-1">
                <button className="btn btn-ghost px-9" onClick={toggle}>
                    Cancel
                </button>
                <button className="btn btn-neutral px-8" type="submit" form="edit_record_assistant">
                    Save Changes
                </button>
            </div>
        </>
    )
}

export default AssistantEdit
