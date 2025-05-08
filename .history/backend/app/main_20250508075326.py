import os
import shutil
from typing import Union
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
from .routers import ampl

from pydantic import BaseModel

# creating App
app = FastAPI()

# registering routers
app.include_router(ampl.router)

origins = [
    "http://localhost:80",  # Production Frontend
    "http://localhost:5173",  # Local Developement Frontend
    "http://localhost"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class GoogleApiData(BaseModel):
    apikey: str

class AmplData(BaseModel):
    ampl: str

@app.get("/api")
def read_root():
    return {"data": "Hello World"}


# Create uploads directory if it doesn't exist
UPLOAD_DIR = Path("/backend/app/uploads")
UPLOAD_DIR.mkdir(exist_ok=True)

@app.post("/api/upload")
async def upload_file(file: UploadFile = File(...)):
    # Save the uploaded file
    file_location = UPLOAD_DIR / file.filename

    try:
        with open(file_location, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Process the file as needed
        file_size = os.path.getsize(file_location)

        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "content_type": file.content_type,
            "size": file_size
        }
    except Exception as e:
        return {"message": f"Error uploading file: {str(e)}"}
    finally:
        file.file.close()

@app.post("/api/googleKey")
async def receive_keys(data: GoogleApiData):
    # Zugriff auf die Felder über data.apikey und data.ampl
    with open ("/backend/app/keys/googleApiKey.txt", "w") as f:
        f.write (data.apikey)
    
    return {"message": "Daten empfangen", "received": data}

@app.post("/api/amplKey")
async def receive_keys(data: AmplData):
    # Zugriff auf die Felder über data.apikey und data.ampl
    with open ("/backend/app/keys/amplKey.txt", "w") as f:
        f.write (data.ampl)
    
    return {"message": "Daten empfangen", "received": data}

@app.get("/api/getGoogleKey")
async def receive_file():
    if not os.path.exists("/backend/app/keys/googleApiKey.txt"):
        return {"data": ""}
    with open ("/backend/app/keys/googleApiKey.txt", "r") as f:
        googleKey = f.read()
        return {"data": googleKey}
    
@app.get("/api/getAmplKey")
async def receive_file():
    if not os.path.exists("/backend/app/keys/amplKey.txt"):
        return {"data": ""}
    with open ("/backend/app/keys/amplKey.txt", "r") as f:
        amplKey = f.read()
        return {"data": amplKey}

AMPL_SERVICE_BASE_URL = 'http://ampl:8000/ampl' # Oder 'http://ampl:8000', je nach tatsächlichem Endpunkt des ampl-Service

@app.get("/api/get-ampl-data-in-backend")
async def get_ampl_data_from_service():
    logger.debug("get_ampl_data_from_service wurde aufgerufen!")
    ampl_data = None
    error_message = None

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(AMPL_SERVICE_BASE_URL)
        response.raise_for_status()
        ampl_data = response.json()

    except httpx.RequestError as exc:
        logger.error(f"An error occurred while requesting {exc.request.url!r}: {exc}")
        error_message = f"Failed to connect to ampl service: {exc}"
    except httpx.HTTPStatusError as exc:
        logger.error(f"Error response {exc.response.status_code} while requesting {exc.request.url!r}")
        error_message = f"Error from ampl service: Status {exc.response.status_code}"
    except Exception as e:
        logger.exception(f"An unexpected error occurred: {e}")
        error_message = f"An unexpected error occurred: {e}"

    if ampl_data is not None:
        return {
            "message": "Data retrieved successfully from ampl service",
            "data": ampl_data # Hier sind die Daten vom ampl-Service
        }
    else:
         return {
            "message": "Could not retrieve data from ampl service",
            "error": error_message,
            "data": None # Oder eine leere Datenstruktur, z.B. {}
        }