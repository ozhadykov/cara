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
        <div className="container mx-auto p-4">{/* Füge einen Container hinzu */}
            <h2 className="text-2xl font-bold mb-4">Ampl Data Table</h2>
            <table className="table-auto border-collapse border border-gray-400 w-full">{/* Passe die Tabellenbreite an */}
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border border-gray-400 px-4 py-2 text-left">Child ID</th>{/* Füge text-left hinzu */}
                        <th className="border border-gray-400 px-4 py-2 text-left">Assistant ID</th>{/* Füge text-left hinzu */}
                        <th className="border border-gray-400 px-4 py-2 text-left">Assigned</th>{/* Füge text-left hinzu */}
                    </tr>
                </thead>
                <tbody>
                    {tableData.map(row => (
                        <tr key={row.child_id}>
                            <td className="border border-gray-400 px-4 py-2">{row.child_id}</td>
                            <td className="border border-gray-400 px-4 py-2">{row.assistant_id}</td>
                            <td className="border border-gray-400 px-4 py-2">{row.assigned}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* <pre>{JSON.stringify(amplData, null, 2)}</pre> */} {/* Auskommentierte Debugging-Zeile */}
        </div>
    );
}

export default AmplData;