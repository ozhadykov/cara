import { createContext, ReactNode, useContext, useState } from "react"
import { Child } from "../../lib/models"

export type ChildrenDataContextType = {
    children: Child[]
    setChildren: (c: Child[]) => void
    refreshChildren: () => Promise<void>
}

const ChildrenDataContext = createContext<ChildrenDataContextType | null>(null)

export const ChildrenDataProvider = ({ children }: { children: ReactNode }) => {
    const [childData, setChildData] = useState<Child[]>([])

    const refreshChildren = async () => {
        const res = await fetch("/api/db/children")
        const data = await res.json()
        setChildData([...data])
    }

    return (
        <ChildrenDataContext.Provider
            value={{
                children: childData,
                setChildren: setChildData,
                refreshChildren,
            }}
        >
            {children}
        </ChildrenDataContext.Provider>
    )
}

export const useChildrenData = () => {
    const ctx = useContext(ChildrenDataContext)
    if (!ctx) throw new Error("Must use within ChildrenDataProvider")
    return ctx
}
