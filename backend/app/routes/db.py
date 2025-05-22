import httpx
from fastapi import APIRouter, Depends, Body
import pymysql
import os
import pymysql.cursors
from typing import List, Optional, Union
from pydantic import BaseModel
from geopy.distance import geodesic

##########################################
# region Global
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
        host=os.getenv("DB_HOST"),  # service name of the MySQL container
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


def get_key(id, conn):
    cursor = conn.cursor()
    cursor.execute("SELECT apiKey FROM apiKeys WHERE id = %s", (id))

    return cursor.fetchone()


def getCoordinatesFromStreetName(street, street_number, zip_code, city, conn):
    key_data = get_key("opencagekey", conn)
    url = f"https://api.opencagedata.com/geocode/v1/json?q={street}+{street_number}%2C+{zip_code}+{city}%2C+Germany&key={key_data["apiKey"]}"  # streetnumber u key wieder einfügen

    r = httpx.get(url)

    if r.status_code == 401:
        return Response(success=False, message="API Key is invalid")

    result_data = r.json()
    if not result_data["results"]:
        raise ValueError("No results returned from geocoding API")

    geometry = result_data["results"][0]["geometry"]
    return geometry["lat"], geometry["lng"]


def calc_distance(adr1, adr2):
    return geodesic(adr1, adr2).kilometers


def insert_address(data, conn):
    try:
        data.street = data.street.replace(" ", "+")
        data.street_number = data.street_number.replace(" ", "+")
        data.city = data.city.replace(" ", "+")

        coordinates = getCoordinatesFromStreetName(data.street, data.street_number, data.zip_code, data.city, conn)
        if isinstance(coordinates, Response) and not coordinates.success:
            return coordinates

        latitude, longitude = coordinates
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO address (street, street_number, city, zip_code, latitude, longitude)
            VALUES (%s, %s, %s, %s, %s, %s)
            """,
            (data.street, data.street_number, data.city, data.zip_code, latitude, longitude)
        )
        return cursor.lastrowid
    except Exception as e:
        return None


# endregion

##########################################
# region Models
##########################################

#### Global models ####

class Person(BaseModel):
    first_name: str
    family_name: str
    time_start: str
    time_end: str
    street: str
    street_number: str
    city: str
    zip_code: str


#### Children Models ####

class Child(Person):
    required_qualification: str
    requested_hours: int


class ChildImport(BaseModel):
    dataCols: Optional[List[str]] = None
    dataRows: List[Child]


#### Assistants Models #####

class Assistant(Person):
    qualification: str
    capacity: int


class AssistantImport(BaseModel):
    dataCols: Optional[List[str]] = None
    dataRows: List[Assistant]


class Response(BaseModel):
    success: bool
    message: str
    data: Optional[Union[List[Union[Child, Assistant, str, object]]]] = None


# endregion
##########################################


##########################################
# region Assistants logic
##########################################

def insert_assistant_in_db(data: Assistant, conn):
    try:
        cursor = conn.cursor()
        address_id = insert_address(data, conn)
        if address_id is None:
            return Response(success=False,
                            message=f"address:{data.street} {data.street_number}, {data.city}  is invalid")

        cursor.execute(
            """
                INSERT INTO assistants 
                (first_name, family_name, qualification, capacity, time_start, time_end, address_id) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (data.first_name, data.family_name, data.qualification, data.capacity, data.time_start,
             data.time_end, address_id)
        )
        conn.commit()
        return cursor.lastrowid
    except Exception as e:
        conn.rollback()
        return None


@router.post("/assistants")
def create_assistant(data: AssistantImport, multiple: bool | None = None, conn=Depends(get_db)):
    # if this is single import
    if not multiple and len(data.dataRows):
        assistant_data = data.dataRows[0]
        inserted_assistant_id = insert_assistant_in_db(assistant_data, conn)
        if inserted_assistant_id is not None:
            return Response(success=True, message=f"Child is successfully added with id {inserted_assistant_id}")
        return Response(success=False, message="Child could not be added to Darabase")

    # if this is multiple bulk import
    rows = data.dataRows
    failed = []

    # insert rows
    for row in rows:
        assistant_data = row
        inserted_assistant_id = insert_assistant_in_db(assistant_data, conn)
        if inserted_assistant_id is None:
            failed.append(row)

    if len(failed):
        return Response(success=False, message=f"{len(failed)} assistants could not be saved in data base")
    return Response(success=True, message=f"{len(rows)} assistants are saved in data base")


@router.get("/assistants")
def get_all_assistants(conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("""
        SELECT 
            ast.id AS id, 
            ast.first_name AS first_name, 
            ast.family_name AS family_name, 
            ast.qualification AS required_qualification, 
            ast.capacity AS capacity, 
            REPLACE(a.street, '+', ' ') AS street, 
            REPLACE(a.street_number, '+', ' ') AS street_number, 
            REPLACE(a.city, '+', ' ') AS city, 
            a.zip_code AS zip_code 
        FROM assistants ast, address a 
        WHERE ast.address_id = a.id
    """)

    return cursor.fetchall()


@router.get("/assistants/{assistent_Id}")
def get_assistant(assistent_Id, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assistants WHERE id = %s", (assistent_Id))

    return cursor.fetchall()


@router.delete("/assistants/{assistent_Id}")
def delete_assistant(assistent_Id, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM assistants WHERE id = %s", (assistent_Id))
    conn.commit()
    return cursor.rowcount  # Returns number of rows deleted


# endregion
##########################################

##########################################
# Children logic
##########################################

def insert_child_in_db(data: Child, conn):
    try:
        address_id = insert_address(data, conn)
        if address_id is None:
            return Response(success=False,
                            message=f"Cannot find address or address: {data.street} {data.street_number}, {data.city}  is invalid")
        if isinstance(address_id, Response) and not address_id.success:
            return address_id

        cursor = conn.cursor()
        cursor.execute(
            """
                INSERT INTO children 
                (first_name, family_name, required_qualification, requested_hours, time_start, time_end, address_id) 
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """,
            (data.first_name, data.family_name, data.required_qualification, data.requested_hours, data.time_start,
             data.time_end, address_id)
        )
        conn.commit()
        return cursor.lastrowid
    except pymysql.err.Error as e:
        print(f"Database error during child insertion: {e}")  # Replace with your logging mechanism
        conn.rollback()
        return None
    except Exception as e:
        print(f"An unexpected error occurred during child insertion: {e}")  # Catch other potential errors
        conn.rollback()
        return None


@router.post("/children")
def create_child(data: ChildImport, multiple: bool | None = None, conn=Depends(get_db)):
    # if this is single import
    if not multiple and len(data.dataRows):
        child_data = data.dataRows[0]
        inserted_child_id = insert_child_in_db(child_data, conn)
        if inserted_child_id is not None:
            return Response(success=True, message=f"Child is successfully added with id {inserted_child_id}")
        return Response(success=False, message="Child could not be added to Darabase")

    # if this is multiple bulk import
    rows = data.dataRows
    failed = []

    # insert rows
    for row in rows:
        child_data = row
        inserted_child_id = insert_child_in_db(child_data, conn)
        if inserted_child_id is None:
            failed.append(row)
        if isinstance(inserted_child_id, Response) and not inserted_child_id.success:
            return inserted_child_id

    if len(failed):
        return Response(success=False, message=f"{len(failed)} children could not be saved in data base")
    return Response(success=True, message=f"{len(rows)} children are saved in data base")


@router.post("/children/{child_id}")
def update_child(data: Child, child_id, conn=Depends(get_db)):
    data.street = data.street.replace(" ", "+")
    data.street_number = data.street_number.replace(" ", "+")
    data.city = data.city.replace(" ", "+")
    coordinates = getCoordinatesFromStreetName(data.street, data.street_number, data.zip_code, data.city, conn)
    latitude, longitude = coordinates
    cursor = conn.cursor()
    cursor.execute(
        """
            UPDATE children
            SET 
                first_name = %s, 
                family_name = %s, 
                required_qualification = %s,  
                requested_hours = %s
            WHERE id = %s;
        """,
        (data.first_name, data.family_name, data.required_qualification, data.requested_hours, child_id)
    )
    cursor.execute(
        """
            UPDATE address
            SET
                street = %s,
                street_number = %s,
                zip_code = %s,
                city = %s,
                latitude = %s,
                longitude = %s
            WHERE
            id = (SELECT address_id FROM children WHERE id = %s);

        """,
        (data.street, data.street_number, data.zip_code, data.city, latitude, longitude, child_id)
    )
    conn.commit()
    return cursor.lastrowid


@router.get("/children")
def get_all_children(conn=Depends(get_db)):
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


# TODO
@router.get("/children/{child_Id}")
def get_child(child_Id, conn=Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = %s", (child_Id))

    return cursor.fetchall()


@router.delete("/children/{child_Id}")
def delete_child(child_Id, conn=Depends(get_db)):
    cursor = conn.cursor()

    cursor.execute("DELETE FROM children WHERE id = %s", (child_Id))
    conn.commit()
    return cursor.rowcount  # Returns number of rows deleted


# endregion
##########################################

##########################################
# Keys logic
##########################################

@router.post("/apiKey/{id}")
def update_apiKey(data: ApiKey, id, conn=Depends(get_db)):
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
def get_apiKey(id, conn=Depends(get_db)):
    return get_key(id, conn)
