from class_api import APIOperations

class Firms(APIOperations):

    def __init__(self) -> None:
        super().__init__()
        self.__baseEndpoint = 'https://firms.modaps.eosdis.nasa.gov/api/'

    # BASE METHOD TO INITIATE ENDPOINT
    def getBaseEndpoint(self) -> str:
        """Public Method: Returns base endpoint used for all operations"""
        return self.__baseEndpoint
    
    # BASE METHOD TO CHECK USER'S KEY'S
    def checkKey(self, key:str) -> (list|str):
        """Public Method: Check user key used for all operations"""
        private_endpoint = 'https://firms.modaps.eosdis.nasa.gov/mapserver/mapkey_status/'
        key_result = self.isValidKey(private_endpoint, key)
        return key_result

    # BASE METHOD TO OBTAIN COUNTRIES
    def getCountries(self) -> (list|str):
        """Public Method: Available countries to obtain NASA FIRMS information"""
        countries_url = self.getBaseEndpoint() + 'countries/'
        countries_result = self.getRequest(countries_url, params = {'format':'json'})
        if isinstance(countries_result, str):
            return countries_result
        else:
            return self.processResponse(countries_result)
    
    # BASE METHOD TO OBTAIN SOURCES
    def getSources(self, key:str) -> (list|str):
        """Public Method: Available sources to obtain NASA FIRMS information"""
        sources_url = self.getBaseEndpoint() + 'data_availability/csv/' + key + '/ALL'
        sources_result = self.getRequest(sources_url)
        if isinstance(sources_result, str):
            return sources_result
        else:
            return self.processTXT(sources_result)