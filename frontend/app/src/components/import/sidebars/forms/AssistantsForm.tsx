import { Assistant } from "../../../../lib/models"
import InputWrapper from "./InputWrapper"

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

    return (
        <div className="overflow-auto scrollbar-hide p-7">
            <form onSubmit={handleSubmit} id={formName}>
                <h6>Name</h6>
                <div className="flex gap-5">
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

                <h6>Address</h6>
                <div className="flex flex-row gap-5">
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

                <h6>Capacity</h6>
                <div className="flex gap-5">
                    <InputWrapper htmlFor="min_capacity" labelText="min_capacity">
                        <input
                            name="min_capacity"
                            onChange={handleChange}
                            type="number"
                            min={0}
                            value={formData.min_capacity}
                            className="outline-none text-sm validator"
                            required
                            id="min_capacity"
                        />
                    </InputWrapper>
                    <InputWrapper htmlFor="max_capacity" labelText="max_capacity">
                        <input
                            name="max_capacity"
                            onChange={handleChange}
                            type="number"
                            min={0}
                            value={formData.max_capacity}
                            className="outline-none text-sm validator"
                            required
                            id="max_capacity"
                        />
                    </InputWrapper>
                </div>

                <h6>Qualification</h6>
                <InputWrapper htmlFor="qualification" labelText="qualification">
                    <select
                        name="qualification"
                        id="qualification"
                        value={formData.qualification}
                        onChange={handleChange}
                        required
                        className="outline-none text-sm validator"
                    >
                        <option disabled value={-1}>
                            Select qualification
                        </option>
                        <option value={3}>QHK</option>
                        <option value={1}>ReKo</option>
                        <option value={2}>HK</option>
                    </select>
                </InputWrapper>
               <InputWrapper htmlFor="has car" labelText="owns a car">
                    <select
                        name="has_car"
                        id="has_car"
                        value={formData.has_car}
                        onChange={handleChange}
                        required
                        className="outline-none text-sm validator"
                    >
                        <option disabled value={-1}>
                            Does assistant has a car?
                        </option>
                        <option value={1}>yes</option>
                        <option value={0}>no</option>
                    </select>
                </InputWrapper>
            </form>
        </div>
    )
}

export default AssistantsForm
