from requests import exceptions, Response, get, post, JSONDecodeError
from pandas import DataFrame
from modules.nasa_config import NASA_TYPES
from geopandas import GeoDataFrame, points_from_xy, sjoin, read_file
from datetime import datetime

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
            for key, value in NASA_TYPES.items():
                if key in dataframe:
                    dataframe = dataframe.astype({key:value})
        except Exception as e:
            return f'Dataframe Encode exception: {e}'
        else:
            return dataframe

    def mergeCountry(self, area_data) -> (list|str):
        if isinstance(area_data, DataFrame):
            try:
                geodataframe = GeoDataFrame(area_data, geometry=points_from_xy(area_data.longitude, area_data.latitude), crs="EPSG:4326")
                world_data = read_file('./data/world_data.geojson', driver='GeoJSON')
                geodataframe = sjoin(geodataframe, world_data, how='left')
                geodataframe = geodataframe.drop(columns=['country_id','index_right', 'geometry'], errors = 'ignore')
                geodataframe = geodataframe.fillna('unknown')
                geodataframe = geodataframe.reset_index(drop=True)
            except Exception as e:
                return f'Geodataframe Merge exception: {e}'
            else:
                return geodataframe.to_dict('records')
        else:
            return area_data
        
    def isvalidRequest(self, data:dict) -> (dict|str):
        result_data = {}
        for key, value in data.items():
            match key:
                case 'delimiter':
                    if(value!='country' and value!='area'):
                        return f'Invalid delimiter value: {value}'
                    else:
                        result_data['delimiter'] = value

                case 'zone':
                    if(not isinstance(value, str)):
                        return f'Invalid zone value: {value}'
                    result_data['zone'] = value

                case 'source':
                    if(not isinstance(value, str)):
                        return f'Invalid source value: {value}'
                    result_data['source'] = value

                case 'dayrange':
                    if(not isinstance(value, str) or not value.isnumeric()):
                        return f'Invalid range value: {value}'
                    try:
                        updated_val = int(value)
                    except:
                        return f'Invalid range value: {value}'
                    else:
                        if updated_val < 1 or updated_val > 10:
                            return f'Invalid range value: {value}'
                    result_data['dayrange'] = updated_val

                case 'date':
                    if(not isinstance(value, str)):
                        return f'Invalid date value: {value}'
                    try:
                        bool(datetime.strptime(value, "%Y-%m-%d"))
                    except:
                        return f'Invalid date value: {value}'
                    result_data['date'] = value

        return result_data
    
    def createJSON(self, userKey, fireData, **kwargs):
        try:
            json_data = {userKey : [
                    {"date":kwargs.get('date'),
                    "source":kwargs.get('source'),
                    "delimiter":kwargs.get('delimiter'),
                    "zone":kwargs.get('zone'),
                    "dayrange":kwargs.get('dayrange'),
                    "firedata":fireData}
                    ]
                }
        except Exception as e:
            return f'JSON creation exception: {e}'
        else:
            return json_data


    