import DataImport from "./pages/DataImport.tsx";
import Home from "./pages/Home.tsx";
import {IRoute} from "./models/IRoute.ts";
import KeyInput from "./pages/KeyInput.tsx";
import AmplData from "./pages/AmplData.tsx"; // Importiere die AmplData Komponente

const routes: Array<IRoute> = [
  {
    path: '/',
    component: <Home/>,
    label: 'Home'
  },
  {
    path: '/import',
    component: <DataImport />,
    label: 'Data Import'
  },
  {
    path: "/keyInput",
    component: <KeyInput />,
    label: "Key Input"
  },
  {
    path: "/amplData",
    component: <AmplData />,
    label: "Ampl Data"
  }

]

export default routes;