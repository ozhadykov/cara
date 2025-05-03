import {ChangeEvent, FormEvent, useState, useEffect} from 'react';

interface IDataModel {
  data: string
}

const Home = () => {
  const [file, setFile] = useState<File>();
  const [message, setMessage] = useState('');
  const [data, setData] = useState<IDataModel>({data: 'no message'});

  useEffect(() => {
    // dev only
    const testRequest = async () => {
      const response = await fetch('/api')
      const data = await response.json()
      if (response.ok) setData(data)
    }


    testRequest()
  }, [])

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files === null) return;
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!file) {
      setMessage('Please select a file first');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        // No need to set Content-Type header - browser will set it with boundary
      });

      const data = await response.json();
      setMessage(data.message || 'File uploaded successfully');
    } catch (error) {
      console.error('Error uploading file:', error);
      setMessage('Error uploading file');
    }
  };

  return (
    <div className="home-content flex flex-col gap-3 items-center justify-center w-full h-full">
      <h1>{data.data}</h1>
      <h2>Upload File</h2>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange}/>
        <button type="submit" className='btn btn-xl btn-primary'>Upload</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default Home