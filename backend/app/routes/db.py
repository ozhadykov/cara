from fastapi import APIRouter, Depends
import pymysql

router = APIRouter(
    prefix="/api/db",
    tags=["db"],
    dependencies=[],
    responses={404: {"description": "nothing found in db service"}},
)

def get_db_connection():
    connection = pymysql.connect(
        host="database",       # service name of the MySQL container
        user="root",
        password="strong_password",
        database="phenix_mysql"
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

@router.post("/assistents")
def create_assistent(name, family_name, qualification, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO assistants (name, family_name, qualification) VALUES (?, ?, ?)", (name, family_name, qualification))
    conn.commit()
    return cursor.lastrowid

@router.get("/assistents")
def get_all_assistents(conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assistants")

    return cursor.fetchall()

@router.get("/assistents/{assistent_Id}")
def get_assistent(id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM assistants WHERE id = ?", (id))

    return cursor.fetchall()

@router.delete("/assistents/{assistent_Id}")
def delete_assistent(id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM assistants WHERE id = ?", (id))
    conn.commit()
    return cursor.rowcount  # Returns number of rows deleted

@router.post("/children")
def create_child(name, family_name, required_qualification, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("INSERT INTO children (name, family_name, required_qualification) VALUES (?, ?, ?)", (name, family_name, required_qualification))
    conn.commit()
    return cursor.lastrowid

@router.get("/children")
def get_all_children(conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children")

    return cursor.fetchall()

@router.get("/children/{child_Id}")
def get_child(id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM children WHERE id = ?", (id))

    return cursor.fetchall()

@router.delete("/children/{child_Id}")
def delete_child(id, conn = Depends(get_db)):
    cursor = conn.cursor()
    cursor.execute("DELETE FROM children WHERE id = ?", (id))
    conn.commit()
    return cursor.rowcount  # Returns number of rows deleted

