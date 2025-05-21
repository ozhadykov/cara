import httpx
from fastapi import APIRouter, Depends, Body
import pymysql
import os
import pymysql.cursors
from typing import List, Optional, Union
from pydantic import BaseModel

##########################################
# Global
##########################################

router = APIRouter(
    prefix="/api/db",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in db service"}},
)


class ApiKey(BaseModel):
    apiKey: str


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

baseChildCols = [
    'first_name',
    'family_name',
    'required_qualification',
    'street',
    'city',
    'zip_code',
    'requested_hours'
]

##########################################
# Models
##########################################

class Child(BaseModel):
    first_name: str
    family_name: str
    required_qualification: str
    requested_hours: int

    street: str
    street_number: str
    city: str
    zip_code: str

class ChildImport(BaseModel):
    dataCols: Optional[List[str]] = None
    dataRows: List[Child]

class Response(BaseModel):
    success: bool
    message: str
    data: Optional[Union[ChildImport]] = None


##########################################
# Assistants logic
##########################################

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

##########################################
# Children logic
##########################################

def getCoordinatesFromStreetName(street, street_number, zip_code, city):
    url = f"https://api.opencagedata.com/geocode/v1/json?q={street}+{street_number}%2C+{zip_code}+{city}%2C+Germany&key=6da9170c0e0a4676bd4045ba2697dc9a" # streetnumber u key wieder einfügen

    r = httpx.get(url)

    resultData = r.json()
    if not resultData["results"]:
        raise ValueError("No results returned from geocoding API")

    geometry = resultData["results"][0]["geometry"]
    return geometry["lat"], geometry["lng"]

def insertChildInDB(data, conn):
    try:
        coordinates = getCoordinatesFromStreetName(data.street, data.street_number, data.zip_code, data.city)
        latitude, longitude = coordinates
        print(coordinates)
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO address (street, street_number, city, zip_code, latitude, longitude)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (data.street.replace(" ", "+"), data.street_number.replace(" ", "+"), data.city.replace(" ", "+"), data.zip_code, latitude, longitude)
        )
        address_id = cursor.lastrowid

        cursor.execute(
            """
                INSERT INTO children 
                (first_name, family_name, required_qualification, requested_hours, address_id) 
                VALUES (%s, %s, %s, %s, %s)
            """, 
            (data.first_name, data.family_name, data.required_qualification, data.requested_hours, address_id)
        )
        conn.commit()
        return cursor.lastrowid
    except Exception as e:
        conn.rollback()
        return None

@router.post("/children")
def create_child(data: ChildImport, multiple: bool | None = None,  conn = Depends(get_db)):
    print(data)
    # if this is single import
    if not multiple and len(data.dataRows): 
        childData = data.dataRows[0]
        insertedChildId = insertChildInDB(childData, conn)
        if insertedChildId is not None: 
            return Response(success=True, message=f"Child is successfully added with id {insertedChildId}")
        return Response(success=False, message="Child could not be added to Darabase")
    
    # if this is multiple bulk import
    rows = data.dataRows
    failed = []

    # insert rows
    for row in rows:
        childData = row
        insertedChildId = insertChildInDB(childData, conn)
        if insertedChildId is None:
            failed.append(row)
        
    if len(failed):
        return Response(success=False, message=f"{len(failed)} children could not be saved in data base")
    return Response(success=True, message=f"{len(rows)} children are saved in data base")

@router.post("/children/{child_id}")
def update_child(data: Child, child_id,conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute(
        """
            UPDATE children
            SET 
                name = %s, 
                family_name = %s, 
                required_qualification = %s, 
                street = %s, 
                city = %s, 
                zip_code = %s, 
                requested_hours = %s
            WHERE id = %s;
        """, 
        (data.name, data.family_name, data.required_qualification, data.street, data.city, data.zip_code, data.requested_hours, child_id)
    )
    conn.commit()
    return cursor.lastrowid


@router.get("/children")
def get_all_children(conn = Depends(get_db)):
    cursor = conn.cursor()
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

#TODO
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

@router.post("/apiKey/{id}")
def update_apiKey(data: ApiKey, id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute(
        """
            UPDATE apiKeys
            SET 
                apiKey = %s
            WHERE id = %s;
        """, 
        (data.apiKey, id)
    )
    conn.commit()
    return cursor.lastrowid

@router.get("/apiKey/{id}")
def get_apiKey(id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT apiKey FROM apiKeys WHERE id = %s", (id))

    return cursor.fetchone()