import {ReactNode} from "react"
import {MainSidebarProvider} from "./providers/MainSidebarContext"
import {ToastProvider} from "./providers/ToastContext"
import {ChildrenDataProvider} from "./providers/ChildrenDataContext"
import {RecordSidebarProvider} from "./providers/RecordSidebarContext"
import {LoadingProvider} from "./providers/LoadingContext.tsx";

const AppProvider = ({children}: { children: ReactNode }) => {
  return (
    <MainSidebarProvider>
      <LoadingProvider>
        <ToastProvider>
          <ChildrenDataProvider>
            <RecordSidebarProvider>{children}</RecordSidebarProvider>
          </ChildrenDataProvider>
        </ToastProvider>
      </LoadingProvider>
    </MainSidebarProvider>
  )
}

export default AppProvider
