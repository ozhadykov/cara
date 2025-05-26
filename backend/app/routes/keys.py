from fastapi import APIRouter, Depends
from ..services.keys_service import KeysService
from ..schemas.api_key import ApiKey

router = APIRouter(
    prefix="/api/keys",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in children service"}},
)


@router.post("/{id}")
async def update_api_key(data: ApiKey, id: str, keys_service: KeysService = Depends()):
    result = await keys_service.update_api_key(data, id)
    return result


@router.get("/{id}")
async def get_api_key(id:str, key_service: KeysService = Depends()):
    result = await key_service.get_api_key(id)
    return result