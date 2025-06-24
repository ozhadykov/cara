import React from "react"
import { Assistant, Child } from "../../lib/models.ts"

interface CompareBoxProps {
    comparable: Assistant | Child
}

const CompareBox = ({comparable}:CompareBoxProps) => {
    return (
        <div className="compare-box">
            <div className="overflow-x-auto">
                <table className="table table-zebra">
                    <thead>
                    <tr>
                        <th>Key</th>
                        <th>Value</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(comparable).map(keyValue => {
                        return (
                            <tr key={keyValue[0]}>
                                <td>{keyValue[0]}</td>
                                <td>{keyValue[1]}</td>
                            </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default CompareBox