import {useEffect, useState} from 'react';



const KeyInput = () => {
    //    async function handleRequest() {
    //        await fetch("/api/keys")
    //    }
    const [apikey, setApiKey] = useState ('');
    const [ampl, setAmpl] = useState ('');

    const handleChangeApiKey = (event: any) => {

        setApiKey(event.target.value);
    }
    const handleChangeAmpl = (event: any) => {
        
        setAmpl(event.target.value);
    };

    const handleSubmitApiKey = async () => {
        try {
          const response = await fetch('/api/googleKey', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              apikey: apikey,
            }),
          });
    
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
    
          const result = await response.json();
          console.log('Erfolgreich gesendet:', result);
        } catch (error) {
          console.error('Fehler beim Senden:', error);
        }
      };

      const handleSubmitAmpl = async () => {
        try {
          const response = await fetch('/api/amplKey', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              ampl: ampl,
            }),
          });
    
          if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
          }
    
          const result = await response.json();
          console.log('Erfolgreich gesendet:', result);
        } catch (error) {
          console.error('Fehler beim Senden:', error);
        }
      };
    
      useEffect(() => {
        // dev only
        const getGoogleKeyData = async () => {
          const response = await fetch('/api/getGoogleKey')
          const data = await response.json()
          if (response.ok) {
            setApiKey(data.data)
          }
        }
        const getAmplKeyData = async () => {
          const response = await fetch('/api/getAmplKey')
          const data = await response.json()
          if (response.ok) {
            setAmpl(data.data)
          }
        }
    
    
        getGoogleKeyData()
        getAmplKeyData()
      }, [])

  return (
    <div className="home-content flex flex-col gap-3 items-center justify-center w-full h-full">
      <div className="flex flex-row items-center gap-2">
        <label className="w-32">Google API Key</label>
        <input
          className="border border-gray-300 rounded px-3 py-2 w-64"
          type="text"
          value={apikey}
          onChange={handleChangeApiKey}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick = {handleSubmitApiKey}>
          Send
        </button>
      </div>

      <div className="flex flex-row items-center gap-2">
        <label className="w-32">AMPL Key</label>
        <input
          className="border border-gray-300 rounded px-3 py-2 w-64"
          type="text"
          value={ampl}
          onChange={handleChangeAmpl}
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition" onClick = {handleSubmitAmpl}>
          Send
        </button>
      </div>

    </div>
  )
}

export default KeyInput