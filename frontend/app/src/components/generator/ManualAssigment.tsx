import React, { useState } from "react"
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

    // todo: 1. get all children, get all assistants, create pair

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
        console.log(response)

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
            {selectedChild && selectedAssistant && (
                <div className="flex justify-center w-full">
                    <div className="max-w-md w-full">
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">Used Capacity</span>
                                </div>
                                <span
                                    className={`font-semibold ${
                                        hasCapacity ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {usedHoursText}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">Free Capacity</span>
                                </div>
                                <span
                                    className={`font-semibold ${
                                        hasCapacity ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {freeHoursText}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">
                                        Required Capacity
                                    </span>
                                </div>
                                <span
                                    className={`font-semibold ${
                                        hasCapacity ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {selectedChild.requested_hours}
                                </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                                    <span className="font-medium text-gray-700">Qualification</span>
                                </div>
                                <span
                                    className={`font-semibold ${
                                        isQualified ? "text-green-600" : "text-red-600"
                                    }`}
                                >
                                    {selectedChild.required_qualification_text}{" "}
                                    {isQualified ? "≤" : ">"} {selectedAssistant.qualification_text}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="weights-setting-footer mt-8 flex justify-end">
                <button
                    className={`btn btn-wide btn-${hasCapacity ? "primary" : "disabled"}`}
                    onClick={createCustomPair}
                >
                    Create Pair
                </button>
            </div>
        </div>
    )
}

export default ManualAssigment
