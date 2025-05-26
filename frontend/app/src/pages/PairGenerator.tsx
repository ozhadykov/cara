import React, { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { Assistant, Child } from "../lib/models.ts"

const PairGenerator = () => {
    const [children, setChildren] = useState<Child[]>([])
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const [pairs, setPairs] = useState([])

    useEffect(() => {
        const getInitData = async () => {
            const url = '/api/db/pair_generator'
            const response = await fetch(url)
            const data = await response.json()
            console.log(data)
        }

        getInitData()
    }, [])

    // overview of existent pairs?

    // data needed:
    // all children
    // all assistants
    // all pairs

    // 1. select children to pass in model
    // 2. select assistants to pass in model
    // 3. some settings for some constraints?
    // 4. generate button

    return (
        <div className="generator-content flex flex-col gap-3 w-full h-full">
            <div className="generator-header mb-5">
                <h1 className="text-3xl font-semibold">Pairs generator</h1>
                <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:info-circle-linear" /> Here you can generate and edit pairs
                </span>
            </div>
            <div className="generator-body card shadow-md">
                <div className="card-body bg-white rounded-lg flex flex-row">
                    <div className="flex flex-col items-center justify-center w-1/4 flex-none pr-4 border-r-1 border-gray-300">
                        <div className="generator-steps-navigation">
                            <ul className="steps steps-vertical">
                                <li className="step step-primary">Choose children</li>
                                <li className="step step-primary">Choose assistants</li>
                                <li className="step">Calculate best assigment</li>
                                <li className="step">Get result</li>
                            </ul>
                        </div>
                    </div>
                    <div className="generator-step-content pl-4 h-full">
                        Hell yeah
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PairGenerator