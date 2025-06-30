import { toastTypes } from "../../lib/constants"
import { useLoading, useToast } from "../../contexts"
import { useEffect, useState } from "react"
import { Icon } from "@iconify/react/dist/iconify.js"
import { deleteRequest } from "../../lib/request"

type PairInfo = {
    id: number

    // Child info
    c_first_name: string
    c_family_name: string
    c_required_qualification: string
    c_street: string
    c_street_number: string
    c_city: string
    c_zip_code: string

    // Assistant info
    a_first_name: string
    a_family_name: string
    a_qualification: string
    a_has_car: boolean
    a_street: string
    a_street_number: string
    a_city: string
    a_zip_code: string
}

const PairOverview = () => {
    const [pairs, setPairs] = useState<PairInfo[]>()
    const { toggleLoading } = useLoading()
    const { sendMessage } = useToast()

    const refreshPairs = async () => {
        const res = await fetch("/api/pair_generator/pairs")
        const data = await res.json()
        setPairs([...data.data])
    }

    const deletePair = async (id: number) => {
        const response = await deleteRequest(`/api/pair_generator/pair/${id}`, {})
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

    const columns = {
        childrenBase: {
            c_first_name: "First Name",
            c_family_name: "Family Name",
            c_required_qualification: "Required Qualification",
        },
        childrenAddress: {
            c_street: "Street",
            c_street_number: "Street No.",
            c_city: "City",
            c_zip_code: "Zip-Code",
        },
        assistantsBase: {
            a_first_name: "First Name",
            a_family_name: "Family Name",
            a_qualification: "Qualification",
            a_has_car: "Has Car?",
        },
        assistantsAddress: {
            a_street: "Street",
            a_street_number: "Street No.",
            a_city: "City",
            a_zip_code: "Zip-Code",
        },
    }

    if (!pairs) return <></>

    return (
        <div className="space-y-8 flex flex-col w-full">
            {pairs.map((pair) => (
                <div key={pair.id}>
                    <div className="flex flex-col rounded-2xl w-full shadow-md">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r bg-gray-100 px-6 py-4 border-b border-gray-200 rounded-t-2xl">
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

                        {/* Child Section */}
                        <div className="flex flex-col p-5 gap-7">
                            <div className="rounded-2xl border-2 border-blue-200 p-5 gap-5 flex flex-col">
                                <div className="flex gap-5 items-center">
                                    <div className={`p-2 rounded-full bg-blue-100`}>
                                        <Icon
                                            icon="solar:people-nearby-line-duotone"
                                            className="text-3xl text-blue-600"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-semibold text-lg">
                                            {pair.c_first_name} {pair.c_family_name}
                                        </span>
                                        <div className="badge bg-blue-100 badge-md text-blue-600">
                                            Child
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Icon icon="solar:book-outline" className="text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            REQUIRED QUALIFICATION
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {pair.c_required_qualification}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Icon icon="solar:map-point-linear" className="text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            Facility
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {pair.c_street_number} {pair.c_street}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {pair.c_city}, {pair.c_zip_code}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Assistant Section */}
                        <div className="flex flex-col p-5 gap-7">
                            <div className="rounded-2xl border-1 border-green-200 p-5 gap-5 flex flex-col">
                                <div className="flex gap-5 items-center">
                                    <div className={`p-2 rounded-full bg-green-100`}>
                                        <Icon
                                            icon="solar:users-group-rounded-line-duotone"
                                            className="text-3xl text-green-600"
                                        />
                                    </div>

                                    <div className="flex flex-col">
                                        <span className="font-semibold text-lg">
                                            {pair.c_first_name} {pair.c_family_name}
                                        </span>
                                        <div className="badge bg-green-100 badge-md text-green-600">
                                            Assistant
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Icon icon="solar:book-outline" className="text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            QUALIFICATION
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {pair.a_qualification}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Icon icon="solar:map-point-linear" className="text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            Address
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {pair.a_street_number} {pair.a_street}
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {pair.a_city}, {pair.a_zip_code}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <Icon icon="solar:wheel-outline" className="text-xl" />
                                    <div>
                                        <p className="text-xs text-gray-500 uppercase tracking-wide">
                                            Has a Car?
                                        </p>
                                        <p className="text-sm text-gray-700">
                                            {pair.a_has_car ? "Yes" : "No"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PairOverview
