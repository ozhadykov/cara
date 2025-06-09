from fastapi import Depends
from pymysql.connections import Connection
import pymysql.cursors
from ..database.database import get_db
from ..schemas.children import ChildrenIn, Child
from ..schemas.address import Address
from ..schemas.Response import Response
from ..services.distance_service import DistanceService


class ChildrenService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    async def create_children(self, children_in: ChildrenIn, distance_service: DistanceService):
        failed = []
        for child in children_in.data:
            address = Address(
                street=child.street,
                street_number=child.street_number,
                city=child.city,
                zip_code=child.zip_code
            )
            address_response = await distance_service.insert_address(address)
            if not address_response.success:
                return address_response

            address_id = address_response.data
            try:
                with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                    cursor.execute(
                        """
                            INSERT INTO children 
                            (first_name, family_name, required_qualification, requested_hours, address_id) 
                            VALUES (%s, %s, %s, %s, %s)
                        """,
                        (child.first_name, child.family_name, child.required_qualification,
                         child.requested_hours, address_id)
                    )
                    self.db.commit()
            except pymysql.err.Error as e:
                print(f"Database error during child insertion: {e}")
                failed.append(child)
                self.db.rollback()
            except Exception as e:
                print(f"An unexpected error occurred during child insertion: {e}")
                failed.append(child)
                self.db.rollback()
        if len(failed) > 0:
            return Response(success=False, message=f"{len(failed)} children failed to insert in Database")
        return Response(success=True, message="All children successfully inserted")

    async def update_child(self, child: Child, child_id: int, distance_service: DistanceService):
        child.street = child.street.replace(" ", "+")
        child.street_number = child.street_number.replace(" ", "+")
        child.city = child.city.replace(" ", "+")
        address = Address(
            street=child.street,
            street_number=child.street_number,
            city=child.city,
            zip_code=child.zip_code
        )
        coordinates_response = await distance_service.get_coordinates_from_street_name(address)
        latitude, longitude = coordinates_response
        try:
            cursor = self.db.cursor()
            cursor.execute(
                """
                    UPDATE children
                    SET 
                        first_name = %s, 
                        family_name = %s, 
                        required_qualification = %s,  
                        requested_hours = %s
                    WHERE id = %s;
                """,
                (child.first_name, child.family_name, child.required_qualification, child.requested_hours, child_id)
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
                    id = (SELECT address_id FROM children WHERE id = %s);
    
                """,
                (child.street, child.street_number, child.zip_code, child.city, latitude, longitude, child_id)
            )
            self.db.commit()
            return Response(success=True, message=f"Child with ID: {cursor.lastrowid} is successfully updated")
        except pymysql.err.Error as e:
            print(f"Database error during child insertion: {e}")
            return

    async def get_all_children(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                    SELECT
                        c.id AS id,
                        c.first_name AS first_name,
                        c.family_name AS family_name,
                        q.qualification_text AS required_qualification,
                        c.requested_hours AS requested_hours,
                        REPLACE(adr.street, '+', ' ') AS street,
                        REPLACE(adr.street_number, '+', ' ') AS street_number,
                        REPLACE(adr.city, '+', ' ') AS city,
                        adr.zip_code AS zip_code
                    FROM 
                        children c
                        JOIN address adr ON adr.id = c.address_id
                        JOIN qualifications q ON q.id = c.required_qualification;
                """
            )
            return cursor.fetchall()

    async def get_children_for_distance_matrix(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                     SELECT
                        c.id AS child_id,
                        c.address_id as address_id,
                        c.required_qualification AS required_qualification_int,
                        adr.latitude AS latitude,
                        adr.longitude AS longitude
                    FROM 
                        children c
                        JOIN address adr ON adr.id = c.address_id
                        JOIN qualifications q ON q.id = c.required_qualification;
                """
            )
            return cursor.fetchall()

    async def get_child(self, child_id: int):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                   SELECT
                        c.id AS id,
                        c.first_name AS first_name,
                        c.family_name AS family_name,
                        q.qualification_text AS required_qualification,
                        c.requested_hours AS requested_hours,
                        REPLACE(adr.street, '+', ' ') AS street,
                        REPLACE(adr.street_number, '+', ' ') AS street_number,
                        REPLACE(adr.city, '+', ' ') AS city,
                        adr.zip_code AS zip_code
                    FROM 
                        children c
                        JOIN address adr ON adr.id = c.address_id
                        JOIN qualifications q ON q.id = c.required_qualification
                    WHERE c.id = %s;
                """, (child_id)
            )
            return cursor.fetchall()

    async def delete_child(self, child_id: int):
        with self.db.cursor() as cursor:
            cursor.execute("DELETE FROM address WHERE address.id = (SELECT address_id FROM children WHERE children.id = %s);", (child_id))
            cursor.execute("DELETE FROM children WHERE id = %s;", (child_id))
            self.db.commit()
            return cursor.rowcount
