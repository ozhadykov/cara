import { Icon } from "@iconify/react/dist/iconify.js"
import { ReactNode } from "react"
import { NavLink } from "react-router"

type InfoContainerType = {
    children: ReactNode
    header: string
    icon: string
    href: string
    color: string
}

const InfoContainer = ({ children, header, icon, href, color }: InfoContainerType) => {
    return (
        <div
            className={`flex flex-grow card bg-white text-primary-content border-2 border-${color}-200 p-5`}
        >
            <div className="card-body justify-between">
                <div className="flex flex-col items-start gap-5">
                    <div className="flex items-center gap-5">
                        <div className={`p-2 rounded-full bg-${color}-100`}>
                            <Icon icon={icon} className={`text-3xl text-${color}-600`} />
                        </div>
                        <h2 className="font-semibold text-lg">{header}</h2>
                    </div>

                    <div className="flex flex-col gap-2 text-gray-600">{children}</div>
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
