from fastapi import Depends
from pymysql.connections import Connection
import pymysql.cursors
from ..database.database import get_db
from ..schemas.children import ChildrenIn
from ..schemas.address import Address
from ..schemas.Response import Response
from ..services.distance_service import DistanceService


class ChildrenService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    async def create_children(self, children_in: ChildrenIn, distance_service: DistanceService):
        for child in children_in.children:
            address = Address(
                street=child.street,
                street_number=child.street_number,
                city=child.city,
                zip_code=child.zip_code
            )
            address_response = await distance_service.insert_address(address)
            if isinstance(address_response, Response) and not address_response.success:
                return address_response
            print(address_response)
        return "importing children"

    async def get_all_children(self):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                    SELECT
                        c.id AS id,
                        c.first_name AS first_name,
                        c.family_name AS family_name,
                        c.required_qualification AS required_qualification,
                        c.requested_hours AS requested_hours,
                        REPLACE(a.street, '+', ' ') AS street,
                        REPLACE(a.street_number, '+', ' ') AS street_number,
                        REPLACE(a.city, '+', ' ') AS city,
                        a.zip_code AS zip_code
                    FROM children c, address a
                    WHERE c.address_id = a.id
                """
            )
            return cursor.fetchall()

    async def get_child(self, child_id: int):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                    SELECT
                        children.*,
                        a.street,
                        a.street_number,
                        a.city,
                        a.zip_code
                    FROM
                        children
                        JOIN address a ON a.id = children.address_id
                    WHERE
                        children.id = %s
                """, (child_id)
            )
            return cursor.fetchall()

    async def delete_child(self, child_id: int):
        async with self.db.cursor() as cursor:
            await cursor.execute("DELETE FROM children WHERE id = %s", (child_id))
            await self.db.commit()  # Use await for commit
            return cursor.rowcount  # Returns number of rows deleted
