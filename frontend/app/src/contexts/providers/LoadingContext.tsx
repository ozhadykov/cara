import { createContext, ReactNode, useContext, useState } from "react"

export type LoadingContextTypes = {
    isLoading: boolean
    toggleLoading: (state: boolean) => void
}

const LoadingContext = createContext<LoadingContextTypes | null>(null)

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const toggleLoading = (state: boolean) => {
        setIsLoading(state)
    }

    return (
        <LoadingContext.Provider value={{ isLoading, toggleLoading }}>
            {children}
        </LoadingContext.Provider>
    )
}

export const useLoading = (): LoadingContextTypes => {
    const context = useContext(LoadingContext)
    if (!context) {
        throw new Error("useLoading must be used within a ToastProvider")
    }
    return context
}
