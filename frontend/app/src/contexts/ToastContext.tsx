import { createContext, useContext, useState } from "react"

export type ToastContextTypes = {
    message: string,
    isOpen: boolean,
    toggle: () => void,
    sendMessage: (message: string) => void,
}

const ToastContext = createContext<ToastContextTypes | null>(null)

export const ToastProvider = ({ children }: ToastContextTypes) => {
    const [message, setMessage] = useState<string>("")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }
    const sendMessage = (message: string) => {
        setMessage(message)
    }

    return <ToastContext.Provider value={{ isOpen, message, sendMessage, toggle }}>{children}</ToastContext.Provider>
}

export const useToast = (): ToastContextTypes => {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error("useToast must be used within a ToastProvider")
    }
    return context
}