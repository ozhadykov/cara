import { useEffect, useState } from "react"
import { Icon } from "@iconify/react"
import { Assistant } from "../../lib/models.ts"

const AssistentSingleImport = ({ refresh }: { refresh: boolean }) => {
    const [assistants, setAssistants] = useState<Assistant[]>([])
    const checkedItems:string[] = []

    // from dev purposes doing ti there
    useEffect(() => {
        const refreshAssistants = async () => {
            console.log("refreshing...")
            const res = await fetch("/api/db/assistants")
            const data = await res.json()
            // @ts-ignore
            setAssistants([...data])
        }
        refreshAssistants()
    }, [refresh])

    const toggleCreateRecord = () => {
        console.log("toggle create record")
    }

    const handleSelectAll = () => {
        console.log("select all record")
    }

    const handleCheck = () => {
        console.log("handling check")
    }

    const toggleEditRecord = async (assistant:Assistant) => {
        console.log("toggle edit record")
    }

    return (
        <div>
            <div className="w-full flex justify-end">
                <button className="btn btn-secondary mb-10" onClick={toggleCreateRecord}>
                    Add Record
                </button>
            </div>

            <table className="w-full text-left text-sm">
                <thead className="text-gray-500 text-xs ">
                <tr className="border-b-16 border-transparent">
                    <th>
                        <input
                            type="checkbox"
                            className="checkbox checkbox-secondary"
                            onChange={handleSelectAll}
                            id="selectAll"
                            name="selectAll"
                        />
                    </th>
                    <th>id</th>
                    <th>name</th>
                    <th>family_name</th>
                    <th>qualification</th>
                    <th>street</th>
                    <th>street_number</th>
                    <th>zip_code</th>
                    <th>city</th>
                    <th>capacity</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {assistants.map((assistant) => (
                    <tr key={assistant.id} className="border-gray-200 border-b-1">
                        <td>
                            <input
                                id={String(assistant.id)}
                                type="checkbox"
                                className="checkbox checkbox-secondary"
                                onChange={handleCheck}
                                name={assistant.first_name}
                                checked={checkedItems.includes(String(assistant.id))}
                            />
                        </td>
                        <td className="py-4">{assistant.id}</td>
                        <td>{assistant.first_name}</td>
                        <td>{assistant.family_name}</td>
                        <td>{assistant.qualification}</td>
                        <td>{assistant.street}</td>
                        <td>{assistant.street_number}</td>
                        <td>{assistant.zip_code}</td>
                        <td>{assistant.city}</td>
                        <td>{assistant.capacity}</td>
                        <td>
                            <button
                                onClick={() => toggleEditRecord(assistant)}
                                className="btn btn-ghost"
                            >
                                <Icon icon="solar:pen-line-duotone" />
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    )
}

export default AssistentSingleImport
