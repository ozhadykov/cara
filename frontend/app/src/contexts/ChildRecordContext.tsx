import { createContext, useContext, useState, ReactNode } from "react"
import { SidebarContextType } from "./SidebarContext"

const ChildRecordContext = createContext<SidebarContextType | null>(null)

export const ChildRecordProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <ChildRecordContext.Provider value={{ isOpen, toggle }}>
            {children}
        </ChildRecordContext.Provider>
    )
}

export const useChildRecord = (): SidebarContextType => {
    const context = useContext(ChildRecordContext)
    if (!context) {
        throw new Error("useRecord must be used within a SidebarProvider")
    }
    return context
}
