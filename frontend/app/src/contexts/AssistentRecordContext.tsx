import { createContext, useContext, useState, ReactNode } from "react"
import { SidebarContextType } from "./SidebarContext"

const AssistentRecordContext = createContext<SidebarContextType | null>(null)

export const AssistentRecordProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <AssistentRecordContext.Provider value={{ isOpen, toggle }}>
            {children}
        </AssistentRecordContext.Provider>
    )
}

export const useAssistentRecord = (): SidebarContextType => {
    const context = useContext(AssistentRecordContext)
    if (!context) {
        throw new Error("useRecord must be used within a SidebarProvider")
    }
    return context
}
