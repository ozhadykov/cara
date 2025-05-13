import { useEffect, useState } from "react"
import { Child } from "../../lib/models"
import { deleteRequest } from "../../lib/request"
import ChildrenRecord from "./ChildRecord"
import { useChildRecord } from "../../contexts/ChildRecordContext"

const ChildrenSingleImport = () => {
    const [children, setChildren] = useState<Child[]>()
    const { toggle } = useChildRecord()

    const deleteChild = (id: string) => {
        deleteRequest(`/api/db/children/${id}`, {})
    }

    useEffect(() => {
        const getAllChildren = async () => {
            try {
                const response = await fetch("/api/db/children")
                const data = await response.json()

                setChildren(data)
            } catch (e) {}
        }

        getAllChildren()
    }, [])
    if (!children) return <></>
    return (
        <div>
            <div className="w-full flex justify-end">
                <button className="btn btn-secondary mb-10" onClick={toggle}>
                    Add Record
                </button>
            </div>

            <table className="w-full text-left">
                <thead className="text-gray-500 text-[14px]">
                    <tr>
                        <th>
                            <input type="checkbox" />
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
                        <tr key={child.id} className="border-gray-200 border-b-1">
                            <td>
                                <input type="checkbox" />
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
                                    className="btn btn-error"
                                    onClick={() => deleteChild(child.id)}
                                >
                                    Delete
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
