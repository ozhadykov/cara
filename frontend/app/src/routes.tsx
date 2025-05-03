import {Home} from "./pages";
import {DataImport} from "./pages";
import {IRoute} from "./models/IRoute.ts";


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
  }
]

export default routes;