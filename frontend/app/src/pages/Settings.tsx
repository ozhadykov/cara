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
    const [distanceImportance, setDistanceImportance] = useState<string>("0")
    const [qualificationImportance, setQualificationImportance] = useState<string>("0")
    const [showAmplKey, setShowAmplKey] = useState(false)
    const [showGoogleKey, setShowGoogleKey] = useState(false)

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
            toggleLoading
        )
        if (response)
            sendMessage(response.message, response.success ? toastTypes.success : toastTypes.error)
    }

    // todo: get from db
    const saveWeights = async () => {
        const distanceImpNumber = Number(distanceImportance)
        const qualificationImpNumber = Number(qualificationImportance)

        if (distanceImpNumber >= 0 && qualificationImpNumber >= 0) {
            const data = {
                distanceImportance: distanceImpNumber,
                qualificationImportance: qualificationImpNumber,
            }
            const response = await postRequest(
                "/api/settings/weights",
                data,
                sendMessage,
                toggleLoading
            )
            if (response)
                sendMessage(
                    response.message,
                    response.success ? toastTypes.success : toastTypes.error
                )
        }
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

                const getWeights = async () => {
                    const response = await fetch("/api/settings/weights")
                    if (response.ok) {
                        const responseObj = await response.json()
                        sendMessage(
                            responseObj.message,
                            responseObj.success ? toastTypes.success : toastTypes.error
                        )
                        if (responseObj.success) {
                            setDistanceImportance(responseObj.data.distanceImportance + "")
                            setQualificationImportance(
                                responseObj.data.qualificationImportance + ""
                            )
                        }
                    }
                }

                await getAmplKey()
                await getGoogleKey()
                await getWeights()
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
                                    description="This is a very important setting! Without the Google API and AMPL keys, the software will not be able to work"
                                >
                                    <div className="keys-settings-content flex flex-col gap-3 items-center justify-center w-full h-full">
                                        <div className="w-full flex flex-row items-center gap-2">
                                            <label className="w-48">AMPL Key</label>
                                            <div className="relative w-64">
                                                <input
                                                    className="border border-gray-300 rounded px-3 py-2 w-full pr-10"
                                                    type={showAmplKey ? "text" : "password"}
                                                    value={amplKey}
                                                    onChange={handleChangeAmpl}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                                    onClick={() => setShowAmplKey(!showAmplKey)}
                                                >
                                                    <Icon
                                                        icon={
                                                            showAmplKey
                                                                ? "solar:eye-bold"
                                                                : "mdi:eye-off"
                                                        }
                                                    />
                                                </button>
                                            </div>
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
                                            <div className="relative w-64">
                                                <input
                                                    className="border border-gray-300 rounded px-3 py-2 w-full pr-10"
                                                    type={showGoogleKey ? "text" : "password"}
                                                    value={googleKey}
                                                    onChange={handleChangeGoogle}
                                                />
                                                <button
                                                    type="button"
                                                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                                                    onClick={() => setShowGoogleKey(!showGoogleKey)}
                                                >
                                                    <Icon
                                                        icon={
                                                            showGoogleKey
                                                                ? "solar:eye-bold"
                                                                : "mdi:eye-off"
                                                        }
                                                    />
                                                </button>
                                            </div>
                                            <button
                                                className="btn btn-secondary"
                                                onClick={() =>
                                                    sendKey("google_maps_key", googleKey)
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
                                <Icon icon="solar:sale-square-linear" />
                                <span className="ml-1">Weights</span>
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                <TabCard
                                    title={"Weights setup"}
                                    description={
                                        "This is a very important setting, without weights, software will not able to generate pairs"
                                    }
                                >
                                    <div className="distance-travel-time-importance">
                                        <Range
                                            label={"Distance importance"}
                                            description={
                                                "Define how important should distance and travel time be interpreted in model"
                                            }
                                            setValueForParent={setDistanceImportance}
                                            initialValue={distanceImportance}
                                        />
                                    </div>
                                    <div className="qualification-importance">
                                        <Range
                                            label={"Qualification importance"}
                                            description={
                                                "Define how important should assistant's qualification be interpreted in model"
                                            }
                                            setValueForParent={setQualificationImportance}
                                            initialValue={qualificationImportance}
                                        />
                                    </div>
                                    <div className="weights-setting-footer mt-8 flex justify-end">
                                        <button
                                            className="btn btn-primary btn-wide"
                                            onClick={saveWeights}
                                        >
                                            Save
                                        </button>
                                    </div>
                                </TabCard>
                            </div>

                            <label className="tab">
                                <input type="radio" name="my_tabs_4" />
                                <Icon icon="solar:chat-line-linear" />
                                <span className="ml-1">Language</span>
                            </label>
                            <div className="tab-content bg-base-100 border-base-300 p-6">
                                <TabCard title={"Languages"} description={""}>
                                    in development
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
