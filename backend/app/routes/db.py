from fastapi import APIRouter, Depends, Body
import pymysql
import os
import pymysql.cursors
from typing import Dict
from pydantic import BaseModel

router = APIRouter(
    prefix="/api/db",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in db service"}},
)

class Data(BaseModel):
    name: str
    family_name: str
    required_qualification: str
    street: str
    city: str
    zip_code: str
    requested_hours: int


def get_db_connection():
    connection = pymysql.connect(
        host=os.getenv("DB_HOST"),       # service name of the MySQL container
        user=os.getenv("DB_USER"),
        password=os.getenv("DB_PASSWORD"),
        database=os.getenv("DB_NAME"),
        cursorclass=pymysql.cursors.DictCursor
    )

    return connection

def get_db():
    connection = get_db_connection()
    try:
        yield connection
    finally:
        connection.close()

@router.get("/dev")
def read_root(conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SHOW TABLES")

    result = cursor.fetchone()
    return {"message": result[0]}

@router.post("/assistants")
def create_assistent(name, family_name, qualification, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO assistants (name, family_name, qualification) VALUES (%s, %s, %s)", (name, family_name, qualification))
    conn.commit()
    return cursor.lastrowid

@router.get("/assistants")
def get_all_assistants(conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assistants")

    return cursor.fetchall()

@router.get("/assistants/{assistent_Id}")
def get_assistent(assistent_Id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assistants WHERE id = %s", (assistent_Id))

    return cursor.fetchall()

@router.delete("/assistants/{assistent_Id}")
def delete_assistent(assistent_Id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM assistants WHERE id = %s", (assistent_Id))
    conn.commit()
    return cursor.rowcount  # Returns number of rows deleted

@router.post("/children")
def create_child(data: Data, conn = Depends(get_db)):
    print(data)
    cursor = conn.cursor()
    cursor.execute(
        """
            INSERT INTO children 
            (name, family_name, required_qualification, street, city, zip_code, requested_hours) 
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, 
        (data.name, data.family_name, data.required_qualification, data.street, data.city, data.zip_code, data.requested_hours)
    )
    conn.commit()
    return cursor.lastrowid

@router.get("/children")
def get_all_children(conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children")

    return cursor.fetchall()

@router.get("/children/{child_Id}")
def get_child(child_Id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = %s", (child_Id))

    return cursor.fetchall()

@router.delete("/children/{child_Id}")
def delete_child(child_Id, conn = Depends(get_db)):
    cursor = conn.cursor()
    print(id)

    cursor.execute("DELETE FROM children WHERE id = %s", (child_Id))
    conn.commit()
    return cursor.rowcount  # Returns number of rows deleted

