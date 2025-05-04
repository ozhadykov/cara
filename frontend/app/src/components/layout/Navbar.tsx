import {useSidebar} from "../../contexts/SidebarContext.tsx";

const Navbar = () => {
    const { toggle } = useSidebar();

    return (
        <div className="navbar-wrapper p-4 fixed w-full">
            <div className="navbar bg-base-200 shadow-sm rounded-xl">
                <div className="flex-none">
                    <button onClick={toggle} className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path> </svg>
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center">
                    <a className="btn btn-ghost text-xl" href={'/'}>CARA</a>
                </div>
                <div className="flex-none">
                    <button className="btn btn-square btn-ghost">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="inline-block h-5 w-5 stroke-current"> <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"></path> </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar