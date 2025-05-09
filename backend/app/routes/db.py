from fastapi import APIRouter
import pymysql
import os

router = APIRouter(
    prefix="/api/db",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in db service"}},
)

@router.get("/dev")
def read_root():
    connection = pymysql.connect(
        host=os.getenv("DB_HOST"),       # service name of the MySQL container
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME")
    )
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        result = cursor.fetchone()
        print(result)
    connection.close()
    return {"message": result}