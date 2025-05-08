import { Navbar, Sidebar, Footer } from "./components"
import { Routes, Route } from "react-router"
import routes from "./routes.tsx"
import { ReactNode } from "react"

function App() {
    const routesHTML: Array<ReactNode> = routes.map((route) => {
        return <Route key={route.path} path={route.path} element={route.component}></Route>
    })

    return (
        <div className="flex flex-col h-full">
            <Navbar />

            <Sidebar />
            <main className="flex-1 px-4 pt-25">
                <Routes>{routesHTML}</Routes>
            </main>

            <Footer />
        </div>
    )
}

export default App
