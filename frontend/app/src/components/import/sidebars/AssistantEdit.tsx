import { postRequest } from "../../../lib/request.ts"

import { useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext.tsx"
import { useToast, useLoading } from "../../../contexts"
import { useAssistantData } from "../../../contexts/providers/AssistantDataContext.tsx"
import AssistantsForm from "./forms/AssistantsForm.tsx"
import { toastTypes } from "../../../lib/constants.ts"

const AssistantEdit = () => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const { toggle, selectedData, setSelectedData } = useRecordSidebar()
    const { refreshAssistants } = useAssistantData()

    const handleChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        setSelectedData((values: any) => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            // todo: check if data changed
            const response = await postRequest(
                `/api/assistants/${selectedData.id}`,
                selectedData,
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
                formData={selectedData}
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
