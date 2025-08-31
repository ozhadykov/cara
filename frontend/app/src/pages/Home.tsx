import { Icon } from "@iconify/react"
import { useEffect, useState } from "react"
import InfoContainer from "../components/infoContainer"

type Coverage = {
    total_children: number
    total_assistants: number

    covered_children_absolute: number
    covered_assistants_absolute: number

    covered_children_relative: number
    covered_assistants_relative: number

    total_hours: number

    pairs_count: number
}

const Home = () => {
    const [coverage, setCoverage] = useState<Coverage>()

    useEffect(() => {
        const getData = async () => {
            const response = await fetch("/api/pair_generator/coverage")
            const data = await response.json()

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

            <div className="flex flex-row gap-16 pt-20 bg-white p-16 shadow-md rounded-md">
                <InfoContainer
                    icon="solar:people-nearby-line-duotone"
                    header="Children"
                    href="children"
                    color="green"
                >
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Total Children
                        </p>
                        <p className="text-sm text-gray-700">{coverage.total_children}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Coverage</p>
                        <p className="text-sm text-gray-700">
                            {coverage.covered_children_relative}%
                        </p>
                    </div>
                </InfoContainer>

                <InfoContainer
                    icon="solar:users-group-rounded-line-duotone"
                    header="Assistants"
                    href="assistants"
                    color="blue"
                >
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Total Assistants
                        </p>
                        <p className="text-sm text-gray-700">{coverage.total_assistants}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Activity Rate
                        </p>
                        <p className="text-sm text-gray-700">
                            {coverage.covered_assistants_relative}%
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Total Working Hours
                        </p>
                        <p className="text-sm text-gray-700">{coverage.total_hours}h</p>
                    </div>
                </InfoContainer>

                <InfoContainer
                    icon="solar:transfer-horizontal-line-duotone"
                    header="Pairs"
                    href="pairs"
                    color="gray"
                >
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Assigned Children
                        </p>
                        <p className="text-sm text-gray-700">
                            {coverage.covered_children_absolute}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Active Assistants
                        </p>
                        <p className="text-sm text-gray-700">
                            {coverage.covered_assistants_absolute}
                        </p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide">Total Pairs</p>
                        <p className="text-sm text-gray-700">{coverage.total_children}</p>
                    </div>
                </InfoContainer>
            </div>
        </div>
    )
}

export default Home
