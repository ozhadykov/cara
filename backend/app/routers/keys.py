from fastapi import APIRouter
import os
from pydantic import BaseModel

class GoogleApiData(BaseModel):
    googleApiKey: str

class AmplData(BaseModel):
    amplKey: str


router = APIRouter(
    prefix="/keys",
    tags=["ampl"],
    dependencies=[],
    responses={404: {"description": "nothing found in ampl service"}},
)

@router.post("/googleApiKey")
async def receive_keys(data: GoogleApiData):
    # Zugriff auf die Felder über data.apikey und data.ampl
    with open ("/backend/app/keys/googleApiKey.txt", "w") as f:
        f.write (data.googleApiKey)
    
    return {"message": "Daten empfangen", "received": data}

@router.post("/amplKey")
async def receive_keys(data: AmplData):
    # Zugriff auf die Felder über data.apikey und data.ampl
    with open ("/backend/app/keys/amplKey.txt", "w") as f:
        f.write (data.amplKey)
    
    return {"message": "Daten empfangen", "received": data}

@router.get("/getGoogleApiKey")
async def receive_file():
    if not os.path.exists("/backend/app/keys/googleApiKey.txt"):
        return {"data": ""}
    with open ("/backend/app/keys/googleApiKey.txt", "r") as f:
        googleApiKey = f.read()
        return {"data": googleApiKey}
    
@router.get("/getAmplKey")
async def receive_file():
    if not os.path.exists("/backend/app/keys/amplKey.txt"):
        return {"data": ""}
    with open ("/backend/app/keys/amplKey.txt", "r") as f:
        amplKey = f.read()
        return {"data": amplKey}