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
from ..schemas.pairs_generator import Pair

from fastapi.responses import StreamingResponse
import io
import pandas as pd

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

    async def get_all_pairs(self):
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                    SELECT
                        p.id AS id,
                        c.id AS c_id,
                        c.first_name AS c_first_name,
                        c.family_name AS c_family_name,
                        c.requested_hours AS c_requested_hours,
                        cq.id AS c_required_qualification,
                        cq.qualification_text AS c_required_qualification_text,
                    
                        ca.street AS c_street,
                        ca.street_number AS c_street_number,
                        ca.city AS c_city,
                        ca.zip_code AS c_zip_code,
                        a.id AS a_id,
                        a.first_name AS a_first_name,
                        a.family_name AS a_family_name,
                        aq.id AS a_qualification,
                        aq.qualification_text AS a_qualification_text,
                        a.has_car AS a_has_car,
                        a.min_capacity AS a_min_capacity,
                        a.max_capacity AS a_max_capacity,
                        aa.street AS a_street,
                        aa.street_number AS a_street_number,
                        aa.city AS a_city,
                        aa.zip_code AS a_zip_code
                    FROM 
                        pairs p
                        JOIN children c ON c.id = p.child_id
                        JOIN assistants a ON a.id = p.assistant_id
                        JOIN address ca ON ca.id = c.address_id
                        JOIN address aa ON aa.id = a.address_id    
                        JOIN qualifications cq ON cq.id = c.required_qualification
                        JOIN qualifications aq ON aq.id = a.qualification
                    """
                )
                pairs = cursor.fetchall()

                return Response(success=True, message="pairs data fetched", data=pairs)
        except Exception as e:
            return Response(success=False, message=str(e))
        except pymysql.err.Error as e:
            return Response(success=False, message=str(e))

    async def delete_pair(self, pair_id: int):
        with self.db.cursor() as cursor:
            cursor.execute(
                "DELETE FROM pairs WHERE id = %s;",
                (pair_id))
            self.db.commit()
            return cursor.rowcount

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

    async def create_pair(self, data: CreateSinglePairIn):
        child_id = data.child.id
        assistant_id = data.child.id

        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                    SELECT
                        CASE
                            WHEN (
                                COALESCE((
                                    SELECT SUM(c.required_hours)
                                    FROM pairs p
                                    JOIN children c ON c.id = p.child_id
                                    WHERE p.assistant_id = %s
                                ), 0) + (
                                    SELECT c.required_hours
                                    FROM children c
                                    WHERE c.id = %s
                                )
                            ) > (
                                SELECT a.max_capacity
                                FROM assistants a
                                WHERE a.id = %s
                            )
                            THEN TRUE
                            ELSE FALSE
                        END AS full_capacity,

                        CASE
                            WHEN EXISTS (
                                SELECT 1
                                FROM pairs
                                WHERE child_id = %s
                            )
                            THEN TRUE
                            ELSE FALSE
                        END AS already_assigned
                    """, 
                    (assistant_id, child_id, assistant_id, child_id)
                )

                result = cursor.fetchone()

                if result["already_assigned"]:
                    return Response(success=False, message=f"This child is already paired with an assistant. To proceed with a new pairing, please manually remove the existing assignment.")

                if result["full_capacity"]:
                    return Response(success=False, message=f"This assistant has reached the maximum number of assignments. Please remove an existing assignment with this assistant before creating a new pairing.")

                await self._create_pair_from_ids(child_id, assistant_id)

                return Response(success=True, message=f"Pair has been created")
        except Exception as e:
            return Response(success=False, message=f"Error {str(e)}")

    async def _delete_pairs_from_ids(self, child_id: int):
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                        DELETE FROM pairs
                        WHERE
                            child_id = %s
                    """,
                    (child_id)
                )
                row_count = cursor.rowcount
                if row_count:
                    self.db.commit()
                    return Response(success=True, message="pair deleted", data=row_count)
        except pymysql.err.Error as e:
            print(f"Database error during pair deletion: {e}")
            self.db.rollback()
            return Response(success=False, message=str(e))
        except Exception as e:
            print(f"Database error during pair deletion: {e}")
            self.db.rollback()
            return Response(success=False, message=f"Unexpected error during pair deletion {str(e)}")

    async def generate_pairs(self, websocket: WebSocket, data: GeneratePairsData):
        # preparing data for ampl
        await websocket.send_text(
            json.dumps(Response(success=True, message='Preparing children and assistants').model_dump()))
        await asyncio.sleep(2)

        children = data.children
        assistants = data.assistants
        model_params = data.modelParams

        # clean the pairs table, from chosen children and assistants
        await websocket.send_text(
            json.dumps(Response(success=True, message='Preparing database').model_dump()))
        await asyncio.sleep(2)

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
            "distances": distances,
            "model_params": model_params
        }

        await websocket.send_text(json.dumps(Response(success=True, message='Generating pairs').model_dump()))
        await asyncio.sleep(2)
        try:
            async with httpx.AsyncClient() as client:
                print("Making request", flush=True)
                # omar's model
                #r = await client.post(url=f"{BASE_URL}/generate_pairs", json=data_for_ampl)
                # alex's model
                r = await client.post(url=f"{BASE_URL}/generate_pairs_2", json=data_for_ampl)
                print(r.json(), flush=True)
                response = r.json()
                if response.get('status') == 'success':
                    pairs = response.get('assignments')
                    
                    # delete selected pairs from pairs table
                    for pair in pairs:
                        child_id = pair['child_id']
                        assistant_id = pair['assistant_id']
                        await self._delete_pairs_from_ids(child_id)

                    # save this in DB
                    
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
                                         data=failed_pairs, status="done").model_dump()))
                        await asyncio.sleep(2)
                        return

                    await websocket.send_text(
                        json.dumps(Response(success=True, message='Pairs successfully created', data=pairs, status="done").model_dump()))
                    await asyncio.sleep(2)
                    return

                await websocket.send_text(
                    json.dumps(Response(success=False, message='AMPL returned error', data=r.json, status="done").model_dump()))
                await asyncio.sleep(2)

        except Exception as e:
            await websocket.send_text(
                json.dumps(Response(success=False, message=f"Error calling ampl: {str(e)}", status="done").model_dump()))
            await asyncio.sleep(2)
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
                        (SELECT SUM(c.requested_hours) 
                        FROM children c 
                        WHERE c.id IN (SELECT DISTINCT child_id FROM pairs)
                        ) AS total_hours,
                        (SELECT COUNT(*) FROM children) AS total_children,
                        (SELECT COUNT(*) FROM assistants) AS total_assistants,
                        (SELECT COUNT(*) FROM pairs) As pairs_count
                    FROM pairs p;
                """
            )
            return cursor.fetchone()

    async def get_capacity(self, data: Pair):
        assistant_id = data.assistant_id
        child_id = data.child_id

        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                WITH assistant_data AS (
                    SELECT 
                        a.id AS assistant_id,
                        a.max_capacity,
                        COALESCE(SUM(c.requested_hours), 0) AS used_hours,
                        a.qualification
                    FROM 
                        assistants a
                        LEFT JOIN pairs p ON a.id = p.assistant_id
                        LEFT JOIN children c ON c.id = p.child_id
                    WHERE 
                        a.id = %s
                    GROUP BY 
                        a.id, a.max_capacity, a.qualification
                )
                SELECT 
                    ad.used_hours,
                    (ad.max_capacity - ad.used_hours) AS free_hours,
                    CASE
                        WHEN (
                            (SELECT q.qualification_value FROM qualifications q WHERE q.id = (SELECT c.required_qualification FROM children c WHERE c.id = %s))
                            <= (SELECT q.qualification_value FROM qualifications q WHERE q.id = ad.qualification)
                        )
                        THEN TRUE
                        ELSE FALSE
                    END AS is_qualified
                FROM 
                    assistant_data ad;
                """, (assistant_id, child_id)
            )
            return cursor.fetchone()
        
    async def export_pairs(self):
        try:
            pairs = await self.get_all_pairs()

            if not pairs.data or len(pairs.data) == 0:
                headers = [
                    "id","c_id","c_first_name",
                    "c_family_name","c_requested_hours",
                    "c_required_qualification","c_required_qualification_text","c_street",
                    "c_street_number","c_city","c_zip_code",
                    "a_id","a_first_name","a_family_name",
                    "a_qualification","a_qualification_text","a_has_car",
                    "a_min_capacity","a_max_capacity","a_street",
                    "a_street_number","a_city","a_zip_code"
                ]
                csv_content = ','.join(headers)
            else:
                df = pd.DataFrame(pairs.data)
            
                csv_content = df.to_csv(index=False, encoding='utf-8')

            buffer = io.BytesIO(csv_content.encode("utf-8"))

            return StreamingResponse(
                buffer,
                media_type="text/csv",
                headers={"Content-Disposition": "attachment; filename=assistans.csv"}
            )

        except Exception as e:
            return {"error": f"Ein Fehler beim CSV-Export ist aufgetreten: {e}"}
