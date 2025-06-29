import { Home, AssistantsImport, ChildrenImport, Settings, PairGenerator } from "./pages"
import { ReactElement } from "react"

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
        fillIcon: "solar:people-nearby-bold-duotone",
        outlineIcon: "solar:people-nearby-line-duotone",
    },
    {
        path: "/assistants",
        component: <AssistantsImport />,
        label: "Assistants",
        fillIcon: "solar:users-group-rounded-bold-duotone",
        outlineIcon: "solar:users-group-rounded-line-duotone",
    },
    {
        path: "/keyInput",
        component: <Settings />,
        label: "Settings",
        fillIcon: "solar:settings-bold-duotone",
        outlineIcon: "solar:settings-line-duotone",
    },
    {
        path: "/pairs",
        component: <PairGenerator />,
        label: "Pairs",
        fillIcon: "solar:transfer-horizontal-bold-duotone",
        outlineIcon: "solar:transfer-horizontal-line-duotone",
    },
]

export default routes
