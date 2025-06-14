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

    pairs_count: number
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

            <div className="flex flex-row gap-16 pt-20">
                <InfoContainer
                    icon="solar:people-nearby-line-duotone"
                    header="Children"
                    href="children"
                >
                    <p>
                        Total Children:
                        <b className="text-black"> {coverage.total_children}</b>
                    </p>
                    <p>
                        Assigned Children:
                        <b className="text-black"> {coverage.covered_children_absolute}</b>
                    </p>
                    <p>
                        Coverage:
                        <b className="text-black"> {coverage.covered_children_relative}%</b>
                    </p>
                </InfoContainer>

                <InfoContainer
                    icon="solar:users-group-rounded-line-duotone"
                    header="Assistants"
                    href="assistants"
                >
                    <p>
                        Total Assistants:
                        <b className="text-black"> {coverage.total_assistants}</b>
                    </p>
                    <p>
                        Active Assistants:
                        <b className="text-black"> {coverage.covered_assistants_absolute}</b>
                    </p>
                    <p>
                        Activity Rate:
                        <b className="text-black"> {coverage.covered_assistants_relative}%</b>
                    </p>
                </InfoContainer>

                <InfoContainer
                    icon="solar:transfer-horizontal-line-duotone"
                    header="Pairs"
                    href="pairs"
                >
                    <p>
                        Total Pairs:
                        <b className="text-black"> {coverage.total_children}</b>
                    </p>
                </InfoContainer>
            </div>
        </div>
    )
}

export default Home
