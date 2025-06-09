import httpx
import json
import googlemaps
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


def split_list_by_count(data_list, chunk_size):
    """Splits a list into chunks of a specified size."""
    return [data_list[i:i + chunk_size] for i in range(0, len(data_list), chunk_size)]


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
        # google api expects:
        # origin - assistant's address
        # destinations - children's addresses
        # mode - car or public transport
        # units - metric or imperical
        # there a few more, but not relevant in this project

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

        units = 'metric'
        mode = 'transit'
        if assistant.has_car:
            mode = 'driving'
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
                try:
                    with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                        cursor.execute(
                            """
                            INSERT INTO distance_matrix (origin_address_id, destination_address_id, distance, travel_time)
                            VALUES (%s, %s, %s, %s)
                            """,
                            (address_id, child['address_id'], -1, -1)
                        )
                        self.db.commit()
                except Exception as e:
                    print(f"Database error during distance insertion: {e}")

        # preparing credentials
        google_api_key = await self.keys_service.get_api_key('google_maps_key')
        gmaps = googlemaps.Client(key=google_api_key['apiKey'])

        # split destinations into chunks with 100 items
        destination_chunks = split_list_by_count(destinations, 100)

        for destination_chunk in destination_chunks:
            matrix_result = gmaps.distance_matrix(origins=[origin],
                                                  destinations=destination_chunk,
                                                  mode=mode)

            if matrix_result['status'] == 'OK':
                for row in matrix_result['rows']:
                    for element in row['elements']:
                        if element['status'] == 'OK':
                            distance = element['distance']['value']
                            duration = element['duration']['value']
                            print(f"  Distance: {distance}, Duration: {duration}")
                        else:
                            print(f"  Error for this destination: {element['status']}")
            else:
                print(f"Error in Distance Matrix API call: {matrix_result['status']}")
            print(json.dumps(matrix_result, indent=4))

        return 'hello world'
