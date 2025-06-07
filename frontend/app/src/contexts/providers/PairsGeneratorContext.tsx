import { createContext, ReactNode, useContext, useState } from "react"
import { Assistant, Child } from "../../lib/models.ts"

export type PairsGeneratorTypes = {
    selectedChildrenObj: Child[]
    selectedAssistantsObj: Assistant[]
    setSelectedChildrenObj: (children:Child[]) => void
    setSelectedAssistantsObj: (assistants:Assistant[]) => void
}

const PairsGeneratorContext = createContext<PairsGeneratorTypes | null>(null)

export const PairsGeneratorProvider = ({ children }: { children: ReactNode }) => {
    const [selectedChildrenObj, setSelectedChildrenObj] = useState<Child[]>([])
    const [selectedAssistantsObj, setSelectedAssistantsObj] = useState<Assistant[]>([])
    return (
        <PairsGeneratorContext.Provider value={{selectedChildrenObj, setSelectedChildrenObj, selectedAssistantsObj, setSelectedAssistantsObj}}>
            {children}
        </PairsGeneratorContext.Provider>
    )
}

export const usePairsGenerator = ():PairsGeneratorTypes => {
    const context = useContext(PairsGeneratorContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}