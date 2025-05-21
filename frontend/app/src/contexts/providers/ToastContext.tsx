import { createContext, ReactNode, useContext, useState } from "react"

export type ToastContextTypes = {
    message: string
    type: string
    isOpen: boolean
    sendMessage: (message: string, type: string) => void
}

const ToastContext = createContext<ToastContextTypes | null>(null)

export const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [message, setMessage] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [type, setType] = useState<string>("success")
    const sendMessage = (message: string, type: string) => {
        setMessage(message)
        setType(type)
        setIsOpen(true)
        setTimeout(() => setIsOpen(false), 4000)
    }

    return (
        <ToastContext.Provider value={{ isOpen, message, type, sendMessage }}>
            {children}
        </ToastContext.Provider>
    )
}

export const useToast = (): ToastContextTypes => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}
