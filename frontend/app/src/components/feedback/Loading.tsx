import React from "react"
import {useLoading} from "../../contexts"

const Loading = () => {
    const { isLoading } = useLoading()

    if (isLoading)
        return (
            <div
                className="fixed top-0 left-0 bg-white opacity-80 z-50 w-full h-full flex gap-5 items-center justify-center overflow-hidden text-black" style={{overflow: "hidden !important"}}>
                <span className="text-xl">Loading...</span>
                <span className="loading loading-spinner loading-xl"></span>
            </div>
        )

    return <></>
}

export default Loading