import { createContext, ReactNode, useContext, useState } from "react"
import { Assistant } from "../../lib/models"

export type AssistantDataContextType = {
    assistants: Assistant[]
    setAssistants: (c: Assistant[]) => void
    refreshAssistants: () => Promise<void>
}

const AssistantDataContext = createContext<AssistantDataContextType | null>(null)

export const AssistantsDataProvider = ({ children }: { children: ReactNode }) => {
    const [assistantData, setAssistantData] = useState<Assistant[]>([])

    const refreshAssistants = async () => {
        const res = await fetch("/api/assistants")
        const data = await res.json()
        setAssistantData([...data])
    }

    return (
        <AssistantDataContext.Provider
            value={{
                assistants: assistantData,
                setAssistants: setAssistantData,
                refreshAssistants,
            }}
        >
            {children}
        </AssistantDataContext.Provider>
    )
}

export const useAssistantData = () => {
    const ctx = useContext(AssistantDataContext)
    if (!ctx) throw new Error("Must use within AssistantDataProvider")
    return ctx
}
