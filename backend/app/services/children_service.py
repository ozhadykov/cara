from fastapi import Depends
from pymysql.connections import Connection
import pymysql.cursors
from ..database.database import get_db
from ..schemas.children import ChildrenIn
from ..services.distance_service import DistanceService
from ..schemas.address import Address


class ChildrenService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    async def create_children(self, children_in: ChildrenIn, distance_service: DistanceService = Depends()):
        for child in children_in.children:
            address = Address(
                street=child.street,
                street_number=child.street_number,
                city=child.city,
                zip_code=child.zip_code
            )
            address_response = await distance_service.insert_address(address)
        return "importing children"

    async def get_all_children(self):
        async with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            await cursor.execute(
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
            return await cursor.fetchall()

    async def get_child(self, child_id: int):
        async with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            await cursor.execute(
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
            return await cursor.fetchall()

    async def delete_child(self, child_id: int):
        async with self.db.cursor() as cursor:
            await cursor.execute("DELETE FROM children WHERE id = %s", (child_id))
            await self.db.commit()  # Use await for commit
            return cursor.rowcount  # Returns number of rows deleted
