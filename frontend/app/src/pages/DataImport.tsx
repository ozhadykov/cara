const DataImport = () => {

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  }
  const handleFileChange = (e: React.FormEvent<HTMLFormElement>) => {
  }

  return (
    <div className="data-import flex flex-col gap-3 w-full h-full">
      <form onSubmit={handleSubmit}>
        <div className="children-import-form flex flex-col gap-1">
          <span className="text-lg font-bold">Children import</span>
          <span>
            please upload a CSV file, for an import.
          </span>
          <input type="file" onChange={handleFileChange}/>
        </div>
        <div className="assistent-import-form flex flex-col gap-1">
          <span className="text-lg font-bold">Assistant import</span>
          <span>
            please upload a CSV file, for an import.
            </span>
          <input type="file" onChange={handleFileChange}/>
        </div>
        <button type="submit" className='btn btn-xl btn-primary'>Upload</button>
      </form>
    </div>
  )
}

export default DataImport