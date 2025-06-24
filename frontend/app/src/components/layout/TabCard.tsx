import React, { ReactNode } from "react"
import { Icon } from "@iconify/react"

interface TabCardProps {
    title: string
    description?: string
    children?: ReactNode
}

const TabCard = ({ title, description, children }: TabCardProps) => {
    return (
        <div className="tab-card">
            <div className="tab-card-header d-flex flex-col gap-2 mb-10">
                <h2 className="text-xl font-semibold">{title}</h2>
                {description && (
                    <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:info-circle-linear" /> {description}
                    </span>
                )}
            </div>
            <div className="tab-card-content flex flex-col gap-10 w-full">
                {children}
            </div>
        </div>
    )
}

export default TabCard
