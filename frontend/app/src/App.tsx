import './App.css';
import {Navbar, Sidebar, Footer} from './components';
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
      <main className="content px-4 pt-25 h-full">
        <Routes>
          {routesHTML}
        </Routes>
      </main>
      <Footer/>
    </>
  );
}

export default App;
