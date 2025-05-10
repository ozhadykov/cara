import { Navbar, Sidebar, Footer, Toast } from "./components"
import { Routes, Route } from "react-router"
import { useSidebar } from "./contexts/SidebarContext.tsx"
import routes from "./routes.tsx"
import { ReactNode } from "react"

function App() {
     const { isOpen } = useSidebar()

    const routesHTML: Array<ReactNode> = routes.map((route) => {
        return <Route key={route.path} path={route.path} element={route.component}></Route>
    })

    return (
        <div className="flex flex-col h-full">
            <Navbar />
            <Sidebar />
            <main className={`flex-1 px-6 pt-20 transition-transform ${isOpen ? "translate-x-64 w-[calc(100%-var(--spacing)*64)]" : ""}`}>
                <Routes>{routesHTML}</Routes>
            </main>
            <Toast />
            <Footer />
        </div>
    )
}

export default App
