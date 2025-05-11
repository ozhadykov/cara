import { useEffect, useState } from "react"
import { Child } from "../../lib/models"
import { deleteRequest } from "../../lib/request"

const ChildrenSingleImport = () => {
    const [children, setChildren] = useState<Child[]>()

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
                <button className="btn btn-secondary mb-10">Add Record</button>
            </div>

            <table className="w-full text-left">
                <thead className="text-gray-500">
                    <tr>
                        <th>
                            <input type="checkbox" />
                        </th>
                        <th className="py-4">id</th>
                        <th>name</th>
                        <th>last_name</th>
                        <th>required_qualification</th>
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
                            <td>{child.last_name}</td>
                            <td></td>
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
