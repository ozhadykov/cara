import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"

interface RangeProps {
    label: string,
    description?: string,
    setValueForParent: (value: string) => void,
    initialValue?: string,
    min?: number,
    max?: number,
    step?: number
}

const Range = ({ label, description, setValueForParent, initialValue, min = 0, max = 100, step = 10 }: RangeProps) => {
    const [rangeVal, setRangeVal] = useState<string>(initialValue ?? '0')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRangeVal(e.target.value)
        setValueForParent(e.target.value)
    }

    useEffect(() => {
        if (initialValue !== undefined) {
            setRangeVal(initialValue)
        }
    }, [initialValue])

    return (
        <div className="range-container grid grid-cols-12 gap-6 justify-between pr-4 py-3">
            <div className="label h-full col-span-5 flex flex-col items-start text-wrap overflow-hidden">
                <p className="text-black font-medium text-lg">{label}</p>
                {description && (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:info-circle-linear" /> {description}
                    </span>
                )}
            </div>
            <div className="range-slider col-span-5 w-full max-w-md">
                <div className="w-full max-w-md">
                    <input type="range" min={min} max={max} value={rangeVal} className="range range-xs w-full"
                           step={step} onChange={handleChange} />
                    <div className="flex justify-between px-2.5 mt-2 text-xs">
                        <span>{min}</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>|</span>
                        <span>{max}</span>
                    </div>
                </div>
            </div>
            <div className="slider-value col-span-2 flex items-center gap-3">
                <p>Value:</p>
                <p className="font-bold text-lg">{rangeVal}</p>
            </div>
        </div>
    )
}

export default Range