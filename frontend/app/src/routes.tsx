import { Home, AssistantsImport, ChildrenImport, KeyInput } from "./pages"
import AmplData from "./pages/AmplData.tsx"
import { ReactElement } from "react"
import { Document, TransferHorizontal, UsersGroupRounded, Widget } from "solar-icon-set"

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
        icon: <Widget size={24} color="#333333" />,
    },
    {
        path: "/children-import",
        component: <ChildrenImport />,
        label: "Children Import",
        icon: <Document size={24} color="#333333" />,
    },
    {
        path: "/assistants-import",
        component: <AssistantsImport />,
        label: "Assistant Import",
        icon: <Document size={24} color="#333333" />,
    },
    {
        path: "/keyInput",
        component: <KeyInput />,
        label: "Key Input",
        icon: <UsersGroupRounded size={24} color="#333333" />,
    },
    {
        path: "/dashboard",
        component: <AmplData />,
        label: "Ampl Data",
        icon: <TransferHorizontal size={24} color="#333333" />,
    },
]

export default routes
