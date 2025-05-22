import { toastTypes } from "./constants"

export const postRequest = async (
    url: string,
    requestBody: object,
    sendMessage: (message: string, type: string) => void,
    toggleLoading?: (state: boolean) => void,
) => {
    try {
        toggleLoading?.(true)
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(requestBody),
        })
        toggleLoading?.(false)

        if (!response.ok) {
            sendMessage(`Server returned ${response.status}`, toastTypes.error)
            throw new Error(`Server returned ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Fehler beim Senden:", error)
    }
}

export const deleteRequest = async (url: string, requestBody: object) => {
    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`)
        }

        await response.json()
    } catch (error) {
        console.error("Fehler beim Senden:", error)
    }
}
