import { Navbar, Sidebar, Footer, Toast } from "./components"
import { Routes, Route, useLocation } from "react-router"
import { useSidebar } from "./contexts/SidebarContext.tsx"
import routes from "./routes.tsx"
import { ReactNode } from "react"
import ChildrenRecord from "./components/import/ChildRecord.tsx"
import AssistentRecord from "./components/import/AssistentRecord.tsx"

function App() {
    const { isOpen } = useSidebar()
    const location = useLocation()

    const routesHTML: Array<ReactNode> = routes.map((route) => {
        return <Route key={route.path} path={route.path} element={route.component}></Route>
    })

    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <Sidebar />
            {location.pathname.includes("children") ? <ChildrenRecord /> : <></>}
            {location.pathname.includes("assistants") ? <AssistentRecord /> : <></>}

            <main
                className={`flex-1 px-9 pt-23 transition-transform ${
                    isOpen ? "translate-x-64 w-[calc(100%-var(--spacing)*64)]" : ""
                }`}
            >
                <Routes>{routesHTML}</Routes>
            </main>
            <Toast />
            <Footer />
        </div>
    )
}

export default App
