import { createContext, ReactNode, useContext, useState } from "react"

export type PairsGeneratorTypes = {
    selectedChildrenIds: number[]
    selectedAssistantsIds: number[]
    setSelectedChildrenIds: (children:number[]) => void
    setSelectedAssistantsIds: (assistants:number[]) => void
}

const PairsGeneratorContext = createContext<PairsGeneratorTypes | null>(null)

export const PairsGeneratorProvider = ({ children }: { children: ReactNode }) => {
    const [selectedChildrenIds, setSelectedChildrenIds] = useState<number[]>([])
    const [selectedAssistantsIds, setSelectedAssistantsIds] = useState<number[]>([])
    return (
        <PairsGeneratorContext.Provider value={{selectedChildrenIds, setSelectedChildrenIds, selectedAssistantsIds, setSelectedAssistantsIds}}>
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