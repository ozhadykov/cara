import { useAssistentRecord } from "../../contexts/AssistentRecordContext.tsx"
import { useChildRecord } from "../../contexts/ChildRecordContext.tsx"
import { useSidebar } from "../../contexts/SidebarContext.tsx"

const AssistentRecord = () => {
    const { isOpen } = useAssistentRecord()

    return (
        <aside
            className={`fixed top-0 right-0 z-30 w-fit h-screen pt-20 
                    border-r border-gray-200 bg-white
                    transition-transform ${isOpen ? "translate-x-0" : "translate-x-full"} `}
        >
            <div className="h-full px-3 pb-4 overflow-y-auto">
                <ul className="font-medium flex flex-col px-[10px]">
                    <li>Item1</li>
                    <li>Item2</li>
                </ul>
            </div>
        </aside>
    )
}

export default AssistentRecord
