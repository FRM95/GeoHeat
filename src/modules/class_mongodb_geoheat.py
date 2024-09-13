from modules.class_mongodb import MongoDB
from bson.json_util import dumps
from dotenv import load_dotenv
from os import getenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GeoHeatDB(MongoDB):

    def __init__(self) -> None:
        super().__init__()
        self.username = getenv('MONGO_INITDB_ROOT_USERNAME')
        # self.host = getenv('MONGODB_HOST')
        self.host = 'localhost' # for debug
        database_connection = f"mongodb://{self.username}:{getenv('MONGO_INITDB_ROOT_PASSWORD')}@{self.host}:27018/?authSource=admin" # changed 27017 to 27018 for debug
        self.createClient(database_connection)

    def userExists(self, user_key: str):
        try:
            database = self.getDatabase(getenv("USERSDB"))
            users_data = self.getCollection(database, getenv("USERSDB_data"))
            user_exists = users_data.find_one({"firms_key" : user_key}, {"_id" : 1})
        except Exception as UserExistsException:
            raise Exception(f'GeoHeatDB User Exists exception: {UserExistsException}')
        else:
            if user_exists != None:
                return True
            else:
                return False

    def getUserData(self, user_key:str):
        try:
            database = self.getDatabase(getenv("USERSDB"))
            users_data = self.getCollection(database, getenv("USERSDB_data"))
            currentUser = users_data.find_one({"firms_key" : user_key}, {"_id" : 0})
        except Exception as GetUserException:
            raise Exception(f'GeoHeatDB Get User exception: {GetUserException}')
        else:
            if currentUser != None:
                return currentUser
            else:
                return None

    def addUser(self, user_information:dict):
        try:
            user_complete_collection = self.__completeUserData(user_information)
            database = self.getDatabase(getenv("USERSDB"))
            users_data = self.getCollection(database, getenv("USERSDB_data"))
            users_data.insert_one(user_complete_collection)
        except Exception as addUserException:
            raise Exception(f'GeoHeatDB Add User exception: {addUserException}')
        else:
            return True
        
    def __completeUserData(self, uncompleted_collection:dict):
        user_lights, user_textures = self.getThreeJSData()
        uncompleted_collection["threejs_configuration"] = {
                "textures" : user_textures,
                "lights" : user_lights
            }
        return uncompleted_collection
        
    def getThreeJSData(self):
        try:
            database = self.getDatabase(getenv("THREEJSDB"))
            lights_cursor = self.getCollection(database, getenv("THREEJSDB_lights")).find({}, {'_id': 0})
            textures_cursor = self.getCollection(database, getenv("THREEJSDB_textures")).find({}, {'_id': 0})
        except Exception as getThreeJSDataException:
            raise Exception(f'GeoHeatDB Get ThreeJS Data exception: {getThreeJSDataException}')
        else:
            try:
                lights = [item for item in lights_cursor]
                textures = [item for item in textures_cursor]
            except Exception as JSONException:
                raise Exception(f'GeoHeatDB Get ThreeJS Data JSON exception: {JSONException}')
            else:
                return lights, textures

    def getRequestData(self):
        try:
            database = self.getDatabase(getenv("REQUESTDB"))
            countries_cursor = self.getCollection(database, getenv("REQUESTDB_countries")).find({}, {'_id': 0})
            firms_cursor = self.getCollection(database, getenv("REQUESTDB_firms")).find({}, {'_id': 0})
            areas_cursor = self.getCollection(database, getenv("REQUESTDB_areas")).find({}, {'_id': 0})
        except Exception as getRequestDataException:
            raise Exception(f'GeoHeatDB Get Request Data exception: {getRequestDataException}')
        else:
            try:
                countries = [item for item in countries_cursor]
                firms = [item for item in firms_cursor]
                areas = [item for item in areas_cursor]
            except Exception as JSONException:
                raise Exception(f'GeoHeatDB Get Request Data JSON exception: {JSONException}')
            else:
                return countries, firms, areas

