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
        <div className="space-y-6">
            {pairs.map((pair) => (
                <div
                    className="flex flex-col justify-between gap-6 bg-gray-200 rounded-xl shadow p-6"
                    key={pair.id}
                >
                    <button
                        className="btn btn-error flex self-end"
                        onClick={() => deletePair(pair.id)}
                    >
                        Delete
                    </button>
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                        {/* Child Section */}
                        <div className="flex-1">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className="text-lg font-bold pb-2">
                                            Child
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {Object.entries(columns.childrenBase).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="font-medium pr-4">{value}:</td>
                                            <td>{String(pair[key as keyof PairInfo])}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="pt-4 pb-1 font-bold" colSpan={2}>
                                            Address
                                        </td>
                                    </tr>
                                    {Object.entries(columns.childrenAddress).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="font-medium pr-4">{value}:</td>
                                            <td>{String(pair[key as keyof PairInfo])}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Icon in the middle */}
                        <div className="hidden md:flex items-center justify-center text-gray-500">
                            <Icon
                                icon="solar:transfer-horizontal-line-duotone"
                                className="text-4xl"
                            />
                        </div>

                        {/* Assistant Section */}
                        <div className="flex-1">
                            <table className="w-full text-left">
                                <thead>
                                    <tr>
                                        <th colSpan={2} className="text-lg font-bold pb-2">
                                            Assistant
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="text-sm">
                                    {Object.entries(columns.assistantsBase).map(([key, value]) => (
                                        <tr key={key}>
                                            <td className="font-medium pr-4">{value}:</td>
                                            <td>{String(pair[key as keyof PairInfo])}</td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td className="pt-4 pb-1 font-bold" colSpan={2}>
                                            Address
                                        </td>
                                    </tr>
                                    {Object.entries(columns.assistantsAddress).map(
                                        ([key, value]) => (
                                            <tr key={key}>
                                                <td className="font-medium pr-4">{value}:</td>
                                                <td>{String(pair[key as keyof PairInfo])}</td>
                                            </tr>
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default PairOverview
