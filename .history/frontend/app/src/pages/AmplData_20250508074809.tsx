import React, { useState, useEffect } from 'react';

// Definiere ein Interface für eine Tabellenzeile
interface TableRow {
    child_id: string;
    assistant_id: any; // oder spezifischer Typ, falls bekannt
    assigned: any; // oder spezifischer Typ, falls bekannt
}

function AmplData() {
    const [amplData, setAmplData] = useState(null);
    const [tableData, setTableData] = useState<TableRow[]>([]); // Korrekter Typ

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Hier die URL zu deinem Backend-Endpunkt
                const response = await fetch('/api/get-ampl-data-in-backend'); // Oder /api/ampl/dev
                const data = await response.json();
                setAmplData(data);

                if (data && data.ampl_service_response) {
                    let assignments = data.ampl_service_response.assignments;

                    if (typeof assignments === 'string') {
                        assignments = JSON.parse(assignments);
                    }

                    const childIds = Object.keys(assignments.child_id);
                    const tableRows = childIds.map(childId => ({
                        child_id: childId,
                        assistant_id: assignments.assistant_id[childId],
                        assigned: assignments.assigned[childId]
                    }));
                    setTableData(tableRows);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    if (!amplData) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Ampl Data Table</h2>
            <pre>{JSON.stringify(amplData, null, 2)}</pre>

            <table>
                <thead>
                    <tr>
                        <th>Child ID</th>
                        <th>Assistant ID</th>
                        <th>Assigned</th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.map(row => (
                        <tr key={row.child_id}>
                            <td>{row.child_id}</td>
                            <td>{row.assistant_id}</td>
                            <td>{row.assigned}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AmplData;