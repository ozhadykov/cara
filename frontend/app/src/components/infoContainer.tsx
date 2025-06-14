import { Icon } from "@iconify/react/dist/iconify.js"
import { ReactNode } from "react"

type InfoContainerType = {
    children: ReactNode
    header: string
    icon: string
}

const InfoContainer = ({ children, header, icon }: InfoContainerType) => {
    return (
        <div className="bg-white p-8 shadow-md rounded-md flex flex-col flex-grow">
            <div className="mb-5">
                <Icon icon={icon} style={{ fontSize: "48px" }} />
            </div>
            <h3 className="font-bold text-2xl ">{header}</h3>
            {children}
        </div>
    )
}

export default InfoContainer
