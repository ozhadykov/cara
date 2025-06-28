import React from "react"
import { TabCard } from "../components"
import { Icon } from "@iconify/react"

const PairsPreview = () => {
    return (
        <div className="generator-content flex flex-col gap-3 w-full h-full">
                <div className="generator-header mb-5">
                    <h1 className="text-3xl font-semibold">Pairs preview</h1>
                    <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:info-circle-linear" /> Here you can preview all your pairs
                    </span>
                </div>
        </div>
    )
}

export default PairsPreview