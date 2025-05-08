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

                // Prüfe, ob die Daten erfolgreich abgerufen wurden
                if (data && data.data) {
                    let assignments = data.data.assignments; // Greife auf data.data.assignments zu

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
                } else {
                    console.error("Keine Daten vom Backend erhalten:", data);
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
            {/* Zeige die kompletten amplData für Debugging */}
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