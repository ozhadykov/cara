import { createContext, useContext, useState, ReactNode } from "react"

export type MainSidebarContextType = {
    isOpen: boolean
    toggle: () => void
}

const MainSidebarContext = createContext<MainSidebarContextType | null>(null)

export const MainSidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <MainSidebarContext.Provider value={{ isOpen, toggle }}>
            {children}
        </MainSidebarContext.Provider>
    )
}

export const useMainSidebar = (): MainSidebarContextType => {
    const context = useContext(MainSidebarContext)
    if (!context) {
        throw new Error("useSidebar must be used within a SidebarProvider")
    }
    return context
}
