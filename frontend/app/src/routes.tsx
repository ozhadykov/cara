import { ReactElement } from "react"
import { Home } from "./pages"
import { DataImport } from "./pages"
import KeyInput from "./pages/KeyInput.tsx"

interface IRoute {
    path: string
    label: string
    component: ReactElement | string
    icon?: ReactElement | string
}

const routes: Array<IRoute> = [
    {
        path: "/",
        component: <Home />,
        label: "Home",
    },
    {
        path: "/import",
        component: <DataImport />,
        label: "Data Import",
    },
    {
        path: "/keyInput",
        component: <KeyInput />,
        label: "Key Input",
    },
]

export default routes
