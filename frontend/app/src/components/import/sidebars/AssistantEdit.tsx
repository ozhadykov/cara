import { useState } from "react"
import { postRequest } from "../../../lib/request.ts"
import { Assistant } from "../../../lib/models.ts"

import { useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext.tsx"
import { useToast } from "../../../contexts/providers/ToastContext.tsx"
import { useAssistantData } from "../../../contexts/providers/AssistantDataContext.tsx"

type InputField = {
    name: keyof Assistant
    type: string
}

const AssistantEdit = () => {
    const { sendMessage } = useToast()
    const { toggle, selectedData } = useRecordSidebar()
    const { refreshAssistants } = useAssistantData()

    const [formData, setFormData] = useState<Assistant>({
        id: selectedData.id,
        first_name: selectedData.first_name,
        family_name: selectedData.family_name,
        qualification: selectedData.qualification,
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
            await postRequest(`/api/assistants/${selectedData.id}`, formData, sendMessage)
            toggle()
            await refreshAssistants()
        } catch (error) {}
    }

    const inputFieldData: InputField[] = [
        { name: "first_name", type: "text" },
        { name: "family_name", type: "text" },
        { name: "qualification", type: "text" },
        { name: "street", type: "text" },
        { name: "street_number", type: "text" },
        { name: "zip_code", type: "text" },
        { name: "city", type: "text" },
        { name: "min_capacity", type: "number" },
        { name: "max_capacity", type: "number" },
    ]

    return (
        <>
            <div className="border-b-1 border-gray-200 p-7 flex items-center gap-2 shadow-sm shadow-black/5">
                <h3 className="text-xl font-semibold">Edit Assistant Record</h3>
            </div>

            <div className="overflow-auto scrollbar-hide p-7">
                <form onSubmit={handleSubmit} id="edit_record_assistant">
                    {inputFieldData.map((inputData) => (
                        <div
                            key={inputData.name}
                            className="flex flex-col justify-center bg-gray-200 p-2 rounded-lg w-full mb-8"
                        >
                            <label className="text-xs text-gray-400 mb-1" htmlFor={inputData.name}>
                                {inputData.name}
                            </label>
                            <input
                                name={inputData.name}
                                onChange={handleChange}
                                type={inputData.type}
                                value={formData[inputData.name]}
                                className="outline-none text-sm validator"
                                id={inputData.name}
                                required
                            />
                        </div>
                    ))}
                </form>
            </div>

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
