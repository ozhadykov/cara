import { ChangeEvent, useEffect, useState } from "react"
import { postRequest } from "../lib/request"
import { useToast } from "../contexts/providers/ToastContext"

const KeyInput = () => {
    const { sendMessage } = useToast()
    const [googleApiKey, setApiKey] = useState("")
    const [amplKey, setAmplKey] = useState("")

    const handleChangeApiKey = (event: ChangeEvent<HTMLInputElement>) => {
        setApiKey(event.target.value)
    }
    const handleChangeAmpl = (event: ChangeEvent<HTMLInputElement>) => {
        setAmplKey(event.target.value)
    }

    useEffect(() => {
        // dev only
        const getGoogleKeyData = async () => {
            const response = await fetch("/api/db/apiKey/googleapi")
            const data = await response.json()
            if (response.ok) {
                setApiKey(data.apiKey)
            }
        }
        const getAmplKeyData = async () => {
            const response = await fetch("/api/db/apiKey/amplkey")
            const data = await response.json()
            if (response.ok) {
                setAmplKey(data.apiKey)
            }
        }

        getGoogleKeyData()
        getAmplKeyData()
    }, [])

    return (
        <div className="home-content flex flex-col gap-3 items-center justify-center w-full h-full">
            <div className="flex flex-row items-center gap-2">
                <label className="w-32">Google API Key</label>
                <input
                    className="border border-gray-300 rounded px-3 py-2 w-64"
                    type="text"
                    value={googleApiKey}
                    onChange={handleChangeApiKey}
                />
                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        postRequest(
                            "/api/keys/googleApiKey",
                            { googleApiKey: googleApiKey },
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
                        postRequest("/api/keys/amplKey", { amplKey: amplKey }, sendMessage)
                    }
                >
                    Send
                </button>
            </div>
        </div>
    )
}

export default KeyInput
