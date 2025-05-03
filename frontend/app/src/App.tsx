import './App.css';
import {Navbar, Sidebar} from './components';
import {Routes, Route} from "react-router";
import routes from "./routes.tsx";
import {ReactNode} from "react";

function App() {

  const routesHTML: Array<ReactNode> = routes.map(route => {
    return (
      <Route key={route.path} path={route.path} element={route.component}></Route>
    )
  })

  return (
    <>
      <Navbar/>
      <Sidebar/>
      <main className="content px-4">
        <Routes>
          {routesHTML}
        </Routes>
      </main>
    </>
  );
}

export default App;
