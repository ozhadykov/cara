import os
import shutil
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

from .routes import ampl, children, keys, assistants, pairs_generator

# creating App
app = FastAPI()

origins = [
    "http://localhost:80",  # Production Frontend
    "http://localhost:5173",
    "http://localhost:5174",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# registering routers
app.include_router(ampl.router)
app.include_router(children.router)
app.include_router(assistants.router)
app.include_router(keys.router)
app.include_router(pairs_generator.router)

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
