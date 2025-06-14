import { ReactNode } from "react"

type InputWrapperType = {
    htmlFor: string
    labelText: string
    children: ReactNode
    basis?: "auto" | "1/2" | "1/3" | "2/3" | "1/4" | "3/4" | "1/6" | "5/6" | "full"
}

const InputWrapper = ({ htmlFor, labelText, children, basis = "auto" }: InputWrapperType) => {
    const basisClass =
        {
            auto: "basis-auto",
            "1/2": "basis-1/2",
            "1/3": "basis-1/3",
            "2/3": "basis-2/3",
            "1/4": "basis-1/4",
            "3/4": "basis-3/4",
            "1/6": "basis-1/6",
            "5/6": "basis-5/6",
            full: "basis-full",
        }[basis] || "basis-auto"

    return (
        <div
            className={`flex flex-col w-full justify-center bg-gray-200 p-2 rounded-lg ${basisClass}`}
        >
            <label className="text-xs text-gray-400 mb-1 w-0" htmlFor={htmlFor}>
                {labelText}
            </label>
            {children}
        </div>
    )
}

export default InputWrapper
