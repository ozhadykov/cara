from fastapi import APIRouter


router = APIRouter(
    prefix="/ampl",
    tags=["ampl"],
    dependencies=[],
    responses={404: {"description": "nothing found in ampl service"}},
)


@router.get('/dev')
async def ampl_dev():
    
    return {"data": "Returning something from ampl router"}
