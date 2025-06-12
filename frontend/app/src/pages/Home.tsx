import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"

type Coverage = {
    total_children: number
    total_assistants: number

    covered_children_absolute: number
    covered_assistants_absolute: number

    covered_children_relative: number
    covered_assistants_relative: number
}

const Home = () => {
    const [coverage, setCoverage] = useState<Coverage>()

    useEffect(() => {
        const getData = async () => {
            const response = await fetch("/api/pair_generator/coverage")
            const data = await response.json()

            console.log(data)
            if (response.ok) {
                setCoverage(data)
            }
        }

        getData()
    }, [])
    if (!coverage) return <></>

    return (
        <div className="home-content flex flex-col gap-3 w-full h-full">
            <div className="home-header mb-5">
                <h1 className="text-3xl font-semibold">Home</h1>
                <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:info-circle-linear" /> Here are some general informations
                </span>
            </div>

            <div className="flex flex-col gap-5">
                <div>
                    <b>{coverage.covered_children_absolute}</b> children are assigned to{" "}
                    <b>{coverage.covered_assistants_absolute}</b> assistants
                </div>

                <div>
                    <h2 className="font-bold text-lg">Total</h2>
                    <div>
                        <b>Children</b> {coverage.total_children}
                    </div>
                    <div>
                        <b>Assistants</b>: {coverage.total_assistants}
                    </div>
                </div>

                <div>
                    <h2 className="font-bold text-lg">Coverage (in %)</h2>
                    <div>
                        <b>Children</b> {coverage.covered_children_relative * 100}%
                    </div>
                    <div>
                        <b>Assistants</b> {coverage.covered_assistants_relative * 100}%
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
