import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter } from "react-router"
import { SidebarProvider } from "./contexts/SidebarContext.tsx"
import { ToastProvider } from "./contexts/ToastContext.tsx"
import "./index.css"
import App from "./App.tsx"
import { ChildRecordProvider } from "./contexts/ChildRecordContext.tsx"
import { AssistentRecordProvider } from "./contexts/AssistentRecordContext.tsx"

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <BrowserRouter>
            <SidebarProvider>
                <ToastProvider>
                    <ChildRecordProvider>
                        <AssistentRecordProvider>
                            <App />
                        </AssistentRecordProvider>
                    </ChildRecordProvider>
                </ToastProvider>
            </SidebarProvider>
        </BrowserRouter>
    </StrictMode>
)
