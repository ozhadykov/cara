import { usePairsGenerator } from "../../contexts/providers/PairsGeneratorContext.tsx"

interface IGeneratorProps {
    next: () => void
    prev: () => void
}

const Generator = ({ next, prev }: IGeneratorProps) => {
    const { selectedChildrenObj, selectedAssistantsObj } = usePairsGenerator()

    console.log(selectedChildrenObj)
    console.log(selectedAssistantsObj)

    return (
        <div className="step-3-generator-content w-full h-full flex flex-col gap-4">
            <div className="header">
                <span className="text-xl font-semibold">Generate pairs</span>
            </div>
            <div className="body flex">
                <div className="children-list-container w-full">
                    <span className="list-header">Selected children</span>
                </div>
                <div className="assistant-list-container w-full">
                    <span className="list-header">Selected assistants</span>
                </div>
            </div>
            <div className="generator-controls flex items-center justify-between gap-3 mt-6">
                <button className="btn btn-soft btn-wide" onClick={prev}>previous step</button>
                <button className="btn btn-soft btn-wide btn-secondary" onClick={next}>next step</button>
            </div>
        </div>
    )
}

export default Generator