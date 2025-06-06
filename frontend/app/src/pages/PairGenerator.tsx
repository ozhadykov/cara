import React, {useEffect, useState} from "react"
import {Icon} from "@iconify/react"
import {Assistant, Child} from "../lib/models.ts"
import {useLoading, useToast} from "../contexts";
import {toastTypes} from "../lib/constants.ts";
import ChildrenTable from "../components/generator/ChildrenTable.tsx";

const PairGenerator = () => {
    const [children, setChildren] = useState<Child[]>([])
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const [pairs, setPairs] = useState([])
    const [currentStep, setCurrentStep] = useState<number>(1)
    const [isLoading, setIsLoading] = useState(true);
    const {toggleLoading} = useLoading()
    const {sendMessage} = useToast()

    useEffect(() => {
        const getInitData = async () => {
            try {
                toggleLoading(true)
                const url = "/api/pair_generator"
                const response = await fetch(url)
                const responseData = await response.json()
                setChildren(responseData.data.children)
                setAssistants(responseData.data.assistants)
                setPairs(responseData.data.pairs)
                toggleLoading(false)
            } catch (error: unknown) {
                toggleLoading(false)
                if (error instanceof Error) {
                    console.error("Failed to fetch initial data:", error.message)
                    sendMessage(error.message, toastTypes.error) // Use error.message for more specific feedback
                } else {
                    console.error("An unknown error occurred:", error)
                    sendMessage('An unknown error occurred.', toastTypes.error)
                }
            }
        }

        getInitData()

    }, [])

    // 1. select children to pass in model
    // 2. select assistants to pass in model
    // 3. some settings for some constraints?
    // 4. generate button

    return (
        <div className="generator-content flex flex-col gap-3 w-full h-full">
            <div className="generator-header mb-5">
                <h1 className="text-3xl font-semibold">Pairs generator</h1>
                <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:info-circle-linear"/> Here you can generate and edit pairs
                </span>
            </div>
            <div className="generator-body card shadow-md">
                <div className="card-body bg-white rounded-lg flex flex-row">
                    <div
                        className="flex flex-col items-center justify-start w-1/4 flex-none pr-4 border-r-1 border-gray-300">
                        <div className="generator-steps-navigation">
                            <ul className="steps steps-vertical">
                                <li className="step step-primary">Choose children</li>
                                <li className="step step-primary">Choose assistants</li>
                                <li className="step">Calculate best assigment</li>
                                <li className="step">Get result</li>
                            </ul>
                        </div>
                    </div>
                    <div
                        className="generator-step-content pl-4 h-full overflow-x-scroll">
                        <ChildrenTable children={children}/>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PairGenerator
