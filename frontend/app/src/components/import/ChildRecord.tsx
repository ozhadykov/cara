import { useState } from "react"
import { useChildRecord } from "../../contexts/ChildRecordContext.tsx"
import { useSidebar } from "../../contexts/SidebarContext.tsx"
import { postRequest } from "../../lib/request.ts"

const ChildrenRecord = () => {
    const { isOpen } = useChildRecord()

    const [formData, setFormData] = useState({
        name: "",
        family_name: "",
        required_qualification: "",
        street: "",
        city: "",
        zip_code: "",
        requested_hours: 0,
    })

    const handleChange = (event: any) => {
        const name = event.target.name
        const value = event.target.value
        setFormData((values) => ({ ...values, [name]: value }))
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()

        try {
            await postRequest("/api/db/children", formData)
        } catch (error) {}
    }

    return (
        <aside
            className={`fixed top-0 right-0 z-30 w-fit h-screen pt-20 
                    border-r border-gray-200 bg-white
                    transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"} `}
        >
            <form className="h-full px-3 pb-4 overflow-y-auto" onSubmit={handleSubmit}>
                <ul className="font-medium flex flex-col px-[10px]">
                    <input
                        className="input"
                        placeholder="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        placeholder="family_name"
                        name="family_name"
                        value={formData.family_name}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        placeholder="required_qualification"
                        name="required_qualification"
                        value={formData.required_qualification}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        placeholder="street"
                        name="street"
                        value={formData.street}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        placeholder="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        placeholder="zip_code"
                        name="zip_code"
                        value={formData.zip_code}
                        onChange={handleChange}
                    />
                    <input
                        className="input"
                        placeholder="requested_hours"
                        name="requested_hours"
                        type="number"
                        value={formData.requested_hours}
                        onChange={handleChange}
                    />
                </ul>

                <button className="btn btn-secondary" type="submit">
                    Submit
                </button>
            </form>
        </aside>
    )
}

export default ChildrenRecord
