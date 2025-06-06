from fastapi import APIRouter, Depends
from ..services.pairs_service import PairsService

router = APIRouter(
    prefix="/api/pair_generator",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in pairs service"}},
)


@router.get("/")
async def get_base_data(pairs_service: PairsService = Depends()):
    result = await pairs_service.get_base_data()
    return result