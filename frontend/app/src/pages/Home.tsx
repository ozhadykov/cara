import { Icon } from "@iconify/react"

const Home = () => {
    return (
        <div className="home-content flex flex-col gap-3 w-full h-full">
            <div className="home-header mb-5">
                <h1 className="text-3xl font-semibold">Welcome</h1>
                <span className="mt-1 text-sm text-gray-400 flex items-center gap-1">
                    <Icon icon="solar:info-circle-linear" /> Here is actual information about your assigments
                </span>
            </div>
        </div>
    )
}

export default Home
