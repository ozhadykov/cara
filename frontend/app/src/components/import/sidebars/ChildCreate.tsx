import { useState } from "react"
import { postRequest } from "../../../lib/request.ts"
import { Child, TChildImport } from "../../../lib/models.ts"

import { useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext.tsx"
import { useChildrenData } from "../../../contexts/providers/ChildrenDataContext.tsx"
import { useToast } from "../../../contexts/providers/ToastContext.tsx"
import { toastTypes } from "../../../lib/constants.ts"

type InputField = {
    name: keyof Child
    type: string
}

const ChildCreate = () => {
    const { toggle } = useRecordSidebar()
    const { refreshChildren } = useChildrenData()
    const { sendMessage } = useToast()

    const initialFormData = {
        id: 0,
        first_name: "",
        family_name: "",
        required_qualification: "",
        street: "",
        street_number: "",
        city: "",
        zip_code: "",
        time_start: "",
        time_end: "",
        requested_hours: 0,
    }
    const [formData, setFormData] = useState<Child>(initialFormData)

    const handleChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        setFormData((values) => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        try {
            const requestBody: TChildImport = {
                children: [formData],
            }
            const response = await postRequest("/api/children", requestBody, sendMessage)
            if (response)
                sendMessage(response.message, response.success ? toastTypes.success : toastTypes.error)
            toggle()
            await refreshChildren()
            setFormData(initialFormData)
        } catch (error) {
            console.log(error)
        }
    }

    const inputFieldData: InputField[] = [
        { name: "first_name", type: "text" },
        { name: "family_name", type: "text" },
        { name: "required_qualification", type: "text" },
        { name: "street", type: "text" },
        { name: "street_number", type: "text" },
        { name: "zip_code", type: "text" },
        { name: "city", type: "text" },
        { name: "requested_hours", type: "number" },
    ]

    return (
        <>
            <div className="border-b-1 border-gray-200 p-7 flex items-center gap-2 shadow-sm shadow-black/5">
                <h3 className="text-xl font-semibold">Add Child Record</h3>
            </div>

            <div className="overflow-auto scrollbar-hide p-7">
                <form onSubmit={handleSubmit} id="create_record_child">
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
                                required
                                id={inputData.name}
                            />
                        </div>
                    ))}
                </form>
            </div>

            <div
                className="flex justify-end gap-6 border-t-1 border-gray-200 p-7 shadow-md shadow-black/5 -translate-y-1">
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
