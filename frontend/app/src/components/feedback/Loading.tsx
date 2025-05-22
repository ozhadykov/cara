import React from "react"
import {useLoading} from "../../contexts"

const Loading = () => {
    const { isLoading } = useLoading()

    if (isLoading)
        return (
            <div
                className="absolute bg-white opacity-80 z-10 w-full h-full flex gap-5 items-center justify-center overflow-hidden text-black">
                <span className="text-xl">Loading...</span>
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        )

    return <></>
}

export default Loading