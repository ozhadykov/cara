import { Icon } from "@iconify/react"
import { ChangeEvent, useEffect, useState } from "react"

import { Range, TabCard } from "../components"
import { postRequest } from "../lib/request"
import { useLoading, useToast } from "../contexts"
import { toastTypes } from "../lib/constants.ts"

const Settings = () => {
    const { sendMessage } = useToast()
    const { toggleLoading } = useLoading()
    const [amplKey, setAmplKey] = useState("")
    const [googleKey, setGoogleKey] = useState<string>("")

    const handleChangeAmpl = (event: ChangeEvent<HTMLInputElement>) => {
        setAmplKey(event.target.value)
    }
    const handleChangeGoogle = (event: ChangeEvent<HTMLInputElement>) => {
        setGoogleKey(event.target.value)
    }

    const sendKey = async (keyId: string, keyValue: string) => {
        const response = await postRequest(
            `/api/settings/key/${keyId}`,
            { apiKey: keyValue },
            sendMessage,
            toggleLoading,
        )
        if (response)
            sendMessage(response.message, response.success ? toastTypes.success : toastTypes.error)
    }


    useEffect(() => {
        const fetchData = async () => {
            toggleLoading(true)
            try {
                const getAmplKey = async () => {
                    const response = await fetch("/api/settings/key/ampl_key")
                    const data = await response.json()
                    if (response.ok) setAmplKey(data.apiKey)
                }

                const getGoogleKey = async () => {
                    const response = await fetch("/api/settings/key/google_maps_key")
                    const data = await response.json()
                    if (response.ok) setGoogleKey(data.apiKey)
                }


                await getAmplKey()
                await getGoogleKey()
            } catch (err) {
                console.error("Error fetching settings:", err)
                sendMessage("Error loading settings.", toastTypes.error)
            } finally {
                toggleLoading(false)
            }
        }

        fetchData()
    }, [])

    return (
        <>
            <div className="settings-page flex flex-col gap-3 w-full h-full">
                <div className="settings-page-header mb-5">
                    <h1 className="text-3xl font-semibold">Settings</h1>
                    <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                        <Icon icon="solar:info-circle-linear" /> Here you can set up your program
                    </span>
                </div>
                <div className="tab-container shadow-md">
                    <div className="tab-container shadow-md">
                        <div className="tabs tabs-lift">
                            <label className="tab">
                                <input type="radio" name="my_tabs_4" defaultChecked />
                                <Icon icon="solar:key-linear" />
                                <span className="ml-1">Keys</span>
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                <TabCard
                                    title={"Keys setup"}
                                    description="This is very important setting, without google api keys, software will not able to work"
                                >
                                    <div
                                        className="keys-settings-content flex flex-col gap-3 items-center justify-center w-full h-full">
                                        <div className="w-full flex flex-row items-center gap-2">
                                            <label className="w-48">AMPL Key</label>
                                            <input
                                                className="border border-gray-300 rounded px-3 py-2 w-64"
                                                type="text"
                                                value={amplKey}
                                                onChange={handleChangeAmpl}
                                            />
                                            <button
                                                className="btn btn-secondary"
                                                onClick={async () =>
                                                    await sendKey("ampl_key", amplKey)
                                                }
                                            >
                                                Send
                                            </button>
                                        </div>

                                        <div className="w-full flex flex-row items-center gap-2">
                                            <label className="w-48">Google Cloud Key</label>
                                            <input
                                                className="border border-gray-300 rounded px-3 py-2 w-64"
                                                type="password"
                                                value={googleKey}
                                                onChange={handleChangeGoogle}
                                            />
                                            <button
                                                className="btn btn-secondary"
                                                onClick={async () =>
                                                    await sendKey("google_maps_key", googleKey)
                                                }
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </div>
                                </TabCard>
                            </div>

                            <label className="tab">
                                <input type="radio" name="my_tabs_4" />
                                <Icon icon="solar:chat-line-linear" />
                                <span className="ml-1">API Overview</span>
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                <TabCard title={"API overview"} description={""}>
                                    <p>This is the live documentation generated by our FastAPI backend.</p>
                                    <iframe
                                        src="/api/docs"
                                        title="API Documentation"
                                        style={{ width: "100%", height: "80vh", border: "1px solid #ccc" }}
                                        seamless
                                    />
                                </TabCard>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings
