import './App.css';
import { Route, Routes } from 'react-router';
import { Navbar, Sidebar } from './components';
import { Home, DevAMPL } from './pages';

function App() {

  return (
    <>
      <Navbar/>
      <Sidebar/>
      <main>
        <Routes>
          <Route path='/' element={<Home/>}></Route>
          <Route path='/dev' element={<DevAMPL/>}></Route>
        </Routes>
      </main>
    </>
  );
}

export default App;
