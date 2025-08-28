import { toastTypes } from "../../lib/constants"
import { useLoading, useToast } from "../../contexts"
import { useEffect, useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { deleteRequest } from "../../lib/request"
import ChildBox from "./ChildBox"
import AssistantBox from "./AssistantBox"

type PairInfo = {
    id: number

    // Child info
    c_id: number
    c_first_name: string
    c_family_name: string
    c_required_qualification: number
    c_required_qualification_text: string
    c_street: string
    c_street_number: string
    c_requested_hours: number
    c_city: string
    c_zip_code: string

    // Assistant info
    a_id: number
    a_first_name: string
    a_family_name: string
    a_qualification: number
    a_qualification_text: string
    a_has_car: boolean
    a_min_capacity: number
    a_max_capacity: number
    a_street: string
    a_street_number: string
    a_city: string
    a_zip_code: string
}

const PairOverview = (pairsProp : PairInfo[]) => {
    const [pairs, setPairs] = useState<PairInfo[]>(pairsProp)
    const { toggleLoading } = useLoading()
    const { sendMessage } = useToast()

    const refreshPairs = async () => {
        const res = await fetch("/api/pair_generator/pairs")
        const data = await res.json()
        setPairs([...data.data])
    }

    const deletePair = async (id: number) => {
        await deleteRequest(`/api/pair_generator/pair/${id}`, {})
        refreshPairs()
    }

    useEffect(() => {
        const fetchData = async () => {
            toggleLoading(true)
            try {
                refreshPairs()
            } catch (err) {
                console.error("Error fetching pairs:", err)
                sendMessage("Error loading pairs.", toastTypes.error)
            } finally {
                toggleLoading(false)
            }
        }

        fetchData()
    }, [])

    if (!pairs) return <></>

    return (
        <div className="space-y-8 flex flex-col w-full">
            {pairs.map((pair) => (
                <div key={pair.id}>
                    <div className="flex flex-col rounded-2xl w-full shadow-md">
                        {/* Header Section */}
                        <div className=" bg-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-5">
                                    <div className="p-2 bg-white rounded-lg shadow-sm">
                                        <Icon
                                            icon="solar:transfer-horizontal-line-duotone"
                                            className="text-2xl"
                                        />
                                    </div>

                                    <div>
                                        <h2 className="font-semibold text-gray-900">
                                            Pair #{pair.id}
                                        </h2>
                                        <p className="text-sm text-gray-600">
                                            {pair.c_first_name} ↔ {pair.a_first_name}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => deletePair(pair.id)}
                                    className="flex items-center gap-2 px-4 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors font-medium text-sm cursor-pointer"
                                >
                                    <Icon
                                        icon="solar:trash-bin-trash-outline"
                                        className="text-lg"
                                    />
                                    Remove Pair
                                </button>
                            </div>
                        </div>

                        <div className="flex flex-grow gap-2 items-stretch">
                            {/* Child Section */}
                            <ChildBox
                                child={{
                                    id: pair.c_id,
                                    first_name: pair.c_first_name,
                                    family_name: pair.c_family_name,
                                    required_qualification: pair.c_required_qualification,
                                    required_qualification_text: pair.c_required_qualification_text,
                                    requested_hours: pair.c_requested_hours,
                                    street: pair.c_street,
                                    street_number: pair.c_street_number,
                                    city: pair.c_city,
                                    zip_code: pair.c_zip_code,
                                }}
                            />

                            <div className="flex items-center justify-center px-2">
                                <Icon
                                    icon="solar:transfer-horizontal-bold-duotone"
                                    className="text-5xl text-gray-500"
                                />
                            </div>

                            {/* Assistant Section */}
                            <AssistantBox
                                assistant={{
                                    id: pair.a_id,
                                    first_name: pair.a_first_name,
                                    family_name: pair.a_family_name,
                                    qualification: pair.a_qualification,
                                    qualification_text: pair.a_qualification_text,
                                    min_capacity: pair.a_min_capacity,
                                    max_capacity: pair.a_max_capacity,
                                    has_car: pair.a_has_car,
                                    street: pair.a_street,
                                    street_number: pair.a_street_number,
                                    city: pair.a_city,
                                    zip_code: pair.a_zip_code,
                                }}
                            />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PairOverview
