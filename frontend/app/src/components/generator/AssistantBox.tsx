import { Icon } from "@iconify/react/dist/iconify.js"
import { Assistant } from "../../lib/models"

type AssistantBoxProps = {
    assistant: Assistant
}

const AssistantBox = ({ assistant }: AssistantBoxProps) => {
    return (
        <div className="flex-1 flex flex-col p-5">
            <div className="rounded-2xl border-1 h-full border-green-200 p-5 gap-5 flex flex-col">
                <div className="flex gap-5 items-center">
                    <div className={`p-2 rounded-full bg-green-100`}>
                        <Icon
                            icon="solar:users-group-rounded-line-duotone"
                            className="text-3xl text-green-600"
                        />
                    </div>

                    <div className="flex flex-col">
                        <span className="font-semibold text-lg">
                            {assistant.first_name} {assistant.family_name}
                        </span>
                        <div className="badge bg-green-100 badge-md text-green-600">Assistant</div>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Icon icon="solar:book-outline" className="text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            QUALIFICATION
                        </p>
                        <p className="text-sm text-gray-700">{assistant.qualification_text}</p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Icon icon="solar:clock-circle-outline" className="text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">CAPACITY</p>
                        <p className="text-sm text-gray-700">
                            {assistant.min_capacity}h - {assistant.max_capacity}h
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Icon icon="solar:map-point-linear" className="text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Address</p>
                        <p className="text-sm text-gray-700">
                            {assistant.street} {assistant.street_number}
                        </p>
                        <p className="text-sm text-gray-700">
                            {assistant.zip_code} {assistant.city}
                        </p>
                    </div>
                </div>

                <div className="flex items-start gap-2">
                    <Icon icon="solar:wheel-outline" className="text-xl" />
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Has a Car?</p>
                        <p className="text-sm text-gray-700">{assistant.has_car ? "Yes" : "No"}</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AssistantBox
