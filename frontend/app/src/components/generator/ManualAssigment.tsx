import { useState } from "react"
import Select from "react-select"
import { toastTypes } from "../../lib/constants.ts"
import { useLoading, useToast } from "../../contexts"
import { Assistant, Child } from "../../lib/models.ts"
import { postRequest } from "../../lib/request.ts"
import AssistantBox from "./AssistantBox.tsx"
import ChildBox from "./ChildBox.tsx"
import { Icon } from "@iconify/react/dist/iconify.js"

interface ManualAssigmentProps {
    children: Child[]
    assistants: Assistant[]
}

interface SelectOption {
    value: number
    label: string
}

interface CompatibilityResponse {
    free_hours: number
    used_hours: number
    is_qualified: boolean
}

const ManualAssigment = ({ children, assistants }: ManualAssigmentProps) => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const [selectedChild, setSelectedChild] = useState<Child | null>(null)
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null)
    const [selectedChildForSelect, setSelectedChildForSelect] = useState<SelectOption | null>(null)

    const [usedHoursText, setUsedHoursText] = useState<string>("")
    const [freeHoursText, setFreeHoursText] = useState<string>("")

    const [isQualified, setIsQualified] = useState<boolean>(false)
    const [hasCapacity, setHasCapacity] = useState<boolean>(false)

    const [selectedAssistantForSelect, setSelectedAssistantForSelect] =
        useState<SelectOption | null>(null)

    const handleChildSelectChange = async (e: any) => {
        const childId = e.value
        const childObj = children.find((obj) => obj.id === childId)
        setSelectedChild(childObj ?? null)
        setSelectedChildForSelect(e)

        if (selectedAssistant && childObj) {
            await handleAllSelected(childObj, selectedAssistant)
        }
    }

    const handleAssistantSelectChange = async (e: any) => {
        const assistantId = e.value
        const assistantObj = assistants.find((obj) => obj.id === assistantId)
        setSelectedAssistant(assistantObj ?? null)
        setSelectedAssistantForSelect(e)

        if (selectedChild && assistantObj) {
            await handleAllSelected(selectedChild, assistantObj)
        }
    }

    const handleAllSelected = async (child: Child, assistant: Assistant) => {
        const data = { child_id: child.id, assistant_id: assistant.id }
        const response: CompatibilityResponse = await postRequest(
            "/api/pair_generator/capacity",
            data,
            sendMessage,
            toggleLoading
        )

        setFreeHoursText(response.free_hours.toString())
        setUsedHoursText(response.used_hours.toString())
        setIsQualified(response.is_qualified)

        setHasCapacity(
            response.used_hours + child.requested_hours <= response.free_hours &&
                response.is_qualified
        )
    }

    const childrenOptions = children.map((child) => {
        return {
            value: child.id,
            label: `${child.first_name} ${child.family_name}, ID: ${child.id}`,
        }
    })

    const assistantsOptions = assistants.map((assistant) => {
        return {
            value: assistant.id,
            label: `${assistant.first_name} ${assistant.family_name}, ID: ${assistant.id}`,
        }
    })

    const getProgressColor = (used: number, total: number) => {
        const progress = (used / total) * 100

        if (progress >= 100) {
            return "progress-error"
        }
        if (progress > 50) {
            return "progress-warning"
        }

        return "progress-success"
    }

    const createCustomPair = async () => {
        if (selectedAssistant && selectedChild) {
            const data = {
                child: selectedChild,
                assistant: selectedAssistant,
            }

            const url = "/api/pair_generator/single_pair"

            const response = await postRequest(url, data, sendMessage, toggleLoading)
            if (response)
                sendMessage(
                    response.message,
                    response.success ? toastTypes.success : toastTypes.error
                )

            if (response.success) {
                setSelectedAssistant(null)
                setSelectedChild(null)
                setSelectedAssistantForSelect(null)
                setSelectedChildForSelect(null)
                setFreeHoursText("")
                setUsedHoursText("")
                setHasCapacity(false)
                setIsQualified(false)
            }

            return
        }

        sendMessage("Please select child and assistant", toastTypes.warning)
    }

    const styles = {
        success: "bg-green-50 text-green-700 border-green-200",
        error: "bg-red-50 text-red-700 border-red-200",
    }

    const icons = {
        success: "solar:clock-circle-outline",
        error: "solar:close-circle-line-duotone",
    }

    return (
        <div className="manual-assigment-container flex flex-col gap-8">
            <div className="select-container flex gap-8 items-stretch">
                <div className="child-select-container w-1/2 flex flex-col">
                    <label htmlFor="children-select" className="mb-3 block">
                        Choose child
                    </label>
                    <Select
                        options={childrenOptions}
                        className="children-select"
                        onChange={handleChildSelectChange}
                        value={selectedChildForSelect}
                    />
                    {selectedChild && (
                        <div className="child-compare-box mt-6 flex-1 flex flex-col">
                            <div className="divider">Child info</div>
                            <div className="flex-1 flex flex-col h-full">
                                <ChildBox child={selectedChild} />
                            </div>
                        </div>
                    )}
                </div>

                <div className="divider lg:divider-horizontal"></div>

                <div className="assistant-select-container w-1/2 flex flex-col">
                    <label htmlFor="assistant-select" className="mb-3 block">
                        Choose assistant
                    </label>
                    <Select
                        options={assistantsOptions}
                        className="assistant-select"
                        onChange={handleAssistantSelectChange}
                        value={selectedAssistantForSelect}
                    />
                    {selectedAssistant && (
                        <div className="assistant-compare-box mt-6 flex-1 flex flex-col">
                            <div className="divider">Assistant info</div>
                            <div className="flex-1 flex flex-col h-full">
                                <AssistantBox assistant={selectedAssistant} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {selectedChild && selectedAssistant && freeHoursText && (
                <div className="flex flex-col rounded-2xl w-1/2 self-center shadow-md">
                    <div
                        className={`flex justify-between items-center  ${
                            isQualified && hasCapacity
                                ? "bg-gradient-to-r from-green-50 to-emerald-50"
                                : "bg-gradient-to-r from-red-50 to-orange-50'}"
                        } px-6 py-4 rounded-t-2xl p-5`}
                    >
                        <div className="flex flex-col">
                            <div className="flex items-center gap-4">
                                <div
                                    className={`p-2 rounded-full ${
                                        isQualified && hasCapacity
                                            ? "bg-green-100 text-success"
                                            : "bg-red-100 text-error"
                                    }`}
                                >
                                    <Icon
                                        icon={
                                            isQualified && hasCapacity ? icons.success : icons.error
                                        }
                                        className="text-3xl"
                                    />
                                </div>

                                <div className="flex flex-col">
                                    <span className="font-bold text-lg">
                                        {isQualified && hasCapacity
                                            ? "Compatible Match"
                                            : "Incompatible Match"}
                                    </span>
                                    <span className="text-gray-500 text-sm">
                                        {isQualified && hasCapacity
                                            ? "This pairing meets all requirements"
                                            : "This pairing has compatibility issues"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {hasCapacity && isQualified ? (
                            <button
                                className={`btn btn-wide btn-primary`}
                                onClick={createCustomPair}
                            >
                                Create Pair
                            </button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <div className="flex flex-col flex-grow gap-2 items-stretch p-5">
                        <div className="flex gap-2 items-center">
                            <Icon icon="solar:clock-circle-outline" className="text-xl" />
                            <span className="font-semibold">Capacity</span>
                        </div>
                        <div className="bg-gray-100 w-full p-5 rounded-2xl flex flex-col">
                            <div className="flex justify-between">
                                <span className="text-gray-500 text-sm mb-2">
                                    Assistant Availability
                                </span>
                                <span className={`${hasCapacity ? "" : "text-red-600"}`}>
                                    {usedHoursText}/{selectedAssistant.max_capacity}
                                </span>
                            </div>

                            <progress
                                className={`progress ${getProgressColor(
                                    parseInt(usedHoursText),
                                    selectedAssistant.max_capacity
                                )} w-full`}
                                value={
                                    (parseInt(usedHoursText) / selectedAssistant.max_capacity) * 100
                                }
                                max="100"
                            ></progress>
                            <div className="flex gap-10 mt-5">
                                <div className="bg-white rounded-2xl p-5 flex flex-col flex-1 items-center border-gray-200">
                                    <span className={`font-bold text-xl`}>{freeHoursText}</span>
                                    <span className="text-gray-500">Hours Available</span>
                                </div>
                                <div className="bg-white rounded-2xl p-5 flex flex-col flex-1 items-center border-gray-200">
                                    <span
                                        className={`font-bold text-xl ${
                                            hasCapacity ? "" : "text-error"
                                        }`}
                                    >
                                        {selectedChild.requested_hours}
                                    </span>
                                    <span className="text-gray-500">Hours Needed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col flex-grow gap-2 items-stretch p-5">
                        <div className="flex gap-2 items-center">
                            {" "}
                            <Icon icon="solar:book-outline" className="text-xl" />
                            <span className="font-semibold">Qualification</span>
                        </div>
                        <div className="bg-gray-100 w-full p-5 rounded-2xl flex flex-col">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-4 items-center">
                                    <div className="p-2 bg-blue-100 rounded-lg">
                                        <Icon
                                            icon="solar:people-nearby-line-duotone"
                                            className="text-3xl text-blue-600"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        {" "}
                                        <span className="font-bold">Child Requirement</span>
                                        <span>{selectedChild.required_qualification_text}</span>
                                        <span className=" text-gray-500 text-sm">
                                            Level {selectedChild.required_qualification_value}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-gray-500">
                                    <div className="h-px bg-gray-400 w-8"></div>
                                    <span className="text-md font-medium">VS</span>
                                    <div className="h-px bg-gray-400 w-8"></div>
                                </div>

                                <div className="flex gap-4 items-center">
                                    <div className="flex flex-col">
                                        {" "}
                                        <span className="font-bold">Assistant Level</span>
                                        <span className="text-right">
                                            {selectedAssistant.qualification_text}
                                        </span>
                                        <span className="text-right text-gray-500 text-sm">
                                            Level {selectedAssistant.qualification_value}
                                        </span>
                                    </div>
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <Icon
                                            icon="solar:users-group-rounded-line-duotone"
                                            className="text-3xl text-green-600"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`rounded-xl mt-4 p-2 text-sm border-1 flex gap-2 items-center ${
                                    isQualified ? styles.success : styles.error
                                }`}
                            >
                                <Icon
                                    icon={isQualified ? icons.success : icons.error}
                                    className="text-lg"
                                />
                                <span className="font-semibold">
                                    {isQualified ? "Qualification Met" : "Qualification Gap"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ManualAssigment
