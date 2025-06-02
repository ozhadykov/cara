import { ReactNode } from "react"
import { MainSidebarProvider } from "./providers/MainSidebarContext"
import { ToastProvider } from "./providers/ToastContext"
import { ChildrenDataProvider } from "./providers/ChildrenDataContext"
import { RecordSidebarProvider } from "./providers/RecordSidebarContext"
import { LoadingProvider } from "./providers/LoadingContext.tsx"
import { AssistantsDataProvider } from "./providers/AssistantDataContext.tsx"

const AppProvider = ({ children }: { children: ReactNode }) => {
    return (
        <MainSidebarProvider>
            <LoadingProvider>
                <ToastProvider>
                    <ChildrenDataProvider>
                        <AssistantsDataProvider>
                            <RecordSidebarProvider>{children}</RecordSidebarProvider>
                        </AssistantsDataProvider>
                    </ChildrenDataProvider>
                </ToastProvider>
            </LoadingProvider>
        </MainSidebarProvider>
    )
}

export default AppProvider
