import pymysql.cursors
from fastapi import Depends
from ..database.database import get_db
from ..schemas.Response import Response
from pymysql.connections import Connection
from ..services.children_service import ChildrenService
from ..services.assistants_service import AssistantsService

class PairsService:

    def __init__(self, db: Connection = Depends(get_db), children_service: ChildrenService = Depends(), assistants_service: AssistantsService = Depends()):
        self.db = db
        self.children_service = children_service
        self.assistants_service = assistants_service

    async def get_base_data(self):
        # get all children
        children = await self.children_service.get_all_children()
        print(children)

        # get all assistants
        assistants = await self.assistants_service.get_all_assistants()
        print(assistants)

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

        print(pairs)
        return "data"