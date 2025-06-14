import httpx
import googlemaps
import pymysql.cursors
from fastapi import Depends
from datetime import datetime
from typing import List, Dict, Any
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

    # async def refresh_distances(self):
    #     google_api_key_data = await self.keys_service.get_api_key('google_maps_key')
    #     if not google_api_key_data or 'apiKey' not in google_api_key_data:
    #         return Response(success=False, message="Google Maps API Key not found or invalid.")

    #     gmaps = googlemaps.Client(key=google_api_key_data['apiKey'])

    #     with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
    #         cursor.execute(
    #             """
    #             SELECT 
    #                 * 
    #             FROM 
    #                 address 
    #             """,
    #             address_id
    #         )
    #         addresses = cursor.fetchall()

    #         cursor.execute(
    #             """
    #                 SELECT 
    #                     a.id AS assistant_id,
    #                     a.qualification AS assistant_qualification,
    #                     a.address_id AS origin_address_id,
    #                     a.has_car AS assistant_has_car,
    #                     c.id AS child_id,
    #                     c.required_qualification AS child_required_qualification,
    #                     c.address_id AS destination_address_id
    #                 FROM children c, assistants a
    #                 WHERE 
    #                     assistant_qualification >= child_required_qualification
    #                     AND NOT EXISTS(
    #                         SELECT * 
    #                         FROM distance_matrix dm
    #                         WHERE 
    #                             dm.origin_address_id = origin_address_id
    #                             AND dm.destination_address_id = destination_address_id
    #                     )
    #             """
    #         )

    #         results = cursor.fetchall()

    #         assistant_ids = [row["a.address_id"] for row in results]  
    #         child_ids = [row["c.address_id"] for row in results]      

    #         # TODO OMAR
                


    async def create_distances_for_assistant(self, assistant: Assistant, address_id: int,
                                             children: List[ChildForDistanceMatrix]):
        # google api expects:
        # origin - assistant's address
        # destinations - children's addresses
        # mode - car or public transport
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

        if not assistant_address:
            print(f"Error: Assistant address with ID {address_id} not found.")
            return Response(success=False, message=f"Assistant address with ID {address_id} not found.")

        mode = 'transit'
        if assistant.has_car:
            mode = 'driving'

        origin = (assistant_address['latitude'], assistant_address['longitude'])

        qualified_destinations_with_data: List[Dict[str, Any]] = []
        unqualified_children_ids: List[int] = []

        for child in children:
            if assistant.qualification >= child['required_qualification_int']:
                qualified_destinations_with_data.append({
                    "coords": (child['latitude'], child['longitude']),
                    "address_id": child['address_id']
                })
            else:
                unqualified_children_ids.append(child['address_id'])

        # Handle unqualified children first by inserting -1
        try:
            with self.db.cursor() as cursor:
                if unqualified_children_ids:
                    # Prepare values for batch insert
                    insert_values = [(address_id, child_addr_id, -1, -1) for child_addr_id in
                                     unqualified_children_ids]
                    query = """
                            INSERT INTO distance_matrix (origin_address_id, destination_address_id, distance, travel_time)
                            VALUES (%s, %s, %s, %s)
                            """
                    cursor.executemany(query, insert_values)
                    self.db.commit()
                    print(f"Inserted -1 for {len(unqualified_children_ids)} unqualified children.")
        except Exception as e:
            print(f"Database error during unqualified child distance insertion: {e}")
            self.db.rollback()
            return Response(success=False,
                            message="Database error during unqualified child distance insertion.")

        # If there are no qualified destinations, we can stop here
        if not qualified_destinations_with_data:
            print("No qualified children to calculate distances for.")
            return Response(success=True, message="No qualified children to calculate distances for.")

        # preparing credentials
        google_api_key_data = await self.keys_service.get_api_key('google_maps_key')
        if not google_api_key_data or 'apiKey' not in google_api_key_data:
            return Response(success=False, message="Google Maps API Key not found or invalid.")

        gmaps = googlemaps.Client(key=google_api_key_data['apiKey'])

        # Split qualified destinations into chunks with 100 items, because matrix api has max 100 els
        destination_chunks_with_data = split_list_by_count(qualified_destinations_with_data, 100)

        for chunk_index, destination_chunk_with_data in enumerate(destination_chunks_with_data):
            # Extract just the coordinates for the API call
            current_dest_coords = [item["coords"] for item in destination_chunk_with_data]

            departure_time = datetime.now()

            try:
                matrix_result = gmaps.distance_matrix(origins=[origin],
                                                      destinations=current_dest_coords,
                                                      mode=mode,
                                                      departure_time=departure_time if mode == 'transit' else None
                                                      )

                if matrix_result['status'] == 'OK':
                    # There's only one row since we have one origin
                    elements = matrix_result['rows'][0]['elements']

                    # The order of `elements` directly corresponds to the order of `current_dest_coords`
                    # which in turn corresponds to `destination_chunk_with_data`.
                    for i, element in enumerate(elements):
                        # Retrieve the original child data using the index `i`
                        corresponding_child_data = destination_chunk_with_data[i]
                        child_address_id = corresponding_child_data['address_id']

                        if element['status'] == 'OK':
                            distance = element['distance']['value']
                            duration = element['duration']['value']
                            print(element)
                            # Save to database
                            try:
                                with self.db.cursor() as cursor:
                                    cursor.execute(
                                        """
                                        INSERT INTO distance_matrix (origin_address_id, destination_address_id, distance, travel_time)
                                        VALUES (%s, %s, %s, %s)
                                        """,
                                        (address_id, child_address_id, distance, duration)
                                    )
                                self.db.commit()
                                print(
                                    f"  Inserted distance for child_address_id {child_address_id}: Distance={distance}, Duration={duration}")
                            except Exception as db_e:
                                print(f"Database error saving distance for child_address_id {child_address_id}: {db_e}")
                                self.db.rollback()
                                # todo: Decide if you want to stop processing or continue
                        else:
                            print(f"  Error for child_address_id {child_address_id} (API status: {element['status']})")
                            try:
                                with self.db.cursor() as cursor:
                                    cursor.execute(
                                        """
                                        INSERT INTO distance_matrix (origin_address_id, destination_address_id, distance, travel_time)
                                        VALUES (%s, %s, %s, %s)
                                        """,
                                        (address_id, child_address_id, -2, -2)
                                        # -2 used, because api could not build a route
                                    )
                                self.db.commit()
                            except Exception as db_e:
                                print(
                                    f"Database error saving error code for child_address_id {child_address_id}: {db_e}")
                                self.db.rollback()

                else:
                    print(
                        f"Error in Distance Matrix API call for chunk {chunk_index + 1}: {matrix_result['status']} - {matrix_result.get('error_message', 'No error message provided.')}")
                    # todo: mark all children in this chunk as failed?
            except googlemaps.exceptions.ApiError as api_e:
                print(f"Google Maps API error for chunk {chunk_index + 1}: {api_e}")
            except Exception as e:
                print(f"An unexpected error occurred for chunk {chunk_index + 1}: {e}")

        return Response(success=True, message="Distances calculated and saved successfully.")
