import React, { useEffect, useState, useMemo } from "react"
import { Icon } from "@iconify/react"
import { Assistant, Child } from "../lib/models.ts"
import { useLoading, useToast } from "../contexts"
import { toastTypes } from "../lib/constants.ts"
import { ChildrenTable, AssistantTable, Generator, TabCard, ManualAssigment } from "../components"
import { PairsGeneratorProvider } from "../contexts/providers/PairsGeneratorContext.tsx"

const PairGenerator = () => {
    const [children, setChildren] = useState<Child[]>([])
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const [pairs, setPairs] = useState([])
    const [currentStep, setCurrentStep] = useState<number>(1)
    const { toggleLoading } = useLoading()
    const { sendMessage } = useToast()

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
                    sendMessage("An unknown error occurred.", toastTypes.error)
                }
            }
        }

        getInitData()

    }, [])

    // 1. select children to pass in model
    // 2. select assistants to pass in model
    // 3. some settings for some constraints?
    // 4. generate button

    const nextStep = () => {
        if (currentStep + 1 <= 4)
            setCurrentStep(currentStep + 1)
    }

    const prevStep = () => {
        if (currentStep - 1 >= 0)
            setCurrentStep(currentStep - 1)
    }

    const steps = useMemo(() => {
        return [
            {
                id: 1,
                title: "Choose Children",
            },
            {
                id: 2,
                title: "Choose Assistants",
            },
            {
                id: 3,
                title: "Generate pairs",
            },
            {
                id: 4,
                title: "Choose Children",
            },
        ]


    }, [])

    return (
        <PairsGeneratorProvider>
            <div className="generator-content flex flex-col gap-3 w-full h-full">
                <div className="generator-header mb-5">
                    <h1 className="text-3xl font-semibold">Pairs generator</h1>
                    <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:info-circle-linear" /> Here you can generate and edit pairs
                    </span>
                </div>
                <div className="generator-body card shadow-md">
                    <div className="tab-container shadow-md">
                        <div className="tabs tabs-lift">
                            <label className="tab">
                                <input type="radio" name="my_tabs_4" defaultChecked />
                                <Icon icon="solar:user-check-line-duotone" />
                                <span className="ml-1">Auto</span>
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                <TabCard title="Auto generation" description="Here you can generate pairs automatically">
                                    <div className="card-body bg-white rounded-lg flex flex-row">
                                        <div
                                            className="flex flex-col items-center justify-center w-fit pl-4 pr-18 flex-none">
                                            <div className="generator-steps-navigation w-full h-full flex flex-col">
                                                <ul className="steps steps-vertical grow-1">
                                                    {steps.map(step => <li
                                                        className={`step ${step.id <= currentStep && "step-primary"}`}
                                                        key={step.id}>{step.title}</li>)}
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="divider lg:divider-horizontal"></div>
                                        <div
                                            className="generator-step-content pl-4 h-full w-full overflow-x-scroll">
                                            {currentStep === 1 && <ChildrenTable children={children} next={nextStep} />}
                                            {currentStep === 2 &&
                                                <AssistantTable assistants={assistants} next={nextStep}
                                                                prev={prevStep} />}
                                            {currentStep === 3 && <Generator next={nextStep} prev={prevStep} />}
                                        </div>
                                    </div>
                                </TabCard>
                            </div>
                            <label className="tab">
                                <input type="radio" name="my_tabs_4" />
                                <Icon icon="solar:hand-shake-outline" className="mr-1"/>
                                Manual
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                <TabCard title="Manual generation" description="Here you can manually create pair">
                                    <ManualAssigment children={children} assistants={assistants}/>
                                </TabCard>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PairsGeneratorProvider>
    )
}

export default PairGenerator
