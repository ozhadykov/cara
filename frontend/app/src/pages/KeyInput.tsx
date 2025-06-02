import { ChangeEvent, useEffect, useState } from "react"
import { postRequest } from "../lib/request"
import { useToast } from "../contexts/providers/ToastContext"

const KeyInput = () => {
    const { sendMessage } = useToast()
    const [openCageKey, setOpenCageKey] = useState("")
    const [amplKey, setAmplKey] = useState("")

    const handleChangeApiKey = (event: ChangeEvent<HTMLInputElement>) => {
        setOpenCageKey(event.target.value)
    }
    const handleChangeAmpl = (event: ChangeEvent<HTMLInputElement>) => {
        setAmplKey(event.target.value)
    }

    useEffect(() => {
        // dev only
        const getOpenCageKey = async () => {
            const response = await fetch("/api/keys/opencagekey")
            const data = await response.json()
            if (response.ok) {
                setOpenCageKey(data.apiKey)
            }
        }
        const getAmplKey = async () => {
            const response = await fetch("/api/keys/amplkey")
            const data = await response.json()
            if (response.ok) {
                setAmplKey(data.apiKey)
            }
        }

        getOpenCageKey()
        getAmplKey()
    }, [])

    return (
        <div className="home-content flex flex-col gap-3 items-center justify-center w-full h-full">
            <div className="flex flex-row items-center gap-2">
                <label className="w-32">OpenCage Key</label>
                <input
                    className="border border-gray-300 rounded px-3 py-2 w-64"
                    type="text"
                    value={openCageKey}
                    onChange={handleChangeApiKey}
                />
                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        postRequest(
                            "/api/keys/opencagekey",
                            { apiKey: openCageKey },
                            sendMessage
                        )
                    }
                >
                    Send
                </button>
            </div>

            <div className="flex flex-row items-center gap-2">
                <label className="w-32">AMPL Key</label>
                <input
                    className="border border-gray-300 rounded px-3 py-2 w-64"
                    type="text"
                    value={amplKey}
                    onChange={handleChangeAmpl}
                />
                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        postRequest("/api/keys/amplKey", { apiKey: amplKey }, sendMessage)
                    }
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default KeyInput
