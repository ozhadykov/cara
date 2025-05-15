import { useEffect, useState } from "react"
import { deleteRequest } from "../../lib/request"
import { Icon } from "@iconify/react/dist/iconify.js"
import { useRecordSidebar } from "../../contexts/providers/RecordSidebarContext"
import { useChildrenData } from "../../contexts/providers/ChildrenDataContext"

const ChildrenSingleImport = () => {
    const [isCheckAll, setIsCheckAll] = useState(false)
    const [checkedItems, setCheckedItems] = useState<string[]>([])

    const { children, refreshChildren } = useChildrenData()
    const { toggleCreateRecord, toggleEditRecord } = useRecordSidebar()

    const deleteChildren = async () => {
        try {
            for (const child_id of checkedItems) {
                await deleteRequest(`/api/db/children/${child_id}`, {})
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
    }, [])
    if (!children) return <></>
    return (
        <div>
            <div className="w-full flex justify-between">
                {checkedItems.length !== 0 ? (
                    <button className="btn btn-error mb-10 text-white" onClick={deleteChildren}>
                        Delete {checkedItems.length} Record
                    </button>
                ) : (
                    <div />
                )}
                <button className="btn btn-secondary mb-10" onClick={toggleCreateRecord}>
                    Add Record
                </button>
            </div>

            <table className="w-full text-left">
                <thead className="text-gray-500 text-[14px]">
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
                        <th className="py-4">id</th>
                        <th>name</th>
                        <th>family_name</th>
                        <th>required_qualification</th>
                        <th>street</th>
                        <th>city</th>
                        <th>zip_code</th>
                        <th>requested_hours</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {children.map((child) => (
                        <tr key={child.id} className={"border-gray-200 border-b-1"}>
                            <td>
                                <input
                                    id={String(child.id)}
                                    type="checkbox"
                                    className="checkbox checkbox-secondary"
                                    onChange={handleCheck}
                                    name={child.name}
                                    checked={checkedItems.includes(String(child.id))}
                                />
                            </td>
                            <td className="py-4">{child.id}</td>
                            <td>{child.name}</td>
                            <td>{child.family_name}</td>
                            <td>{child.required_qualification}</td>
                            <td>{child.street}</td>
                            <td>{child.city}</td>
                            <td>{child.zip_code}</td>
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
    )
}

export default ChildrenSingleImport
