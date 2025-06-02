import { Assistant } from "../../../../lib/models"

type AssistantFormType = {
    handleChange: (e: any) => void
    handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
    formData: Assistant
    formName: string
}

const AssistantsForm = ({ handleChange, handleSubmit, formData, formName }: AssistantFormType) => {
    type InputField = {
        name: keyof Assistant
        type: string
    }

    const inputFieldData: InputField[] = [
        { name: "first_name", type: "text" },
        { name: "family_name", type: "text" },
        { name: "street", type: "text" },
        { name: "street_number", type: "text" },
        { name: "zip_code", type: "text" },
        { name: "city", type: "text" },
        { name: "min_capacity", type: "number" },
        { name: "max_capacity", type: "number" },
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
                    name="qualification"
                    id="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    required
                    className="select outline-none text-sm"
                >
                    <option disabled value={-1}>
                        Select qualification
                    </option>
                    <option value={1}>QHK</option>
                    <option value={2}>ReKo</option>
                    <option value={3}>HK</option>
                </select>
            </form>
        </div>
    )
}

export default AssistantsForm
