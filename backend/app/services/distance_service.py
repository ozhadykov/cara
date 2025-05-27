import httpx
import pymysql.cursors
from fastapi import Depends
from ..database.database import get_db
from ..schemas.address import Address
from ..schemas.Response import Response
from pymysql.connections import Connection
from ..services.keys_service import KeysService


class DistanceService:
    def __init__(self, db: Connection = Depends(get_db), keys_service: KeysService = Depends()):
        self.db = db
        self.keys_service = keys_service

    async def _get_coordinates_from_street_name(self, address: Address):
        key_data = await self.keys_service.get_api_key("opencagekey")
        url = f"https://api.opencagedata.com/geocode/v1/json?q={address.street}+{address.street_number}%2C+{address.zip_code}+{address.city}%2C+Germany&key={key_data["apiKey"]}"  # streetnumber u key wieder einfügen
        r = httpx.get(url)

        if r.status_code == 401:
            return Response(success=False, message="API Key is invalid")

        result_data = r.json()
        if not result_data["results"]:
            raise ValueError("No results returned from geocoding API")

        geometry = result_data["results"][0]["geometry"]
        return geometry["lat"], geometry["lng"]

    async def insert_address(self, address: Address) -> Response:
        try:
            address.street = address.street.replace(" ", "+")
            address.street_number = address.street_number.replace(" ", "+")
            address.city = address.city.replace(" ", "+")

            coordinates_response = await self._get_coordinates_from_street_name(address)
            if isinstance(coordinates_response, Response) and not coordinates_response.success:
                return coordinates_response

            latitude, longitude = coordinates_response
            cursor = self.db.cursor()
            cursor.execute(
                """
                INSERT INTO address (street, street_number, city, zip_code, latitude, longitude)
                VALUES (%s, %s, %s, %s, %s, %s)
                """,
                (address.street, address.street_number, address.city, address.zip_code, latitude, longitude)
            )
            return Response(success=True, message="Address inserted successfully", data=cursor.lastrowid)
        except pymysql.err.Error as e:
            print(f"Database error during child insertion: {e}")
            self.db.rollback()
            return Response(success=False, message="Database error")
        except Exception as e:
            print(f"Database error during child insertion: {e}")
            self.db.rollback()
            return Response(success=False, message="Database error")
