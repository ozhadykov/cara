import {Home} from "./pages";
import {DataImport} from "./pages";
import {IRoute} from "./models/IRoute.ts";
import KeyInput from "./pages/KeyInput.tsx";


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
    path: "/ampl-data", // Wähle einen passenden Pfad
    component: AmplData, // Füge die neue Komponente hinzu
    label: "Ampl Data", // Füge ein Label hinzu
  },
]

export default routes;