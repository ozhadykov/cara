import React, { useEffect, useState } from "react"
import Select from "react-select"
import { toastTypes } from "../../lib/constants.ts"
import { useLoading, useToast } from "../../contexts"
import { Assistant, Child } from "../../lib/models.ts"
import { CompareBox } from "../index.tsx"
import { postRequest } from "../../lib/request.ts"


interface ManualAssigmentProps {
    children: Child[]
    assistants: Assistant[]
}

interface SelectOption {
    value: number,
    label: string
}

const ManualAssigment = ({ children, assistants }: ManualAssigmentProps) => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const [selectedChild, setSelectedChild] = useState<Child | null>(null)
    const [selectedAssistant, setSelectedAssistant] = useState<Assistant | null>(null)
    const [selectedChildForSelect, setSelectedChildForSelect] = useState<SelectOption | null>(null)
    const [selectedAssistantForSelect, setSelectedAssistantForSelect] = useState<SelectOption | null>(null)

    // todo: 1. get all children, get all assistants, create pair

    const handleChildSelectChange = (e: any) => {
        const childId = e.value
        const childObj = children.find((obj) => obj.id === childId)
        setSelectedChild(childObj ?? null)
        setSelectedChildForSelect(e)
    }

    const handleAssistantSelectChange = (e: any) => {
        const assistantId = e.value
        const assistantObj = assistants.find((obj) => obj.id === assistantId)
        setSelectedAssistant(assistantObj ?? null)
        setSelectedAssistantForSelect(e)
    }


    const childrenOptions = children.map(child => {
        return {
            value: child.id,
            label: `${child.first_name} ${child.family_name}, ID: ${child.id}`,
        }
    })

    const assistantsOptions = assistants.map(assistant => {
        return {
            value: assistant.id,
            label: `${assistant.first_name} ${assistant.family_name}, ID: ${assistant.id}`,
        }
    })

    const createCustomPair = async () => {
        if (selectedAssistant && selectedChild) {
            const url = "/api/pair_generator/single_pair"
            const data = {
                child: selectedChild,
                assistant: selectedAssistant,
            }
            const response = await postRequest(url, data, sendMessage, toggleLoading)
            if (response)
                sendMessage(response.message, response.success ? toastTypes.success : toastTypes.error)

            if (response.success) {
                setSelectedAssistant(null)
                setSelectedChild(null)
                setSelectedAssistantForSelect(null)
                setSelectedChildForSelect(null)
            }

            return
        }

        sendMessage("Please select child and assistant", toastTypes.warning)
    }

    return (
        <div className="manual-assigment-container flex flex-col gap-8">
            <div className="select-container flex gap-8">
                <div className="child-select-container w-1/2">
                    <label htmlFor="children-select" className="mb-3 block">Choose child</label>
                    <Select options={childrenOptions} className="children-select"
                            onChange={handleChildSelectChange}
                            value={selectedChildForSelect} />
                    {selectedChild && (
                        <div className="child-compare-box mt-6">
                            <div className="divider">Child info</div>
                            <CompareBox comparable={selectedChild} />
                        </div>
                    )}
                </div>
                <div className="divider lg:divider-horizontal"></div>
                <div className="assistant-select-container w-1/2">
                    <label htmlFor="assistant-select" className="mb-3 block">Choose assistant</label>
                    <Select options={assistantsOptions} className="assistant-select"
                            onChange={handleAssistantSelectChange}
                            value={selectedAssistantForSelect} />
                    <div className="assistant-compare-box">
                        {selectedAssistant && (
                            <div className="assistant-compare-box mt-6">
                                <div className="divider">Assistant info</div>
                                <CompareBox comparable={selectedAssistant} />
                            </div>

                        )}
                    </div>
                </div>
            </div>
            <div className="weights-setting-footer mt-8 flex justify-end">
                <button className="btn btn-primary btn-wide" onClick={createCustomPair}>Create Pair</button>
            </div>
        </div>
    )
}

export default ManualAssigment