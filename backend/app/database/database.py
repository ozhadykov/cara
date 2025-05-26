import os
import pymysql
import pymysql.cursors
from fastapi import Depends

def get_db_connection():
    connection = pymysql.connect(
        host=os.getenv("DB_HOST"),
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