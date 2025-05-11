import { NavLink, useLocation } from "react-router"
import { useSidebar } from "../../contexts/SidebarContext.tsx"
import routes from "../../routes.tsx"

const Sidebar = () => {
    const { isOpen } = useSidebar()
    const location = useLocation()

    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-fit h-screen pt-20 
                    border-r border-gray-200 bg-white
                    transition-transform ${isOpen ? " translate-x-0" : "-translate-x-full"}`}
        >
            <div className="h-full px-3 pb-4 overflow-y-auto">
                <ul className="font-medium flex flex-col px-[10px]">
                    {routes.map((route) => (
                        <NavLink key={route.path} to={route.path}>
                            <div className={`flex items-center gap-[20px] py-[15px] px-[20px] hover:bg-base-300 rounded-lg ${location.pathname === route.path ? 'bg-base-300' : ''}`}>
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
