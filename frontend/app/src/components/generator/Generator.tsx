import React from "react"

interface IGeneratorProps {
    next: () => void
    prev: () => void
}

const Generator = ({next, prev} : IGeneratorProps) => {
    return (
        <div>
            <h1>GENERATE FUCKING PAIRS</h1>
            <div className="generator-controls flex items-center justify-between gap-3 mt-6">
                <button className="btn btn-soft btn-wide" onClick={prev}>previous step</button>
                <button className="btn btn-soft btn-wide btn-secondary" onClick={next}>next step</button>
            </div>
        </div>
    )
}

export default Generator