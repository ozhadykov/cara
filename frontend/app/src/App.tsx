import { Navbar, MainSidebar, Footer, Toast, Loading } from "./components"
import { Routes, Route, useLocation } from "react-router"
import { useMainSidebar } from "./contexts/providers/MainSidebarContext.tsx"
import routes from "./routes.tsx"
import { ReactNode } from "react"
import RecordSidebar from "./components/import/sidebars/RecordSideBar.tsx"
import { useLoading } from "./contexts"

function App() {
    const { isOpen } = useMainSidebar()
    const { isLoading } = useLoading()
    const location = useLocation()

    const routesHTML: Array<ReactNode> = routes.map((route) => {
        return <Route key={route.path} path={route.path} element={route.component}></Route>
    })

    return (
        <>
            <div className="flex flex-col h-full">
                <Navbar />
                <MainSidebar />
                {location.pathname.includes("children") ? <RecordSidebar pageType="children" /> : <></>}
                {location.pathname.includes("assistants") ? (
                    <RecordSidebar pageType="assistants" />
                ) : (
                    <></>
                )}

                <main
                    className={`flex-1 px-9 pt-23 transition-transform ${
                        isOpen ? "translate-x-64 w-[calc(100%-var(--spacing)*64)]" : ""
                    } ${isLoading ? "overflow-hidden " : ""}`}
                >
                    <Routes>{routesHTML}</Routes>
                </main>
                <Toast />
                <Loading />
                <Footer />
            </div>
        </>
    )
}

export default App
