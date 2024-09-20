from modules.class_mongodb import MongoDB
from dotenv import load_dotenv
from os import getenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def setArrayFilters(variable: str = "name", d: dict = None) -> list:
    return [ { "elem.name" : d.get(variable) } ]

def nestedSet(queryValues: dict, dataValue: dict):
    setValue = f"{queryValues.get('array','')}.$[elem]."
    for key, value in dataValue.items():
        if(key != "name"):
            dictValue = { setValue + key : value}
    return dictValue

class GeoHeatDB(MongoDB):

    def __init__(self) -> None:
        super().__init__()
        self.username = getenv('MONGO_INITDB_ROOT_USERNAME')
        # self.host = getenv('MONGODB_HOST')
        self.host = 'localhost' # for debug
        database_connection = f"mongodb://{self.username}:{getenv('MONGO_INITDB_ROOT_PASSWORD')}@{self.host}:27018/?authSource=admin" # changed 27017 to 27018 for debug
        self.createClient(database_connection)

    #--------User methods --------#
    def existsUser(self, user_key: str) -> bool:
        try:
            collections_list = [getenv("USERSDB_data"), getenv("USERSDB_threejs")]
            user_exists = self.__getUserCollections(user_key, collections_list, 1)
        except Exception as UserExistsException:
            raise Exception(f'GeoHeatDB User Exists exception: {UserExistsException}')
        else:
            if user_exists != None:
                return True
            return False    
    
    def setNewUser(self, user_key:str, user_information:dict):
        try:
            default_data = self.__getDefaultCollections([getenv("THREEJSDB")])
            collection_info = user_information.copy()
            if default_data:
                database = self.getDatabase(getenv("USERSDB"))
                for name, colls in default_data.items():
                    user_collection = self.getCollection(database, name)
                    colls["firms_key"] = user_key
                    user_collection.insert_one(colls)
                user_collection = self.getCollection(database, getenv("USERSDB_data"))
                collection_info["firms_key"] = user_key
                user_collection.insert_one(collection_info)
            else:
                return False
        except Exception as addUserException:
            raise Exception(f'GeoHeatDB Add User exception: {addUserException}')
        else:
            return True    
        
    def getUserData(self, user_key:str):
        collections_list = [getenv("USERSDB_data"), getenv("USERSDB_threejs"), getenv("USERSDB_heatspots")]
        data = self.__getUserCollections(user_key, collections_list)
        if data:
            return data
        return None    
    
    def updateUserData(self, key: str, query: dict, data: dict|list):
            try:
                database = self.getDatabase(getenv("USERSDB"))
                users_data = self.getCollection(database, query.get("collection"))
                result = 0
                if 'array' in query:
                    for item in data:
                        item_result = users_data.update_one(
                            filter = {"firms_key" : key},
                            update = {"$set" : nestedSet(query, item)},
                            array_filters = setArrayFilters("name", item)
                        )
                        result += item_result.modified_count
                else:
                    item_result = users_data.update_one(
                        filter = {"firms_key" : key},
                        update = { "$set" : data }
                    )
                    result += item_result.modified_count
            except Exception as updateUserDataException:
                raise Exception(f'GeoHeatDB Update User Data exception: {updateUserDataException}')
            else:
                return f"Updated {result} documents"
    
    #--------General methods --------#
    def getFirmsData(self):
        try:
            databases = [getenv("FIRMSDB")]
            firms_data = self.__getDefaultCollections(databases)
        except Exception as getRequestDataException:
            raise Exception(f'GeoHeatDB Get Request Data exception: {getRequestDataException}')
        else:
            if firms_data:
                return firms_data.get('firms')
            else:
                return None

    #--------Private methods --------#
    def __getDefaultCollections(self, databases:list):
        try:
            default_collections = {}
            for db in databases:
                database = self.getDatabase(db)
                collections = self.listCollections(database)
                for name in collections:
                    default_collection = self.getCollection(database, name)
                    if default_collection != None:
                        data_cursor = default_collection.find({}, {'_id': 0}).sort({'name':1})
                        data = [item for item in data_cursor]
                        if database.name in default_collections:
                            values = default_collections.get(database.name)
                            values[name] = data
                        else:
                            default_collections[database.name] = {name : data}
                    else:
                        return None
        except Exception as CollectionsException:
            raise Exception(f'GeoHeatDB Get Default Collections exception: {CollectionsException}')
        else:
            return default_collections
  
    def __getUserCollections(self, user_key:str, user_collections:list, idOnly:int = 0) -> (dict|None):
        try:
            database = self.getDatabase(getenv("USERSDB"))
            user_collection = {}
            for name in user_collections:
                collection = self.getCollection(database, name)
                if collection != None:
                    collection_data = collection.find_one({"firms_key" : user_key}, {"_id" : idOnly})
                    if collection_data != None:
                        user_collection[name] = collection_data
                    else:
                        if name != getenv("USERSDB_heatspots"):
                            return None
                else:
                    return None
        except Exception as CollectionsException:
            raise Exception(f'GeoHeatDB Get User Collections exception: {CollectionsException}')
        else:
            return user_collection      
        
    # def addUserArray(self, key: str, array_field:str, data: dict):
    #     try:
    #         database = self.getDatabase(getenv("USERSDB"))
    #         users_data = self.getCollection(database, getenv("USERSDB_data"))
    #         item_result = users_data.update_one(
    #             filter = {"firms_key" : key},
    #             update = {"$push" : {
    #                     array_field : {
    #                         "$each" : [data],
    #                         "$sort" : { "full_utc_date" : 1 }
    #                     }
    #                 }
    #             }
    #         )
    #     except Exception as addUserArrayException:
    #         raise Exception(f'GeoHeatDB Push Array Data exception: {addUserArrayException}')
    #     else:
    #         return f"Updated {item_result.modified_count} documents"
