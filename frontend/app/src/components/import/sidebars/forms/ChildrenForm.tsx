import { Child } from "../../../../lib/models"

type ChildrenFormType = {
    handleChange: (e: any) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    formData: Child
    formName: string
}

const ChildrenForm = ({ handleChange, handleSubmit, formData, formName }: ChildrenFormType) => {
    type InputField = {
        name: keyof Child
        type: string
    }

    const inputFieldData: InputField[] = [
        { name: "first_name", type: "text" },
        { name: "family_name", type: "text" },
        { name: "street", type: "text" },
        { name: "street_number", type: "text" },
        { name: "zip_code", type: "text" },
        { name: "city", type: "text" },
        { name: "requested_hours", type: "number" },
    ]

    return (
        <div className="overflow-auto scrollbar-hide p-7">
            <form onSubmit={handleSubmit} id={formName}>
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

                <select
                    name="required_qualification"
                    id="required_qualification"
                    value={formData.required_qualification}
                    onChange={handleChange}
                    required
                    className="select outline-none text-sm"
                >
                    <option disabled value={-1}>
                        Select required qualification
                    </option>
                    <option value={1}>QHK</option>
                    <option value={2}>ReKo</option>
                    <option value={3}>HK</option>
                </select>
            </form>
        </div>
    )
}

export default ChildrenForm
