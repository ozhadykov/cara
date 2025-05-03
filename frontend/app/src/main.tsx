import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import {BrowserRouter} from 'react-router'
import {SidebarProvider} from "./contexts/SidebarContext.tsx";
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <SidebarProvider>
        <App/>
      </SidebarProvider>
    </BrowserRouter>
  </StrictMode>,
)
