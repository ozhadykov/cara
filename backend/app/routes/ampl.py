import httpx
from fastapi import APIRouter


router = APIRouter(
    prefix="/api/ampl",
    tags=["ampl"],
    dependencies=[],
    responses={404: {"description": "nothing found in ampl service"}},
)

BASE_URL = 'http://ampl:8000/ampl'


@router.get('/dev')
async def ampl_dev():
    data = {"message": "something went wrong"}
    try:
        r = httpx.get(BASE_URL)
        if r.status_code == httpx.codes.OK:
            data = r.json()
    except:
        data = {"message": "something went wrong"}
    return data
