import httpx
import pymysql.cursors
import json
import asyncio
from fastapi import Depends, WebSocket
from ..database.database import get_db
from ..schemas.Response import Response
from ..schemas.pairs_generator import PairsGeneratorBaseData
from pymysql.connections import Connection
from ..services.children_service import ChildrenService
from ..services.assistants_service import AssistantsService
from ..schemas.pairs_generator import GeneratePairsData

BASE_URL = 'http://ampl:8000'


class PairsService:

    def __init__(self, db: Connection = Depends(get_db), children_service: ChildrenService = Depends(),
                 assistants_service: AssistantsService = Depends()):
        self.db = db
        self.children_service = children_service
        self.assistants_service = assistants_service

    async def get_base_data(self):
        try:
            # get all children
            children = await self.children_service.get_all_children()

            # get all assistants
            assistants = await self.assistants_service.get_all_assistants()

            # get all pairs
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                    SELECT
                        *
                    FROM 
                        pairs
                    """
                )
                pairs = cursor.fetchall()
        except Exception as e:
            return Response(success=False, message=str(e))
        except pymysql.err.Error as e:
            return Response(success=False, message=str(e))

        result = PairsGeneratorBaseData(children=children, assistants=assistants, pairs=pairs)
        return Response(success=True, message="pairs data fetched", data=result)

    async def generate_pairs(self, websocket: WebSocket, data: GeneratePairsData):
        # preparing data for ampl
        await websocket.send_text(
            json.dumps(Response(success=True, message='Preparing children and assistants').model_dump()))
        children = data.children
        assistants = data.assistants
        await asyncio.sleep(1)

        # get distances
        await websocket.send_text(json.dumps(Response(success=True, message='Getting distances').model_dump()))
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                    SELECT 
                        id, 
                        origin_address_id,
                        destination_address_id,
                        distance,
                        travel_time
                    FROM 
                        distance_matrix
                    """
                )
                distances = cursor.fetchall()
        except Exception as e:
            return Response(success=False, message=f"WTFFFF {str(e)}")
        await asyncio.sleep(1)
        await websocket.send_text(json.dumps(Response(success=True, message='Distance gotten').model_dump()))

        # send data to ampl container
        data_for_ampl = {
            "children": [child.model_dump() for child in children],
            "assistants": [assistant.model_dump() for assistant in assistants],
            "distances": distances
        }

        try:
            async with httpx.AsyncClient() as client:
                print("Making request", flush=True)
                r = await client.post(url=f"{BASE_URL}/generate_pairs", json=data_for_ampl)
                print(r.json(), flush=True)
        except Exception as e:
            await websocket.send_text(
                json.dumps(Response(success=False, message=f"Error calling ampl: {str(e)}").model_dump()))
            return

        # send response
        return Response(success=True, message="pairs data generated", data=r.json())

    async def get_coverage(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                    SELECT 
                        COUNT(DISTINCT p.child_id) AS covered_children_absolute,
                        COUNT(DISTINCT p.child_id) / (SELECT COUNT(*) FROM children) AS covered_children_relative,
                        COUNT(DISTINCT p.assistant_id) AS covered_assistants_absolute,
                        COUNT(DISTINCT p.assistant_id) / (SELECT COUNT(*) FROM assistants) AS covered_assistants_relative,
                        (SELECT COUNT(*) FROM children) AS total_children,
                        (SELECT COUNT(*) FROM assistants) AS total_assistants,
                        (SELECT COUNT(*) FROM pairs) As pairs_count
                    FROM pairs p;
                """
            )
            return cursor.fetchone()



