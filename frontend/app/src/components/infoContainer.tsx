import { Icon } from "@iconify/react/dist/iconify.js"
import { ReactNode } from "react"
import { NavLink } from "react-router"

type InfoContainerType = {
    children: ReactNode
    header: string
    icon: string
    href: string
}

const InfoContainer = ({ children, header, icon, href }: InfoContainerType) => {
    return (
        <div className="card bg-white text-primary-content shadow-md flex flex-grow">
            <div className="card-body justify-between">
                <div className="flex flex-col">
                    <div className="mb-5 self-center">
                        <Icon icon={icon} style={{ fontSize: "48px" }} />
                    </div>
                    <h2 className="card-title mb-2">{header}</h2>
                    <div className="flex flex-col gap-1 text-gray-600">{children}</div>
                </div>

                <div className="card-actions justify-end mt-2">
                    <NavLink to={href}>
                        <button className="btn btn-secondary">Configure</button>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default InfoContainer
