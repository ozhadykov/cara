from fastapi import APIRouter, Depends
from ..services.children_service import ChildrenService
from ..services.distance_service import DistanceService
from ..schemas.children import ChildrenIn, Child

router = APIRouter(
    prefix="/api/children",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in children service"}},
)


@router.get("/")
async def get_all_children(children_service: ChildrenService = Depends()):
    result = await children_service.get_all_children()
    return result


@router.get("/{child_id}")
async def get_child(child_id: int, children_service: ChildrenService = Depends()):
    result = await children_service.get_child(child_id)
    return result


@router.post("/")
async def create_children(children: ChildrenIn, children_service: ChildrenService = Depends(),
                          distance_service: DistanceService = Depends()):
    result = await children_service.create_children(children, distance_service)
    return result


@router.post("/{child_id}")
async def update_child(child: Child, child_id: int, child_service: ChildrenService = Depends(),
                       distance_service: DistanceService = Depends()):
    result = await child_service.update_child(child, child_id, distance_service)
    return result


@router.delete("/{child_id}")
async def delete_child(child_id: int, children_service: ChildrenService = Depends()):
    result = await children_service.delete_child(child_id)
    return result
