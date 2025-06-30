import { useState } from "react"
import { postRequest } from "../../../lib/request.ts"
import { Child, TPersonImport } from "../../../lib/models.ts"

import { useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext.tsx"
import { useChildrenData } from "../../../contexts/providers/ChildrenDataContext.tsx"
import { useLoading, useToast } from "../../../contexts"
import { toastTypes } from "../../../lib/constants.ts"
import ChildrenForm from "./forms/ChildrenForm.tsx"

const ChildCreate = () => {
    const { toggle } = useRecordSidebar()
    const { refreshChildren } = useChildrenData()
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()

    const initialFormData = {
        id: 0,
        first_name: "",
        family_name: "",
        street: "",
        street_number: "",
        city: "",
        zip_code: "",
        time_start: "",
        time_end: "",
        requested_hours: 0,
        required_qualification: -1,
    }
    const [formData, setFormData] = useState<Child>(initialFormData)

    const handleChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        setFormData((values) => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (formData.required_qualification === -1) {
            sendMessage("Please select a required qualification", toastTypes.error)
            return
        }

        try {
            const requestBody: TPersonImport = {
                data: [formData],
            }
            const response = await postRequest(
                "/api/children",
                requestBody,
                sendMessage,
                toggleLoading
            )
            if (response)
                sendMessage(
                    response.message,
                    response.success ? toastTypes.success : toastTypes.error
                )
            toggle()
            await refreshChildren()
            setFormData(initialFormData)
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <>
            <div className="border-b-1 border-gray-200 p-7 flex items-center gap-2 shadow-sm shadow-black/5">
                <h3 className="text-xl font-semibold">Add Child Record</h3>
            </div>

            <ChildrenForm
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                formData={formData}
                formName="create_record_child"
            />
            <div className="flex justify-end gap-6 border-t-1 border-gray-200 p-7 shadow-md shadow-black/5 -translate-y-1">
                <button className="btn btn-ghost px-9" onClick={toggle}>
                    Cancel
                </button>
                <button className="btn btn-secondary px-8" type="submit" form="create_record_child">
                    Create
                </button>
            </div>
        </>
    )
}

export default ChildCreate
