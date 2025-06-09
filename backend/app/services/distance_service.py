import httpx
import pymysql.cursors
from fastapi import Depends
from typing import List
from ..database.database import get_db
from ..schemas.address import Address
from ..schemas.Response import Response
from ..schemas.assistants import Assistant
from ..schemas.children import ChildForDistanceMatrix
from pymysql.connections import Connection
from ..services.keys_service import KeysService


class DistanceService:
    def __init__(self, db: Connection = Depends(get_db), keys_service: KeysService = Depends()):
        self.db = db
        self.keys_service = keys_service

    async def get_coordinates_from_street_name(self, address: Address):
        key_data = await self.keys_service.get_api_key("opencage_key")
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

            coordinates_response = await self.get_coordinates_from_street_name(address)
            if isinstance(coordinates_response, Response) and not coordinates_response.success:
                return coordinates_response

            latitude, longitude = coordinates_response
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:  # Use a context manager for cursor
                cursor.execute(
                    """
                    SELECT id FROM address WHERE latitude = %s AND longitude = %s
                    """,
                    (latitude, longitude)
                )

                # Use fetchone() to get the first (or only) matching row
                existing_address_record = cursor.fetchone()

                if existing_address_record:
                    # Address already exists, return its ID or a message
                    existing_address_id = existing_address_record['id']
                    print(f"Address already exists with ID: {existing_address_id}")
                    return Response(success=True, message="Address already exists", data=existing_address_id)
                else:
                    # Address does not exist, proceed with insertion
                    cursor.execute(
                        """
                        INSERT INTO address (street, street_number, city, zip_code, latitude, longitude)
                        VALUES (%s, %s, %s, %s, %s, %s)
                        """,
                        (address.street, address.street_number, address.city, address.zip_code, latitude, longitude)
                    )
                    self.db.commit()
                    return Response(success=True, message="Address inserted successfully", data=cursor.lastrowid)
        except pymysql.err.Error as e:
            print(f"Database error during child insertion: {e}")
            self.db.rollback()
            return Response(success=False, message="Database error")
        except Exception as e:
            print(f"Database error during child insertion: {e}")
            self.db.rollback()
            return Response(success=False, message="Database error")

    async def create_distances_for_assistant(self, assistant: Assistant, assistant_id: int, address_id: int,
                                             children: List[ChildForDistanceMatrix]):
        # get assistant address
        with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
            cursor.execute(
                """
                SELECT 
                    * 
                FROM 
                    address 
                WHERE 
                    id = %s
                """,
                address_id
            )
            assistant_address = cursor.fetchone()

        origin = (assistant_address['latitude'], assistant_address['longitude'])
        destinations = []
        # loop through and create destinations arr
        for child in children:
            # check for which children has assistant qualification
            if assistant.qualification >= child['required_qualification_int']:
                # call google api
                destinations.append((child['latitude'], child['longitude']))
                print(child['required_qualification_int'])
            else:
                # if not, then fill it with nullish values in db
                cursor.execute(
                    """
                    INSERT INTO distance_matrix
                    """
                )
                print('')

        print(destinations)

        # google api expects:
        # origin - assistant's address
        # destinations - children's addresses
        # mode - car or public transport
        # units - metric or imperical
        # there a few more, but not relevant in this project

        # gmaps = googlemaps.Client(key='')

        raise Exception('error')
