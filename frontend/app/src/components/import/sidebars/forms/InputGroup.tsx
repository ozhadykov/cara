import { ReactNode } from "react"

type InputGroupType = {
    children: ReactNode
    header: string
}

const InputGroup = ({ children, header }: InputGroupType) => {
    return (
        <div className="flex flex-col gap-2 mb-5">
            <h6>{header}</h6>
            <div className="flex flex-col gap-5">{children}</div>
        </div>
    )
}

export default InputGroup
