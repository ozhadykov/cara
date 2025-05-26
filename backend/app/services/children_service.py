from fastapi import Depends
from pymysql.connections import Connection
from ..database.database import get_db

class ChildrenService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    def get_all_children(self):
        cursor = self.db.cursor()
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

    def get_child(self, child_id: int):
        cursor = self.db.cursor()
        cursor.execute("""
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
        """, (child_id))
        return cursor.fetchall()

    def delete_child(self, child_id: int):
        cursor = self.db.cursor()
        cursor.execute("DELETE FROM children WHERE id = %s", (child_id))
        self.db.commit()
        return cursor.rowcount  # Returns number of rows deleted