import { Home, AssistantsImport, ChildrenImport, KeyInput } from "./pages"
import AmplData from "./pages/AmplData.tsx"
import { ReactElement } from "react"

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
        path: "/children-import",
        component: <ChildrenImport />,
        label: "Children Import",
    },
    {
        path: "/assistants-import",
        component: <AssistantsImport />,
        label: "Assistant Import",
    },
    {
        path: "/keyInput",
        component: <KeyInput />,
        label: "Key Input",
    },
    {
        path: "/dashboard",
        component: <AmplData />,
        label: "Ampl Data",
    },
]

export default routes
