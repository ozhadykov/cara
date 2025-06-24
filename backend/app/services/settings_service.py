import pymysql.cursors
from fastapi import Depends
from pymysql.connections import Connection
from ..schemas.api_key import ApiKey, WeightsIn
from ..database.database import get_db
from ..schemas.Response import Response


class SettingsService:
    def __init__(self, db: Connection = Depends(get_db)):
        self.db = db

    async def get_api_key(self, id: str):
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute("SELECT apiKey FROM api_keys WHERE id = %s", id)
            return cursor.fetchone()

    async def update_api_key(self, data: ApiKey, key_id: str):
        with self.db.cursor() as cursor:
            cursor.execute(
                """
                    UPDATE api_keys
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

    async def get_lp_weights(self):
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                        SELECT * FROM lp_weights
                    """
                )
                weights = cursor.fetchall()

                # transforming for frontend
                data = {}
                for weight in weights:
                    data[weight['id']] = weight['value']
                return Response(success=True, message="LP weights are successfully fetched", data=data)
        except pymysql.DatabaseError as e:
            return Response(success=False, message=f"Database error while updating weighs: {str(e)}")
        except Exception as e:
            return Response(success=False, message=f"Error while updating weighs: {str(e)}")

    async def save_lp_weights(self, weights: WeightsIn):
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                    UPDATE lp_weights
                    SET value = CASE id
                        WHEN 'distanceImportance' THEN %s
                        WHEN 'qualificationImportance' THEN %s
                        ELSE value
                    END
                    WHERE id IN ('distanceImportance', 'qualificationImportance');
                    """,
                    (weights.distanceImportance, weights.qualificationImportance)
                )
                rows_affected = cursor.rowcount
                if rows_affected == 0:
                    return Response(success=False, message="No weights were updated")
                self.db.commit()
                return Response(success=True, message="Weights updated successfully")
        except pymysql.DatabaseError as e:
            self.db.rollback()
            return Response(success=False, message=f"Database error while updating weighs: {str(e)}")
        except Exception as e:
            self.db.rollback()
            return Response(success=False, message=f"Error while updating weighs: {str(e)}")