from pymongo import MongoClient, database

class MongoDB:

    def __init__(self) -> None:
        self.client_mongodb = None
    
    def createClient(self, uri: str):
        if(self.client_mongodb == None):
            try:
                createdClient = MongoClient(uri, connect = False)
            except Exception as ClientException:
                raise Exception(f'MongoDB Client exception: {ClientException}')
            else:
                self.client_mongodb = createdClient
            return self
        
    def getDatabase(self, databaseName: str, **kwargs):
        if(self.client_mongodb != None):
            try:
                database = self.client_mongodb.get_database(databaseName, **kwargs)
            except Exception as DBException:
                raise Exception(f'MongoDB Database exception: {DBException}')
            else:
                return database
        else: 
            raise Exception(f'MongoDB Client exception: Client is None')
        
    def getCollection(self, database: database.Database, collectionName: str, **kwargs):
        if(self.client_mongodb != None):
            try:
                collection = database.get_collection(collectionName, **kwargs)
            except Exception as CollectionException:
                raise Exception(f'MongoDB Collection exception: {CollectionException}')
            else:
                return collection
        else: 
            raise Exception(f'MongoDB Client exception: Client is None')
        
    def listCollections(self, database: database.Database, **kwargs):
        if(self.client_mongodb != None):
            try:
                collections = database.list_collection_names(**kwargs)
            except Exception as CollectionsException:
                raise Exception(f'MongoDB Collections exception: {CollectionsException}')
            else:
                return collections
        else: 
            raise Exception(f'MongoDB Client exception: Client is None')
        

