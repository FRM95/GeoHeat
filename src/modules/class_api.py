from requests import exceptions, Response, get, post, JSONDecodeError
from pandas import DataFrame
from modules.nasa_config import NASA_TYPES
from geopandas import GeoDataFrame, points_from_xy, sjoin, read_file

class APIOperations():

    def isValidKey(self, api_key:str, endpoint:str, param_val:str = 'MAP_KEY') -> (list|str):
        if not isinstance(api_key, str):
            return 'Key TypeError exception: api_key parameter must be a string type'
        elif not isinstance(endpoint, str):
            return 'Endpoint TypeError exception: endpoint parameter must be a string type'
        else:
            response = self.getRequest(endpoint, params = {param_val : api_key})
            if not isinstance(response, str):
                try:
                    response = response.json()
                except JSONDecodeError:
                    response = response.text
                except Exception as e:
                    response = f'Key Unhandled exception: {e}'
            return response

    def getRequest(self, endpoint:str, **kwargs) -> (Response|str):
        try:
            response = get(url=endpoint, **kwargs)
            response.raise_for_status()
        except exceptions.HTTPError as ex:
            return f'GET HTTPError exception: {ex}'
        except exceptions.ConnectionError as ex:
            return f'GET ConnectionError exception: {ex}'
        except exceptions.Timeout as ex:
            return f'GET Timeout exception: {ex}'
        except exceptions.RequestException as ex:
            return f'GET Request exception: {ex}'
        except Exception as ex:
            return f'GET Unhandled exception: {ex}'
        else:
            return response
        
    def postRequest(self, endpoint:str, **kwargs) -> (Response|str):
        try:
            response = post(url=endpoint, **kwargs)
            response.raise_for_status()
        except exceptions.HTTPError as ex:
            return f'POST HTTPError exception: {ex}'
        except exceptions.ConnectionError as ex:
            return f'POST ConnectionError exception: {ex}'
        except exceptions.Timeout as ex:
            return f'POST Timeout exception: {ex}'
        except exceptions.RequestException as ex:
            return f'POST Request exception: {ex}'
        except Exception as ex:
            return f'POST Unhandled exception: {ex}'
        else:
            return response
        
    def processResponse(self, response: Response) -> (list|str):
        try:
            response_processed = response.json()
        except exceptions.JSONDecodeError as ex:
            return f'JSON Decode exception: {ex}'
        else:
            return response_processed
        
    def processTXT(self, response: Response) -> (list|str):
        try:
            txt = response.text.splitlines()
            if len(txt) <= 1:
                return 'Text Decode exception: No data available'
            keys = txt[0].split(',')
            response_processed = []
            for elem in txt[1:]:
                sub_arr = elem.split(',')
                new_dict = {}
                for index in range(len(sub_arr)):
                    new_dict[keys[index]] = sub_arr[index]
                response_processed.append(new_dict) 
        except Exception as e:
            return f'Text Decode exception: {e}'
        else:
            return response_processed
        
    def createURL(self, api_key:str, endpoint:str, **kwargs) -> (str):
        delimiter = kwargs.get('delimiter')
        zone = kwargs.get('zone')
        source = kwargs.get('source')
        dayrange = kwargs.get('dayrange')
        date = kwargs.get('date')
        url = f'{endpoint}{delimiter}/csv/{api_key}/{source}/{zone}/{dayrange}/{date}'
        return url
    
    def toDataframe(self, area_data:list) -> (DataFrame|str):
        try: 
            dataframe = DataFrame(area_data)
            dataframe['acq_date'] = dataframe['acq_date'].apply(lambda x: "/".join(x.split('-')[::-1]))
            dataframe = dataframe.astype(NASA_TYPES)
        except Exception as e:
            return f'Dataframe Encode exception: {e}'
        else:
            return dataframe

    def mergeCountry(self, area_data) -> (list|str):
        if isinstance(area_data, DataFrame):
            try:
                geodataframe = GeoDataFrame(area_data, geometry=points_from_xy(area_data.longitude, area_data.latitude), crs="EPSG:4326")
                world_data = read_file('../../data/world_data.geojson', driver='GeoJSON')
                geodataframe = sjoin(geodataframe, world_data, how='left')
                geodataframe = geodataframe.drop(columns=['index_right', 'geometry'])
                geodataframe = geodataframe.reset_index(drop=True)
            except Exception as e:
                return f'Geodataframe Merge exception: {e}'
            else:
                return geodataframe.to_dict('records')
        else:
            return area_data


    