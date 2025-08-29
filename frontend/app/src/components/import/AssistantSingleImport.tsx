import { useEffect, useState } from "react"
import { deleteRequest, postRequest } from "../../lib/request"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useRecordSidebar } from "../../contexts/providers/RecordSidebarContext"
import { useAssistantData } from "../../contexts/providers/AssistantDataContext"

const AssistantSingleImport = ({ refresh }: { refresh: boolean }) => {
    const [isCheckAll, setIsCheckAll] = useState(false)
    const [checkedItems, setCheckedItems] = useState<string[]>([])

    const { assistants, refreshAssistants } = useAssistantData()
    const { toggleCreateRecord, toggleEditRecord } = useRecordSidebar()

    const deleteAssistants = async () => {
        try {
            for (const assistant_id of checkedItems) {
                await deleteRequest(`/api/assistants/${assistant_id}`, {})
            }

            setCheckedItems([])
            setIsCheckAll(false)
            await refreshAssistants()
        } catch (error) {}
    }

    const resetSelection = () => {
        setCheckedItems([])
    }

    const handleSelectAll = (e: any) => {
        setIsCheckAll(!isCheckAll)
        if (!assistants) return
        setCheckedItems(assistants.map((assistant) => String(assistant.id)))

        if (isCheckAll) {
            setCheckedItems([])
        }
    }

    const handleCheck = (e: any) => {
        const { id, checked } = e.target
        setCheckedItems([...checkedItems, String(id)])

        if (!checked) {
            setCheckedItems(checkedItems.filter((item) => item !== id))
            setIsCheckAll(false)
        }
    }

    const exportAssistants = async () => {
        const res = await fetch("/api/assistants/export")

        const blob = await res.blob()

        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url

        a.download = "assistants.csv"
        document.body.appendChild(a)
        a.click()
        a.remove()
        window.URL.revokeObjectURL(url)
    }

    useEffect(() => {
        refreshAssistants()
    }, [refresh])
    if (!assistants) return <></>
    return (
        <div>
            <div className="w-full flex justify-end gap-5">
                <button className="btn btn-outline mb-10" onClick={exportAssistants}>
                    Export
                </button>
                <button className="btn btn-secondary mb-10" onClick={toggleCreateRecord}>
                    Add Record
                </button>
            </div>
            <div className="overflow-x-scroll rounded-box border border-base-content/5 bg-base-100">
                <table className="table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    className="checkbox checkbox-secondary"
                                    onChange={handleSelectAll}
                                    id="selectAll"
                                    name="selectAll"
                                    checked={isCheckAll}
                                />
                            </th>
                            <th>id</th>
                            <th>first_name</th>
                            <th>family_name</th>
                            <th>qualification</th>
                            <th>has_car</th>
                            <th>street</th>
                            <th>street_number</th>
                            <th>zip_code</th>
                            <th>city</th>
                            <th>min_capacity</th>
                            <th>max_capacity</th>
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
                                <td className="font-bold">{assistant.id}</td>
                                <td>{assistant.first_name}</td>
                                <td>{assistant.family_name}</td>
                                <td>{assistant.qualification_text}</td>
                                <td>{assistant.has_car ? "Yes" : "No"}</td>
                                <td>{assistant.street}</td>
                                <td>{assistant.street_number}</td>
                                <td>{assistant.zip_code}</td>
                                <td>{assistant.city}</td>
                                <td>{assistant.min_capacity}</td>
                                <td>{assistant.max_capacity}</td>
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

            <div
                className={`fixed ${
                    checkedItems.length === 0 ? "hidden" : "flex"
                } inset-x-0 bottom-20 bg-white border-1 border-gray-200 w-fit py-2 px-10 m-auto items-center justify-between rounded-3xl shadow-lg gap-30`}
            >
                <div className="flex items-center gap-2 text-sm">
                    <div>
                        Selected <strong>{checkedItems.length}</strong> records
                    </div>
                    <button className="btn btn-ghost btn-xs" onClick={resetSelection}>
                        Reset
                    </button>
                </div>

                <button
                    onClick={deleteAssistants}
                    className="btn btn-xs btn-ghost text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                >
                    Delete
                </button>
            </div>
        </div>
    )
}

export default AssistantSingleImport
