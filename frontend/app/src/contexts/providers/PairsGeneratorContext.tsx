import { createContext, ReactNode, useContext, useState } from "react"
import { Assistant, Child } from "../../lib/models.ts"

export type PairsGeneratorTypes = {
    selectedChildren: Child[]
    selectedAssistants: Assistant[]
    setSelectedChildren: (children:Child[]) => void
    setSelectedAssistants: (assistants:Assistant[]) => void
}

const PairsGeneratorContext = createContext<PairsGeneratorTypes | null>(null)

export const PairsGeneratorProvider = ({ children }: { children: ReactNode }) => {
    const [selectedChildren, setSelectedChildren] = useState<Child[]>([])
    const [selectedAssistants, setSelectedAssistants] = useState<Assistant[]>([])
    return (
        <PairsGeneratorContext.Provider value={{selectedChildren, setSelectedChildren, selectedAssistants, setSelectedAssistants}}>
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