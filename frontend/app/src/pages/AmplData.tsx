import { useState, useEffect } from "react"

interface TableRow {
    child_id: string
    assistant_id: string | number
    assigned: string | number
}

function AmplData() {
    const [amplData, setAmplData] = useState(null)
    const [tableData, setTableData] = useState<TableRow[]>([])

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch("/api/ampl/dev")
                const data = await response.json()
                setAmplData(data)

                let assignments = data.assignments

                assignments = JSON.parse(assignments)

                const childIds = Object.keys(assignments.child_id)
                const tableRows = childIds.map((childId) => ({
                    child_id: childId,
                    assistant_id: assignments.assistant_id[childId],
                    assigned: assignments.assigned[childId],
                }))
                setTableData(tableRows)
            } catch (error) {
                console.error("Error fetching data:", error)
            }
        }

        fetchData()
    }, [])

    if (!amplData) {
        return <div>Loading...</div>
    }

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Ampl Data Table</h2>
            <table className="table-auto border-collapse border border-gray-400 w-full">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-400 px-4 py-2 text-left">Child ID</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Assistant ID</th>
                        <th className="border border-gray-400 px-4 py-2 text-left">Assigned</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map((row) => (
                        <tr key={row.child_id}>
                            <td className="border border-gray-400 px-4 py-2">{row.child_id}</td>
                            <td className="border border-gray-400 px-4 py-2">{row.assistant_id}</td>
                            <td className="border border-gray-400 px-4 py-2">{row.assigned}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default AmplData
