import { Mode, useRecordSidebar } from "../../../contexts/providers/RecordSidebarContext"
import ChildCreate from "./ChildCreate"
import ChildEdit from "./ChildEdit"
import AssistantEdit from "./AssistantEdit"
import AssistantCreate from "./AssistantCreate"

type PageType = "assistants" | "children"

const RecordSidebar = ({ pageType }: { pageType: PageType }) => {
    const { isOpen, toggle, mode, selectedData } = useRecordSidebar()

    const renderContent = () => {
        if (pageType === "children" && mode === Mode.EDIT) return <ChildEdit />
        if (pageType === "children" && mode === Mode.CREATE) return <ChildCreate />
        if (pageType === "assistants" && mode === Mode.EDIT) return <AssistantEdit />
        if (pageType === "assistants" && mode === Mode.CREATE) return <AssistantCreate />
        return null
    }

    return (
        <div
            className={`flex fixed w-full h-screen z-30 ${
                isOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none transition-all duration-300"
            }`}
        >
            <div
                className={`w-full transition-all duration-300 ${
                    isOpen ? "bg-[rgba(0,0,0,.5)]" : "bg-transparent"
                }`}
                onClick={toggle}
            />
            <aside
                className={`fixed top-0 right-0 w-lg h-full pt-20 flex flex-col justify-between
                    border-gray-200 bg-white 
                    transition-transform  ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    } border-l-1 shadow-md shadow-black/5 -translate-x-1`}
            >
                {renderContent()}
            </aside>
        </div>
    )
}

export default RecordSidebar
