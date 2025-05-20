export const postRequest = async (url: string, requestBody: Object) => {
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },

            body: JSON.stringify(requestBody),
        })

        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`)
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error("Fehler beim Senden:", error)
    }
}

export const deleteRequest = async (url: string, requestBody: Object) => {
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
