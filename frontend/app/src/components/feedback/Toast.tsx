import { useToast } from "../../contexts/ToastContext.tsx"

const Toast = () => {
    const { message, isOpen, toggle } = useToast()

    if (isOpen)
        setTimeout(toggle, 2000)

    return (
        <div className={`toast toast-start ${isOpen ? 'opacity-1' : 'opacity-0'}`}>
            <div className="alert alert-success">
                <span>{message}</span>
            </div>
        </div>
    )

}

export default Toast