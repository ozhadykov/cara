import { useSidebar } from "../../contexts/SidebarContext.tsx"
import routes from "../../routes.tsx"
import { NavLink } from "react-router"
import { ReactNode } from "react"

const Sidebar = () => {
    const { isOpen, toggle } = useSidebar()

    const links: Array<ReactNode> = routes.map((route) => {
        return (
            <NavLink key={route.path} to={route.path} onClick={toggle}>
                {route.label}
            </NavLink>
        )
    })

    return (
        <div className="drawer">
            <input
                id="my-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={isOpen}
                onChange={toggle}
            />
            <div className="drawer-side">
                <label
                    htmlFor="my-drawer"
                    aria-label="close sidebar"
                    className="drawer-overlay"
                ></label>
                <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                    <div className="sidebar-header border-b-2 border-zinc-400 pb-2.5 flex flex-col">
                        <span className="text-xl font-bold">CARA</span>
                        <span className="pl-0.5 text-xs font-light text-zinc-400">
                            your smart child care assistant
                        </span>
                    </div>
                    <li className="sidebar-body py-3 text-base">{links}</li>
                </ul>
            </div>
        </div>
    )
}

export default Sidebar
