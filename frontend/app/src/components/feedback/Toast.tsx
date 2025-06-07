import { useToast } from "../../contexts/providers/ToastContext.tsx"

const Toast = () => {
    const { message, type, isOpen } = useToast()

    return (
        <div
            className={`toast toast-start transition-opacity z-100 ${
                isOpen ? "opacity-100" : "opacity-0"
            }`}
        >
            <div className={`alert alert-${type}`}>
                <span>{message}</span>
            </div>
        </div>
    )
}

export default Toast
