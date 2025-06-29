import json
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect, WebSocketException
from ..services.pairs_service import PairsService
from ..schemas.pairs_generator import GeneratePairsData, CreateSinglePairIn, Pair

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


@router.get("/coverage")
async def get_base_data(pairs_service: PairsService = Depends()):
    result = await pairs_service.get_coverage()
    return result


@router.post("/single_pair")
async def create_pair(data: CreateSinglePairIn, pairs_service: PairsService = Depends()):
    result = await pairs_service.create_pair(data)
    return result

@router.post("/capacity")
async def create_pair(data: Pair, pairs_service: PairsService = Depends()):
    result = await pairs_service.get_capacity(data)
    return result

@router.websocket("/ws/generate_pairs")
async def websocket_generate_pairs(websocket: WebSocket, pairs_service: PairsService = Depends()):
    await websocket.accept()
    try:
        message = await websocket.receive_text()
        request_data_dict = json.loads(message)
        request_data = GeneratePairsData(**request_data_dict)

        await pairs_service.generate_pairs(websocket, request_data)
    except WebSocketDisconnect:
        print("WebSocket disconnected")
    except WebSocketException as e:
        print("WebSocket exception")
    except Exception as e:
        print(f"WebSocket error: {e}")
        # Send error message back to client if possible
        try:
            await websocket.send_text(json.dumps({"error": str(e), "message": "An error occurred during processing."}))
        except RuntimeError:  # If connection already closed
            pass
    finally:
        # closing connection
        await websocket.close()