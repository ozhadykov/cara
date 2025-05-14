import { createContext, ReactNode, useContext, useState } from "react"

export type RecordSidebarType = {
    isOpen: boolean
    toggle: () => void
}

const RecordSidebarContext = createContext<RecordSidebarType | null>(null)

export const RecordSidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const toggle = () => setIsOpen((p) => !p)

    return (
        <RecordSidebarContext.Provider value={{ isOpen, toggle }}>
            {children}
        </RecordSidebarContext.Provider>
    )
}

export const useRecordSidebar = () => {
    const ctx = useContext(RecordSidebarContext)
    if (!ctx) throw new Error("Must use within SidebarUIProvider")
    return ctx
}
