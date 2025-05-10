import { createContext, useContext, useState } from "react"

export type ToastContextTypes = {
    message: string,
    isOpen: boolean,
    toggle: () => void,
    setMessage: () => void,
}

const ToastContext = createContext<ToastContextTypes | null>(null)

export const ToastProvider = ({ children }: ToastContextTypes) => {
    const [message, setMessage] = useState<string>('')
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const toggle = () => {
        setIsOpen(!isOpen)
    }
    const setMessage = (message:string) => {
        setMessage(message)
    }

    return <ToastContext.Provider value={{isOpen, message, setMessage, toggle}}>{children}</ToastContext.Provider>
}