from fastapi import Depends
from pymysql.connections import Connection
import pymysql.cursors
from ..database.database import get_db
from ..schemas.assistants import AssistantIn, Assistant
from ..schemas.address import Address
from ..schemas.Response import Response
from .distance_service import DistanceService


class AssistantsService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    async def create_assistant(self, assistant_in: AssistantIn, distance_service: DistanceService):
        failed = []
        for assistant in assistant_in.assistants:
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
                            (first_name, family_name, qualification, min_capacity, max_capacity,address_id) 
                            VALUES (%s, %s, %s, %s, %s, %s);
                        """,
                        (assistant.first_name, assistant.family_name, assistant.qualification,
                         assistant.min_capacity, assistant.max_capacity, address_id)
                    )
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

    async def update_assistant(self, assistant: Assistant, assistant_id: int, distance_service: DistanceService):
        assistant.street = assistant.street.replace(" ", "+")
        assistant.street_number = assistant.street_number.replace(" ", "+")
        assistant.city = assistant.city.replace(" ", "+")
        address = Address(
            street=assistant.street,
            street_number=assistant.street_number,
            city=assistant.city,
            zip_code=assistant.zip_code
        )
        coordinates_response = await distance_service.get_coordinates_from_street_name(address)
        latitude, longitude = coordinates_response
        try:
            cursor = self.db.cursor()
            cursor.execute(
                """
                    UPDATE assistants
                    SET 
                        first_name = %s, 
                        family_name = %s, 
                        qualification = %s,  
                        min_capacity = %s,
                        max_capacity = %s
                    WHERE id = %s;
                """,
                (assistant.first_name, assistant.family_name, assistant.qualification, assistant.min_capacity, assistant.max_capacity,assistant_id)
            )
            cursor.execute(
                """
                    UPDATE address
                    SET
                        street = %s,
                        street_number = %s,
                        zip_code = %s,
                        city = %s,
                        latitude = %s,
                        longitude = %s
                    WHERE
                    id = (SELECT address_id FROM assistants WHERE id = %s);
    
                """,
                (assistant.street, assistant.street_number, assistant.zip_code, assistant.city, latitude, longitude, assistant_id)
            )
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
            cursor.execute("DELETE FROM address WHERE address.id = (SELECT address_id FROM assistants WHERE assistants.id = %s);", (assistant_id))
            cursor.execute("DELETE FROM assistants WHERE id = %s;", (assistant_id))
            self.db.commit()
            return cursor.rowcount
