from typing import TYPE_CHECKING
from fastapi import Depends
from pymysql.connections import Connection
import pymysql.cursors

from ..database.database import get_db
from ..schemas.assistants import AssistantIn, Assistant
from ..schemas.address import Address
from ..schemas.Response import Response
if TYPE_CHECKING:
    from .children_service import ChildrenService
    from .distance_service import DistanceService


class AssistantsService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    async def create_assistant(
            self,
            assistant_in: AssistantIn,
            distance_service: "DistanceService",
            children_service: "ChildrenService"
    ):
        failed = []
        for assistant in assistant_in.data:
            address = Address(
                street=assistant.street,
                street_number=assistant.street_number,
                city=assistant.city,
                zip_code=assistant.zip_code
            )
            address_response = await distance_service.insert_address(address)
            if not address_response.success:
                return address_response

            address_id = address_response.data
            try:
                with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                    cursor.execute(
                        """
                            INSERT INTO assistants 
                            (first_name, family_name, qualification, min_capacity, max_capacity,address_id, has_car) 
                            VALUES (%s, %s, %s, %s, %s, %s, %s);
                        """,
                        (assistant.first_name, assistant.family_name, assistant.qualification,
                         assistant.min_capacity, assistant.max_capacity, address_id, assistant.has_car)
                    )

                    children = await children_service.get_children_for_distance_matrix()

                    response = await distance_service.create_distances_for_assistant(assistant, address_id, children)
                    if not response.success:
                        raise Exception('Something went wrong with distance matrix api logic')
                    self.db.commit()
            except pymysql.err.Error as e:
                print(f"Database error during assistant insertion: {e}")
                failed.append(assistant)
                self.db.rollback()
            except Exception as e:
                print(f"An unexpected error occurred during assistant insertion: {e}")
                failed.append(assistant)
                self.db.rollback()

        if len(failed) > 0:
            return Response(success=False, message=f"{len(failed)} assistant failed to insert in Database")
        return Response(success=True, message="All assistant successfully inserted")

    async def update_assistant(
            self,
            assistant: Assistant,
            assistant_id: int,
            distance_service: "DistanceService",
            children_service: "ChildrenService"
    ):
        address = Address(
            street=assistant.street,
            street_number=assistant.street_number,
            city=assistant.city,
            zip_code=assistant.zip_code
        )
        try:
            response = await distance_service.insert_address(address)
            address_id = response.data

            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                        UPDATE assistants
                        SET 
                            first_name = %s, 
                            family_name = %s, 
                            qualification = %s,
                            has_car = %s,  
                            min_capacity = %s,
                            max_capacity = %s,
                            address_id = %s
                        WHERE id = %s;
                    """,
                    (assistant.first_name, assistant.family_name, assistant.qualification, assistant.has_car,
                     assistant.min_capacity, assistant.max_capacity, address_id, assistant_id)
                )

            # refreshing the matrix
            response = await distance_service.refresh_distance_matrix(children_service, self)

            self.db.commit()
            return Response(success=True, message=f"assistant with ID: {cursor.lastrowid} is successfully updated")
        except pymysql.err.Error as e:
            print(f"Database error during assistant insertion: {e}")
            return

    async def get_all_assistants(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                    SELECT
                        a.id AS id,
                        a.first_name AS first_name,
                        a.family_name AS family_name,
                        a.qualification AS qualification,
                        q.qualification_text AS qualification_text,
                        a.has_car AS has_car,
                        a.min_capacity AS min_capacity,
                        a.max_capacity AS max_capacity,
                        REPLACE(adr.street, '+', ' ') AS street,
                        REPLACE(adr.street_number, '+', ' ') AS street_number,
                        REPLACE(adr.city, '+', ' ') AS city,
                        adr.zip_code AS zip_code,
                        adr.id AS address_id,
                        adr.latitude AS latitude,
                        adr.longitude AS longitude
                    FROM 
                        assistants a
                        JOIN address adr ON adr.id = a.address_id
                        JOIN qualifications q ON q.id = a.qualification
                    ORDER BY a.id;
                """
            )
            return cursor.fetchall()

    async def get_assistant(self, assistant_id: int):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                    SELECT
                        a.id AS id,
                        a.first_name AS first_name,
                        a.family_name AS family_name,
                        q.qualification_text AS qualification,
                        a.min_capacity AS min_capacity,
                        a.max_capacity AS max_capacity,
                        REPLACE(adr.street, '+', ' ') AS street,
                        REPLACE(adr.street_number, '+', ' ') AS street_number,
                        REPLACE(adr.city, '+', ' ') AS city,
                        adr.zip_code AS zip_code
                    FROM 
                        assistants a
                        JOIN address adr ON adr.id = a.address_id
                        JOIN qualifications q ON q.id = a.qualification
                    WHERE a.id = %s
                """, (assistant_id)
            )
            return cursor.fetchall()

    async def delete_assistant(self, assistant_id: int):
        with self.db.cursor() as cursor:
            cursor.execute(
                "DELETE FROM address WHERE address.id = (SELECT address_id FROM assistants WHERE assistants.id = %s);",
                (assistant_id))
            cursor.execute("DELETE FROM assistants WHERE id = %s;", (assistant_id))
            self.db.commit()
            return cursor.rowcount
