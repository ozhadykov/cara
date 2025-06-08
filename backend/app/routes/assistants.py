from fastapi import APIRouter, Depends
from ..services.assistants_service import AssistantsService
from ..services.distance_service import DistanceService
from ..schemas.assistants import AssistantIn, Assistant

router = APIRouter(
    prefix="/api/assistants",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in assistant service"}},
)


@router.get("/")
async def get_all_assistants(assistant_service: AssistantsService = Depends()):
    result = await assistant_service.get_all_assistants()
    return result


@router.get("/{assistant_id}")
async def get_assistant(assistant_id: int, assistant_service: AssistantsService = Depends()):
    result = await assistant_service.get_assistant(assistant_id)
    return result


@router.post("/")
async def create_assistants(assistants: AssistantIn, assistant_service: AssistantsService = Depends(),
                            distance_service: DistanceService = Depends()):
    result = await assistant_service.create_assistant(assistants, distance_service)
    return result


@router.post("/{assistant_id}")
async def update_assistant(assistant: Assistant, assistant_id: int, assistant_service: AssistantsService = Depends(),
                           distance_service: DistanceService = Depends()):
    result = await assistant_service.update_assistant(assistant, assistant_id, distance_service)
    return result


@router.delete("/{assistant_id}")
async def delete_assistant(assistant_id: int, assistant_service: AssistantsService = Depends()):
    result = await assistant_service.delete_assistant(assistant_id)
    return result
