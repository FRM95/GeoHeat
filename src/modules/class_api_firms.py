from modules.class_api import APIOperations

class Firms(APIOperations):

    def __init__(self) -> None:
        super().__init__()
        self.__baseEndpoint = 'https://firms.modaps.eosdis.nasa.gov/api/'
    
    # BASE METHOD TO CHECK USER'S KEY'S
    def checkKey(self, key:str) -> (list|str):
        """Public Method: Check user key used for all operations"""
        private_endpoint = 'https://firms.modaps.eosdis.nasa.gov/mapserver/mapkey_status/'
        key_result = self.isValidKey(key, private_endpoint)
        return key_result

    # BASE METHOD TO OBTAIN COUNTRIES
    def getCountries(self) -> (list|str):
        """Public Method: Available countries to obtain NASA FIRMS information"""
        countries_url = self.__baseEndpoint + 'countries/'
        countries_result = self.getRequest(countries_url, params = {'format':'json'})
        if isinstance(countries_result, str):
            return countries_result
        else:
            return self.processResponse(countries_result)
    
    # BASE METHOD TO OBTAIN SOURCES
    def getSources(self, key:str) -> (list|str):
        """Public Method: Available sources to obtain NASA FIRMS information"""
        sources_url = self.__baseEndpoint + 'data_availability/csv/' + key + '/ALL'
        sources_result = self.getRequest(sources_url)
        if isinstance(sources_result, str):
            return sources_result
        else:
            return self.processTXT(sources_result)
    
    # BASE METHOD TO OBTAIN FIRES
    def getFires(self, key:str, **kwargs) -> (list|str):
        """Public Method: NASA FIRMS fires information based on area/country"""
        fires_url = self.createURL(key, self.__baseEndpoint, **kwargs)
        fires_result = self.getRequest(fires_url)
        if isinstance(fires_result, str):
            return fires_result
        else:
            fires_data = self.processTXT(fires_result)
            if isinstance(fires_data, str):
                return fires_data
            if kwargs.get('delimiter') == 'area':
                fires_data = self.toDataframe(fires_data)
                fires_data = self.mergeCountry(fires_data)
            return fires_data