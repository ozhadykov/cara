import { Home, AssistantsImport, ChildrenImport, KeyInput } from "./pages"
import AmplData from "./pages/AmplData.tsx"
import { ReactElement } from "react"
import { Icon } from "@iconify/react"

interface IRoute {
    path: string
    label: string
    component: ReactElement
    fillIcon: string
    outlineIcon: string
}

const routes: Array<IRoute> = [
    {
        path: "/",
        component: <Home />,
        label: "Home",
        fillIcon: "solar:widget-bold-duotone",
        outlineIcon: "solar:widget-line-duotone",
    },
    {
        path: "/children",
        component: <ChildrenImport />,
        label: "Children",
        fillIcon: "solar:documents-bold-duotone",
        outlineIcon: "solar:documents-line-duotone",
    },
    {
        path: "/assistants",
        component: <AssistantsImport />,
        label: "Assistent",
        fillIcon: "solar:documents-bold-duotone",
        outlineIcon: "solar:documents-line-duotone",
    },
    {
        path: "/keyInput",
        component: <KeyInput />,
        label: "Key Input",
        fillIcon: "solar:settings-bold-duotone",
        outlineIcon: "solar:settings-line-duotone",
    },
    {
        path: "/dashboard",
        component: <AmplData />,
        label: "Ampl Data",
        fillIcon: "solar:transfer-horizontal-bold-duotone",
        outlineIcon: "solar:transfer-horizontal-line-duotone",
    },
]

export default routes
