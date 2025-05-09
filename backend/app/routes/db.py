from fastapi import APIRouter
import pymysql

router = APIRouter(
    prefix="/db",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in db service"}},
)

@router.get("/dev")
def read_root():
    connection = pymysql.connect(
        host="database",       # service name of the MySQL container
        user="root",
        password="strong_password",
        database="phenix_mysql"
    )
    with connection.cursor() as cursor:
        cursor.execute("SHOW TABLES")
        result = cursor.fetchone()
    connection.close()
    return {"message": result[0]}