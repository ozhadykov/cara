import pymysql.cursors
from fastapi import Depends
from pymysql.connections import Connection
from ..schemas.api_key import ApiKey
from ..database.database import get_db
from ..schemas.Response import Response


class KeysService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    async def get_api_key(self, id: str):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT apiKey FROM apiKeys WHERE id = %s", id)
            return cursor.fetchone()

    async def update_api_key(self, data: ApiKey, key_id: str):
        with self.db.cursor() as cursor:
            cursor.execute(
                """
                    UPDATE apiKeys
                    SET
                        apiKey = %s
                    WHERE id = %s;
                """,
                (data.apiKey, key_id)
            )
            # todo create validation process
            success = cursor.rowcount
            self.db.commit()
            if success:
                return Response(success=True, message="API key updated")
            return cursor.rowcount
