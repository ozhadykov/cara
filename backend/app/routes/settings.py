import asyncio
from fastapi import APIRouter, Depends
from ..services.settings_service import SettingsService
from ..schemas.api_key import ApiKey, WeightsIn

router = APIRouter(
    prefix="/api/settings",
    tags=["settings"],
    dependencies=[],
    responses={404: {"description": "nothing found in key service"}},
)


@router.post("/key/{id}")
async def update_api_key(data: ApiKey, id: str, settings_service: SettingsService = Depends()):
    result = await settings_service.update_api_key(data, id)
    await asyncio.sleep(1)
    return result


@router.get("/key/{id}")
async def get_api_key(id:str, key_service: SettingsService = Depends()):
    result = await key_service.get_api_key(id)
    return result


@router.get("/weights")
async def get_lp_weights(settings_service: SettingsService = Depends()):
    result = await settings_service.get_lp_weights()
    await asyncio.sleep(1)
    return result

@router.post("/weights")
async def save_lp_weights(weights: WeightsIn, settings_service: SettingsService = Depends()):
    result = await settings_service.save_lp_weights(weights)
    await asyncio.sleep(1)
    return result