import httpx
import googlemaps
import pymysql.cursors
from fastapi import Depends
from datetime import datetime
from typing import List, Dict, Any, TYPE_CHECKING

if TYPE_CHECKING:
    from .assistants_service import AssistantsService
    from .children_service import ChildrenService

from .keys_service import KeysService
from ..database.database import get_db
from ..schemas.address import Address, DistanceMatrixAddress
from ..schemas.Response import Response
from ..schemas.assistants import Assistant
from ..schemas.children import ChildForDistanceMatrix
from pymysql.connections import Connection


def split_list_by_count(data_list, chunk_size):
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

    async def address_exists(self, address: Address) -> Response:
        try:
            coordinates_response = await self.get_coordinates_from_street_name(address)
            if isinstance(coordinates_response, Response) and not coordinates_response.success:
                return coordinates_response

            latitude, longitude = coordinates_response

            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                        SELECT id
                        FROM address 
                        WHERE 
                            latitude = %s
                            AND longitude = %s
                    """,
                    (latitude, longitude)
                )

                result = cursor.fetchone()

            return Response(success=True, data=result)
        except ValueError:
            return Response(success=False, message="Coordinates not found")
        except pymysql.err.Error as e:
            print(f"Database error during assistant update: {e}")
            return Response(success=False, message="Database error")

    async def insert_address(self, address: Address) -> Response:
        try:
            address.street = address.street.replace(" ", "+")
            address.street_number = address.street_number.replace(" ", "+")
            address.city = address.city.replace(" ", "+")

            # if failed somewhere then return Response
            address_exists_response = await self.address_exists(address)
            if not address_exists_response.success:
                return address_exists_response
            # address does not exist in db
            if address_exists_response.data is None:
                coordinates_response = await self.get_coordinates_from_street_name(address)
                if isinstance(coordinates_response, Response) and not coordinates_response.success:
                    return coordinates_response

                latitude, longitude = coordinates_response
                with self.db.cursor(pymysql.cursors.DictCursor) as cursor:  # Use a context manager for cursor
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
            # address exists
            else:
                address_id = address_exists_response.data["id"]
                print(f"Address already exists with ID: {address_id}")
                return Response(success=True, message="Address already exists", data=address_id)
        except pymysql.err.Error as e:
            print(f"Database error during address insertion: {e}")
            self.db.rollback()
            return Response(success=False, message="Database error")
        except Exception as e:
            print(f"Error during address insertion: {e}")
            self.db.rollback()
            return Response(success=False, message="Error")

    async def _get_all_distances_for_address(self, address_id: int) -> Response:
        try:
            with self.db.cursor(pymysql.cursors.DictCursor) as cursor:
                cursor.execute(
                    """
                        SELECT 
                            *
                        FROM 
                            distance_matrix
                        WHERE 
                            origin_address_id = %s
                    """,
                    (address_id)
                )

                result = cursor.fetchall()
                return Response(success=True, data=result)
        except pymysql.err.Error as e:
            print(f"Database error during address reading for matrix refresh: {e}")
            return Response(success=False, message="Database error")

    async def _validate_children_address(self, assistant_distances: List, children: List) -> List:
        invalid_children = []
        for child in children:
            mapping_exists = False
            for distance in assistant_distances:
                if distance["destination_address_id"] == child["address_id"]:
                    mapping_exists = True

            if not mapping_exists:
                invalid_children.append(child)

        return invalid_children

    async def refresh_distance_matrix(
            self,
            children_service: "ChildrenService",
            assistants_service: "AssistantsService"
    ) -> Response:

        # check if there are new address id mappings between children and assistants
        # get all assistants from db
        assistants = await assistants_service.get_all_assistants()
        children = await children_service.get_all_children()
        for assistant in assistants:
            # get all distances for assistant
            assistant_address_id = assistant["address_id"]
            response = await self._get_all_distances_for_address(assistant_address_id)
            if not response.success:
                return response

            assistant_distances = response.data
            children_to_distance_matrix = await self._validate_children_address(assistant_distances, children)
            transformed_children = [
                ChildForDistanceMatrix(
                    **{
                        'child_id': child_data['id'],
                        'address_id': child_data['address_id'],
                        'required_qualification_int': child_data['required_qualification'],
                        'latitude': child_data['latitude'],
                        'longitude': child_data['longitude']
                    }
                )
                for child_data in children_to_distance_matrix
            ]
            assistant_address = DistanceMatrixAddress(**{
                'id': assistant_address_id,
                'latitude': assistant['latitude'],
                'longitude': assistant['longitude']
            })
            response = await self._update_distances_for_origin(assistant_address, transformed_children)
            return response

    async def _update_distances_for_origin(self, origin: DistanceMatrixAddress,
                                           destinations: List[ChildForDistanceMatrix]) -> Response:
        # make 2 google api calls for modes transit and driving
        modes = [
            'transit',
            'driving'
        ]
        transformed_origin = (origin.latitude, origin.longitude)

        transformed_destinations = []
        for destination in destinations:
            transformed_destinations.append({
                "coords": (destination.latitude, destination.longitude),
                "address_id": destination.address_id
            })

        # Split qualified destinations into chunks with 100 items, because matrix api has max 100 els
        destination_chunks_with_data = split_list_by_count(transformed_destinations, 100)

        # preparing credentials
        google_api_key_data = await self.keys_service.get_api_key('google_maps_key')
        if not google_api_key_data or 'apiKey' not in google_api_key_data:
            return Response(success=False, message="Google Maps API Key not found or invalid.")

        gmaps = googlemaps.Client(key=google_api_key_data['apiKey'])
        for mode in modes:
            for chunk_index, destination_chunk_with_data in enumerate(destination_chunks_with_data):
                # Extract just the coordinates for the API call
                current_dest_coords = [item["coords"] for item in destination_chunk_with_data]

                departure_time = datetime.now()

                try:
                    matrix_result = gmaps.distance_matrix(origins=[transformed_origin],
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
                            corresponding_destination_data = destination_chunk_with_data[i]
                            destination_address_id = corresponding_destination_data['address_id']

                            if element['status'] == 'OK':
                                distance = element['distance']['value']
                                duration = element['duration']['value']
                                print(element)
                                # Save to database
                                try:
                                    with self.db.cursor() as cursor:
                                        cursor.execute(
                                            """
                                            INSERT INTO distance_matrix (origin_address_id, destination_address_id, transport_type, distance, travel_time)
                                            VALUES (%s, %s, %s, %s, %s)
                                            """,
                                            (origin.id, destination_address_id, mode, distance, duration)
                                        )
                                    self.db.commit()
                                    print(
                                        f"Inserted distance for destination_address_id {destination_address_id}: Distance={distance}, Duration={duration}")
                                except Exception as db_e:
                                    print(
                                        f"Database error saving distance for destination_address_id {destination_address_id}: {db_e}")
                                    self.db.rollback()
                                    # todo: Decide if you want to stop processing or continue
                            else:
                                print(
                                    f"  Error for destination_address_id {destination_address_id} (API status: {element['status']})")
                                try:
                                    with self.db.cursor() as cursor:
                                        cursor.execute(
                                            """
                                            INSERT INTO distance_matrix (origin_address_id, destination_address_id, transport_type, distance, travel_time)
                                            VALUES (%s, %s, %s, %s, %s)
                                            """,
                                            (origin.id, destination_address_id, 'invalid', -2, -2)
                                            # -2 used, because api could not build a route
                                        )
                                    self.db.commit()
                                except Exception as db_e:
                                    print(
                                        f"Database error saving error code for destination_address_id {destination_address_id}: {db_e}")
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