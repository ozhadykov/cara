import { ReactNode } from "react"

const AddRecordSideBar = ({
    children,
    isOpen,
    toggle,
}: {
    children: ReactNode
    isOpen: boolean
    toggle: () => void
}) => {
    return (
        <div
            className={`flex fixed w-full h-screen z-30 ${
                isOpen
                    ? "opacity-100 pointer-events-auto"
                    : "opacity-0 pointer-events-none transition-all duration-300"
            }`}
        >
            <div
                className={`w-full transition-all duration-300 ${
                    isOpen ? "bg-[rgba(0,0,0,.5)]" : "bg-transparent"
                }`}
                onClick={toggle}
            />
            <aside
                className={`fixed top-0 right-0 w-md h-full pt-20 flex flex-col justify-between
                    border-gray-200 bg-white 
                    transition-transform  ${
                        isOpen ? "translate-x-0" : "translate-x-full"
                    } border-l-1 shadow-md shadow-black/5 -translate-x-1`}
            >
                {children}
            </aside>
        </div>
    )
}

export default AddRecordSideBar
