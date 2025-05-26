from fastapi import APIRouter, Depends
from ..services.children_service import ChildrenService

router = APIRouter(
    prefix="/api/children2",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in children service"}},
)

@router.get("/")
def get_all_children(children_service: ChildrenService = Depends()):
    result = children_service.get_all_children()
    return result

@router.get("/{child_id}")
def get_child(child_id: int, children_service: ChildrenService = Depends()):
    result = children_service.get_child(child_id)
    return result

@router.post("/")
def create_children(children):
    return "create_children"

@router.post("/{child_id}")
def update_child(children):
    return "update_child"