import { HamburgerMenu } from "solar-icon-set"
import { useSidebar } from "../../contexts/SidebarContext.tsx"

const Navbar = () => {
    const { toggle } = useSidebar()

    return (
        <div className="fixed top-0 z-50 w-full bg-primary">
            <div className="navbar flex bg-primary py-[8px] px-[24px]">
                <button onClick={toggle} className="btn btn-square btn-ghost">
                    <HamburgerMenu size={32} />
                </button>

                <a className="btn btn-ghost text-2xl font-normal" href={"/"}>
                    CARA
                </a>
            </div>
        </div>
    )
}

export default Navbar
