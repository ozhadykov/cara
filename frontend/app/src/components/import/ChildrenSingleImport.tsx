import { useEffect, useState } from "react"
import { deleteRequest } from "../../lib/request"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useRecordSidebar } from "../../contexts/providers/RecordSidebarContext"
import { useChildrenData } from "../../contexts/providers/ChildrenDataContext"

const ChildrenSingleImport = ({ refresh }: { refresh: boolean }) => {
    const [isCheckAll, setIsCheckAll] = useState(false)
    const [checkedItems, setCheckedItems] = useState<string[]>([])

    const { children, refreshChildren } = useChildrenData()
    const { toggleCreateRecord, toggleEditRecord } = useRecordSidebar()

    const deleteChildren = async () => {
        try {
            for (const child_id of checkedItems) {
                await deleteRequest(`/api/children/${child_id}`, {})
            }

            setCheckedItems([])
            setIsCheckAll(false)
            await refreshChildren()
        } catch (error) {}
    }

    const handleSelectAll = (e: any) => {
        setIsCheckAll(!isCheckAll)
        if (!children) return
        setCheckedItems(children.map((child) => String(child.id)))

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

    useEffect(() => {
        refreshChildren()
    }, [refresh])
    if (!children) return <></>
    return (
        <div>
            <div className="w-full flex justify-end">
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
                            <th>name</th>
                            <th>family name</th>
                            <th>required_qualification</th>
                            <th>street</th>
                            <th>street_number</th>
                            <th>zip_code</th>
                            <th>city</th>
                            <th>requested_hours</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {children.map((child) => (
                            <tr key={child.id} className="border-gray-200 border-b-1">
                                <td>
                                    <input
                                        id={String(child.id)}
                                        type="checkbox"
                                        className="checkbox checkbox-secondary"
                                        onChange={handleCheck}
                                        name={child.first_name}
                                        checked={checkedItems.includes(String(child.id))}
                                    />
                                </td>
                                <td className="font-bold">{child.id}</td>
                                <td>{child.first_name}</td>
                                <td>{child.family_name}</td>
                                <td>{child.required_qualification_text}</td>
                                <td>{child.street}</td>
                                <td>{child.street_number}</td>
                                <td>{child.zip_code}</td>
                                <td>{child.city}</td>
                                <td>{child.requested_hours}</td>
                                <td>
                                    <button
                                        onClick={() => toggleEditRecord(child)}
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
                    <button className="btn btn-ghost btn-xs">Reset</button>
                </div>

                <button className="btn btn-error text-white btn-xs" onClick={deleteChildren}>
                    Delete
                </button>
            </div>
        </div>
    )
}

export default ChildrenSingleImport
