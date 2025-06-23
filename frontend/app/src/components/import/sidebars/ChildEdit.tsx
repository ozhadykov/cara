import { useState } from "react"
import { postRequest } from "../../../lib/request.ts"
import { Child } from "../../../lib/models.ts"

import { useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext.tsx"
import { useChildrenData } from "../../../contexts/providers/ChildrenDataContext.tsx"
import { useToast, useLoading } from "../../../contexts"
import ChildrenForm from "./forms/ChildrenForm.tsx"
import { toastTypes } from "../../../lib/constants.ts"

const ChildEdit = () => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const { toggle, selectedData } = useRecordSidebar()
    const { refreshChildren } = useChildrenData()

    const [formData, setFormData] = useState<Child>({
        id: selectedData.id,
        first_name: selectedData.first_name,
        family_name: selectedData.family_name,
        required_qualification: selectedData.required_qualification,
        street: selectedData.street,
        street_number: selectedData.street_number,
        city: selectedData.city,
        zip_code: selectedData.zip_code,
        requested_hours: selectedData.requested_hours,
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
            const response = await postRequest(`/api/children/${selectedData.id}`, formData, sendMessage, toggleLoading)
            if (response)
                sendMessage(
                    response.message,
                    response.success ? toastTypes.success : toastTypes.error
                )
            toggle()
            await refreshChildren()
        } catch (error) {
            console.error(error)
        }
    }

    return (
        <>
            <div className="border-b-1 border-gray-200 p-7 flex items-center gap-2 shadow-sm shadow-black/5">
                <h3 className="text-xl font-semibold">Edit Child Record</h3>
            </div>

            <ChildrenForm
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                formData={formData}
                formName="edit_record_child"
            />

            <div
                className="flex justify-end gap-6 border-t-1 border-gray-200 p-7 shadow-md shadow-black/5 -translate-y-1">
                <button className="btn btn-ghost px-9" onClick={toggle}>
                    Cancel
                </button>
                <button className="btn btn-neutral px-8" type="submit" form="edit_record_child">
                    Save Changes
                </button>
            </div>
        </>
    )
}

export default ChildEdit
