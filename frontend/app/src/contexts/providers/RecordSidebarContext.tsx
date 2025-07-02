import { createContext, ReactNode, useContext, useState } from "react"

export enum Mode {
    CREATE,
    EDIT,
}

export type RecordSidebarType = {
    isOpen: boolean
    mode: Mode
    selectedData: any
    setSelectedData: (selectedData: any) => void
    toggle: () => void
    toggleCreateRecord: () => void
    toggleEditRecord: (data: any) => void
}

const RecordSidebarContext = createContext<RecordSidebarType | null>(null)

export const RecordSidebarProvider = ({ children }: { children: ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false)
    const [mode, setMode] = useState<Mode>(Mode.CREATE)
    const [selectedData, setSelectedData] = useState(null)

    const toggle = () => {
        setIsOpen((p) => !p)
    }

    const toggleCreateRecord = () => {
        toggle()
        setMode(Mode.CREATE)
    }
    const toggleEditRecord = (data: any) => {
        toggle()
        setMode(Mode.EDIT)

        setSelectedData(data)
    }

    return (
        <RecordSidebarContext.Provider
            value={{
                isOpen,
                mode,
                selectedData,
                setSelectedData,
                toggle,
                toggleCreateRecord,
                toggleEditRecord,
            }}
        >
            {children}
        </RecordSidebarContext.Provider>
    )
}

export const useRecordSidebar = () => {
    const ctx = useContext(RecordSidebarContext)
    if (!ctx) throw new Error("Must use within SidebarUIProvider")
    return ctx
}
