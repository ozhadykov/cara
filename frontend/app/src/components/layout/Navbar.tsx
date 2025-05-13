import { Icon } from "@iconify/react"
import { useSidebar } from "../../contexts/SidebarContext.tsx"

const Navbar = () => {
    const { toggle, isOpen } = useSidebar()

    return (
        <div className="fixed top-0 z-40 w-full bg-primary">
            <div className="navbar flex bg-primary px-4">
                <button onClick={toggle} className="btn btn-square btn-ghost">
                    <Icon
                        icon={
                            isOpen
                                ? "solar:double-alt-arrow-left-line-duotone"
                                : "solar:hamburger-menu-linear"
                        }
                        style={{ fontSize: "32px", color: "#333333" }}
                    />
                </button>

                <a className="btn btn-ghost text-2xl font-semibold" href={"/"}>
                    CARA
                </a>
            </div>
        </div>
    )
}

export default Navbar
