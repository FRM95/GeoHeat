from modules.class_mongodb import MongoDB
from bson.json_util import dumps
from os import getenv

class GeoHeatDB(MongoDB):

    def __init__(self) -> None:
        super().__init__()
        self.username = getenv('MONGO_INITDB_ROOT_USERNAME')
        self.host = getenv('MONGODB_HOST')
        database_connection = f"mongodb://{self.username}:{getenv('MONGO_INITDB_ROOT_PASSWORD')}@{self.host}:27017/?authSource=admin"
        self.createClient(database_connection)

    def addUser(self, user_information:dict):
        try:
            user_complete_collection = self.__completeUserData(user_information)
            database = self.getDatabase(getenv("USERSDB"))
            users_data = self.getCollection(database, getenv("USERSDB_data"))
            users_data.insert_one(user_complete_collection)
        except Exception as addUSerException:
            raise Exception(f'GeoHeatDB Add User exception: {addUSerException}')
        else:
            return 0
        
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
            lights = list(self.getCollection(database, getenv("THREEJSDB_lights")).find(projection={'_id': False}))
            textures = list(self.getCollection(database, getenv("THREEJSDB_textures")).find(projection={'_id': False}))
        except Exception as getThreeJSDataException:
            raise Exception(f'GeoHeatDB Get ThreeJS Data exception: {getThreeJSDataException}')
        else:
            try:
                lights_json = dumps(lights)
                textures_json = dumps(textures)
            except Exception as JSONException:
                raise Exception(f'GeoHeatDB Get ThreeJS Data JSON exception: {JSONException}')
            else:
                return lights_json, textures_json

    def getRequestData(self):
        try:
            database = self.getDatabase(getenv("REQUESTDB"))
            countries = list(self.getCollection(database, getenv("REQUESTDB_countries")).find(projection={'_id': False}))
            firms = list(self.getCollection(database, getenv("REQUESTDB_firms")).find(projection={'_id': False}))
            areas = list(self.getCollection(database, getenv("REQUESTDB_areas")).find(projection={'_id': False}))
        except Exception as getRequestDataException:
            raise Exception(f'GeoHeatDB Get Request Data exception: {getRequestDataException}')
        else:
            try:
                countries_json = dumps(countries)
                firms_json = dumps(firms)
                areas_json = dumps(areas)
            except Exception as JSONException:
                raise Exception(f'GeoHeatDB Get Request Data JSON exception: {JSONException}')
            else:
                return countries_json, firms_json, areas_json

