import { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [data, setData] = useState<any>('');

  async function getHelloWorld() {
    const response = await fetch('http://localhost:8080');
    const json = await response.json();
    setData(json.data);
  }

  useEffect(() => {
    getHelloWorld();
  });

  return (
    <>
      <h1>{data}</h1>
    </>
  );
}

export default App;
