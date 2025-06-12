import { Child } from "../../../../lib/models"
import InputGroup from "./InputGroup"
import InputWrapper from "./InputWrapper"

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
                <InputGroup header="Name">
                    <div className="flex gap-5">
                        {" "}
                        <InputWrapper htmlFor="first_name" labelText="first_name">
                            <input
                                name="first_name"
                                onChange={handleChange}
                                type="text"
                                value={formData.first_name}
                                className="outline-none text-sm validator"
                                required
                                id="first_name"
                            />
                        </InputWrapper>
                        <InputWrapper htmlFor="family_name" labelText="family_name">
                            <input
                                name="family_name"
                                onChange={handleChange}
                                type="text"
                                value={formData.family_name}
                                className="outline-none text-sm validator"
                                required
                                id="family_name"
                            />
                        </InputWrapper>
                    </div>
                </InputGroup>

                <InputGroup header="Adress">
                    <div className="flex gap-5">
                        <InputWrapper htmlFor="street" labelText="street" basis="5/6">
                            <input
                                name="street"
                                onChange={handleChange}
                                type="text"
                                value={formData.street}
                                className="outline-none w-full validator text-sm"
                                required
                                id="street"
                            />
                        </InputWrapper>
                        <InputWrapper htmlFor="street_number" labelText="No." basis="1/6">
                            <input
                                name="street_number"
                                onChange={handleChange}
                                type="text"
                                value={formData.street_number}
                                className="outline-none w-full validator text-sm"
                                required
                                id="street_number"
                            />
                        </InputWrapper>
                    </div>
                    <div className="flex gap-5">
                        <InputWrapper htmlFor="zip_code" labelText="zip_code" basis="1/4">
                            <input
                                name="zip_code"
                                onChange={handleChange}
                                type="text"
                                value={formData.zip_code}
                                className="outline-none text-sm validator w-full"
                                required
                                id="zip_code"
                            />
                        </InputWrapper>
                        <InputWrapper htmlFor="city" labelText="city" basis="3/4">
                            <input
                                name="city"
                                onChange={handleChange}
                                type="text"
                                value={formData.city}
                                className="outline-none text-sm validator w-full"
                                required
                                id="city"
                            />
                        </InputWrapper>
                    </div>
                </InputGroup>

                <InputGroup header="Requested Hours">
                    <div className="flex gap-5">
                        <InputWrapper htmlFor="requested_hours" labelText="requested_hours">
                            <input
                                name="requested_hours"
                                onChange={handleChange}
                                type="number"
                                min={0}
                                value={formData.requested_hours}
                                className="outline-none text-sm validator"
                                required
                                id="requested_hours"
                            />
                        </InputWrapper>
                    </div>
                </InputGroup>

                <InputGroup header="Required Qualification">
                    <InputWrapper
                        htmlFor="required_qualification"
                        labelText="required_qualification"
                    >
                        <select
                            name="required_qualification"
                            id="required_qualification"
                            value={formData.required_qualification}
                            onChange={handleChange}
                            required
                            className="outline-none text-sm validator"
                        >
                            <option disabled value={-1}>
                                Select Required Qualification
                            </option>
                            <option value={3}>QHK</option>
                            <option value={1}>ReKo</option>
                            <option value={2}>HK</option>
                        </select>
                    </InputWrapper>
                </InputGroup>
            </form>
        </div>
    )
}

export default ChildrenForm
