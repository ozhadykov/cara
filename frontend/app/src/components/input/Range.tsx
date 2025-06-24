import React, { useState, useEffect } from "react"
import { Icon } from "@iconify/react"

interface RangeProps {
    label: string,
    description?: string,
    setValueForParent: (value: string) => void,
    initialValue?: string
}

const Range = ({ label, description, setValueForParent, initialValue }: RangeProps) => {
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
        <div className="range-container flex justify-between items-center gap-6 pr-4 py-3">
            <div className="label h-full flex flex-col items-start">
                <p className="text-black font-medium text-lg">{label}</p>
                {description && (
                    <span className="text-sm text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:info-circle-linear" /> {description}
                    </span>
                )}
            </div>
            <div className="range-slider w-full max-w-md">
                <div className="w-full max-w-md">
                    <input type="range" min={0} max="100" value={rangeVal} className="range range-sm w-full"
                           step="10" onChange={handleChange} />
                    <div className="flex justify-between px-2.5 mt-2 text-xs">
                        <span>1</span>
                        <span>2</span>
                        <span>3</span>
                        <span>4</span>
                        <span>5</span>
                        <span>6</span>
                        <span>7</span>
                        <span>8</span>
                        <span>9</span>
                        <span>10</span>
                    </div>
                </div>
            </div>
            <div className="slider-value flex items-center gap-3">
                <p>Value:</p>
                <p className="font-bold text-lg">{rangeVal}</p>
            </div>
        </div>
    )
}

export default Range