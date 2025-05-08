import { useEffect, useState } from "react"
import { Response, sendRequest } from "../lib/request"

const AssigmentDashboard = () => {
    const [data, setData] = useState<any>()

    useEffect(() => {
        const getAmplDevData = async () => {
            const URL = "http://localhost:8080/ampl/dev"
            const method = "GET"
            const response: Response = await sendRequest(URL, method)
            if (response?.success) setData(response.data)
            console.log(response)
        }

        getAmplDevData()

        console.log(data)
    }, [])

    return (
        <>
            <h1>Assigment</h1>
        </>
    )
}

export default AssigmentDashboard
