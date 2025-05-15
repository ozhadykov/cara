import { ReactNode } from "react"
import { MainSidebarProvider } from "./providers/MainSidebarContext"
import { ToastProvider } from "./providers/ToastContext"
import { ChildrenDataProvider } from "./providers/ChildrenDataContext"
import { RecordSidebarProvider } from "./providers/RecordSidebarContext"

const AppProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MainSidebarProvider>
            <ToastProvider>
                <ChildrenDataProvider>
                    <RecordSidebarProvider>{children}</RecordSidebarProvider>
                </ChildrenDataProvider>
            </ToastProvider>
        </MainSidebarProvider>
    )
}

export default AppProvider
