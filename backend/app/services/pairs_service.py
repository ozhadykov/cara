import pymysql.cursors
from fastapi import Depends
from ..database.database import get_db
from ..schemas.Response import Response
from ..schemas.pairs_generator import PairsGeneratorBaseData
from pymysql.connections import Connection
from ..services.children_service import ChildrenService
from ..services.assistants_service import AssistantsService

class PairsService:

    def __init__(self, db: Connection = Depends(get_db), children_service: ChildrenService = Depends(), assistants_service: AssistantsService = Depends()):
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