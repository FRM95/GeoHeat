from modules.class_api import APIOperations
from geopandas import read_file
import threading
import time

class Firms(APIOperations):

    def __init__(self) -> None:
        super().__init__()
        self.__baseEndpoint = 'https://firms.modaps.eosdis.nasa.gov/api/'
    
    # BASE METHOD TO CHECK USER'S KEY'S
    def checkKey(self, key:str) -> (dict|str):
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
    def getFires(self, key:str, **kwargs) -> (dict|str):
        """Public Method: NASA FIRMS fires information based on area/country"""
        fires_url = self.createURL(key, self.__baseEndpoint, **kwargs)
        world_data = read_file('./data/world_data.geojson', driver='GeoJSON')

        if isinstance(fires_url, dict):
            threadsArray = []
            fires_data = {}

            def multiRequests(urlValue: str, source:str):
                fires_result = self.getRequest(urlValue)
                fires_list = self.processTXT(fires_result)
                if isinstance(fires_list, list):
                    fires_df = self.toDataframe(fires_list)
                    fires_df = self.mergeCountry(fires_df, world_data, kwargs.get('groupby'))
                    fires_data[source] = fires_df
                else:
                    fires_data[source] = fires_list
                print(f'Finalized')

            start_time = time.time()
            for source, url in fires_url.items():
                thread = threading.Thread(target=multiRequests, args=(url,source), daemon=True)
                threadsArray.append(thread)

            for thread in threadsArray:
                thread.start()
                print(f'Initiated {thread.name}')

            for thread in threadsArray:
                thread.join()
            end_time = time.time()
            print(f'Time taken: {end_time - start_time}')
            return fires_data

        else:
            fires_result = self.getRequest(fires_url)
            if isinstance(fires_result, str):
                return fires_result
            fires_list = self.processTXT(fires_result)
            if isinstance(fires_list, str):
                return fires_list
            fires_df = self.toDataframe(fires_list)
            fires_data = self.mergeCountry(fires_df, world_data, kwargs.get('groupby'))
            return fires_data