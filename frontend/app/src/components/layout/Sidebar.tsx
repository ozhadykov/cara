import { NavLink } from "react-router"
import { useSidebar } from "../../contexts/SidebarContext.tsx"
import routes from "../../routes.tsx"

const Sidebar = () => {
    const { isOpen, toggle } = useSidebar()

    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-20 
                    border-r border-gray-200 bg-white
                    transition-transform ${isOpen ? " translate-x-0" : "-translate-x-full"}`}
        >
            <div className="h-full px-3 pb-4 overflow-y-auto">
                <ul className="font-medium flex flex-col px-[10px]">
                    {routes.map((route) => (
                        <NavLink key={route.path} to={route.path} onClick={toggle}>
                            <div className="flex items-center gap-[20px] py-[15px] px-[20px] hover:bg-base-300 rounded-lg">
                                {route.icon}
                                <label className="text-[16px]">{route.label}</label>
                            </div>
                        </NavLink>
                    ))}
                </ul>
            </div>
        </aside>
    )
}

export default Sidebar
