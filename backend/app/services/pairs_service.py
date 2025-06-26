import httpx
import pymysql.cursors
import json
import asyncio
from fastapi import Depends, WebSocket
from ..database.database import get_db
from ..schemas.Response import Response
from ..schemas.pairs_generator import PairsGeneratorBaseData, CreateSinglePairIn
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

    async def create_pair(self, data: CreateSinglePairIn):
        # todo: Check if pair possible, create and save pair in db
        return Response(success=True, message="This is mock!!!!!")

    async def _create_pair_from_ids(self, child_id: int, assistant_id: int):
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                        INSERT INTO pairs (child_id, assistant_id)
                        VALUES (%s, %s)
                    """,
                    (child_id, assistant_id)
                )
                pair_id = cursor.lastrowid
                if pair_id:
                    self.db.commit()
                    return Response(success=True, message="pair created", data=pair_id)
        except pymysql.err.Error as e:
            print(f"Database error during pair insertion: {e}")
            self.db.rollback()
            return Response(success=False, message=str(e))
        except Exception as e:
            print(f"Database error during pair insertion: {e}")
            self.db.rollback()
            return Response(success=False, message=f"Unexpected error during pair insertion {str(e)}")

    async def generate_pairs(self, websocket: WebSocket, data: GeneratePairsData):
        # preparing data for ampl
        await websocket.send_text(
            json.dumps(Response(success=True, message='Preparing children and assistants').model_dump()))
        await asyncio.sleep(2)

        children = data.children
        assistants = data.assistants

        # get distances
        await websocket.send_text(json.dumps(Response(success=True, message='Getting distances').model_dump()))
        await asyncio.sleep(2)
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                    SELECT 
                        id, 
                        origin_address_id,
                        destination_address_id,
                        transport_type,
                        distance,
                        travel_time
                    FROM 
                        distance_matrix
                    """
                )
                distances = cursor.fetchall()
        except Exception as e:
            return Response(success=False, message=f"WTFFFF {str(e)}")

        await websocket.send_text(json.dumps(Response(success=True, message='Distances retrieved').model_dump()))
        await asyncio.sleep(2)

        # send data to ampl container
        data_for_ampl = {
            "children": [child.model_dump() for child in children],
            "assistants": [assistant.model_dump() for assistant in assistants],
            "distances": distances
        }

        await websocket.send_text(json.dumps(Response(success=True, message='Generating pairs').model_dump()))
        await asyncio.sleep(2)
        try:
            async with httpx.AsyncClient() as client:
                print("Making request", flush=True)
                r = await client.post(url=f"{BASE_URL}/generate_pairs", json=data_for_ampl)
                print(r.json(), flush=True)
                response = r.json()
                if response.get('status') == 'success':
                    # save this in DB
                    pairs = response.get('assignments')
                    failed_pairs = []
                    for pair in pairs:
                        child_id = pair['child_id']
                        assistant_id = pair['assistant_id']
                        response = await self._create_pair_from_ids(child_id, assistant_id)
                        if not response.success:
                            failed_pairs.append(pair)

                    # send response to front end
                    if len(failed_pairs) > 0:
                        await websocket.send_text(
                            json.dumps(
                                Response(success=False, message=f"Some pairs could not be created: {len(failed_pairs)}",
                                         failed_pairs=failed_pairs).model_dump()))
                        return

                    await websocket.send_text(
                        json.dumps(Response(success=True, message='Pairs successfully created', data=pairs).model_dump()))
                    return

                await websocket.send_text(
                    json.dumps(Response(success=False, message='AMPL returned error', data=r.json).model_dump()))
        except Exception as e:
            await websocket.send_text(
                json.dumps(Response(success=False, message=f"Error calling ampl: {str(e)}").model_dump()))
            return

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
