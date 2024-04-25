import requests
import pandas as pd
import geopandas as gpd
import json
from shapely.geometry import MultiPoint, Point
from modules.nasa_config import NASA_AREA, NASA_TYPES

class firmsAPI():

    # CONSTRUCTOR
    def __init__(self):
        self.__api_key =  None
        self.world_boundaries = None
        self.__endpoint = 'https://firms.modaps.eosdis.nasa.gov/api/'


    # GETTERS
    def getEndpoint(self) -> str:
        return self.__endpoint
    
    def getAPIKEY(self) -> str:
        return self.__api_key
    

    # SETTERS
    def setAPIKey(self, apikey: str) -> None:
        self.__api_key = apikey


    # INSTANCE METHODS
    def checkAPIKey(self, api_key) -> (None|str):
        if api_key == None:
            return 'Invalid NASA FIRMS API-Key, current value is null'
        else:
            url = f'https://firms.modaps.eosdis.nasa.gov/mapserver/mapkey_status/?MAP_KEY={api_key}'
            result = self.__requestURL(url)
            if not isinstance(result, str):
                try:
                    result = result.json()
                except json.JSONDecodeError:
                    result = result.text
                except Exception as e:
                    result = f'NASA FIRMS API-Key check error: {e}'
                else:
                    self.__api_key = api_key
            return result
        
    def getNASACountries(self, output_format='Dataframe') -> (pd.DataFrame|dict|str):
        url = f'{self.__endpoint}countries/?format=json'
        result = self.__requestURL(url)
        if not isinstance(result, str):
            try:
                result = result.json()
                result = pd.DataFrame(result)
                result = result.drop('id', axis=1)
                result = result.rename(columns={'geom': 'nasa_geometry', 'abreviation' : 'nasa_abreviation', 'name':'nasa_name'})
            except Exception as e:
                result = f'Get NASA Countries exception: {e}'
            else:
                if output_format == 'json':
                    result = result.to_dict('index')
        return result

    def getSources(self, output_format = 'json') -> (pd.DataFrame|dict|str):
        url = f'{self.__endpoint}data_availability/csv/{self.__api_key}/ALL'
        result = self.__requestURL(url)
        if not isinstance(result, str):
            try:
                result = result.text.splitlines()
                result = pd.DataFrame(data = [row.split(',') for row in result[1:]], columns = result[0].split(','))
            except Exception as e:
                result = f'Sources error: {e}'
            else:
                if output_format == 'json':
                    result = result.to_dict('index')
        return result

    def getCountryFire(self, country, source='VIIRS_SNPP_NRT', dayrange=1, date='', output_format = 'json'):
        url = f'{self.__endpoint}country/csv/{self.__api_key}/{source}/{country}/{dayrange}/{date}'
        result = self.__requestURL(url)
        processed_result = self.__getFires(result, 'Get Country Fire error:', output_format)
        return processed_result

    def getAreaFire(self, area, source='VIIRS_SNPP_NRT', dayrange=1, date='', output_format = 'json'):
        area_coord = NASA_AREA.get(area)
        if area_coord == None:
            return f'Get Area Fire error: invalid area value {area}'
        url = f'{self.__endpoint}area/csv/{self.__api_key}/{source}/{area_coord}/{dayrange}/{date}'
        result = self.__requestURL(url)
        processed_result = self.__getFires(result, 'Get Area Fire error:', output_format)
        return processed_result


    # PRIVATE METHODS
    def __requestURL(self, url) -> (requests.Response|str):
        try:
            api_response = requests.get(url=url, timeout=40, stream=True)
            api_response.raise_for_status()
        except requests.exceptions.HTTPError as ex:
            return f'Error: {ex} has occurred!'
        except requests.exceptions.ConnectionError as ex:
            return f'Error: {ex} has occurred!'
        except requests.exceptions.Timeout as ex:
            return f'Error: {ex} has occurred!'
        except requests.exceptions.RequestException as ex:
            return f'Error: {ex} has occurred!'
        except Exception as ex:
            return f'Error: {ex} has occurred!'
        else:
            return api_response
        
    def __obtainCountry(self, df) -> (gpd.GeoDataFrame|str):
        try:
            df_geometry = gpd.GeoDataFrame(df, geometry=gpd.points_from_xy(df.longitude, df.latitude), crs="EPSG:4326")
            joined_gpd = gpd.sjoin(df_geometry, self.world_boundaries, how='left')
            joined_gpd = joined_gpd.reset_index(drop=True)
            joined_gpd = joined_gpd.drop(columns=['geometry','index_right','nasa_geometry'])
        except Exception as e:
            return f'GeoPandas conversion error: {e}'
        else:
            return joined_gpd
    
    def __getFires(self, result, output_err, output_format = 'json') -> (gpd.GeoDataFrame|dict|str):
        if not isinstance(result, str):
            try:
                result = result.text.splitlines()
                result = pd.DataFrame(data = [row.split(',') for row in result[1:]], columns = result[0].split(','))
                result = result.dropna()
                result['acq_date'] = result['acq_date'].apply(lambda x: "/".join(x.split('-')[::-1]))
                result = result.astype(NASA_TYPES)
                result = self.__obtainCountry(result)
            except Exception as e:
                result = output_err + f' {e}'
            else:
                if output_format == 'json':
                    result = result.to_dict('index')
        return result
        

    # Private method, replace Box column (string format) to Multipoint column (geometry format)
    # def __addMultipoint(self, json_data) -> (gpd.GeoDataFrame|str):
    #     try:
    #         data_copy = json_data.copy()
    #         for item in data_copy:
    #             values = item['geom'].replace('BOX','').replace(')','').replace('(','').replace(',',' ').split(' ')
    #             item['minLongitude'] = float(values[0])
    #             item['minLatitude'] = float(values[1])
    #             item['maxLongitude'] = float(values[2])
    #             item['maxLatitude'] = float(values[3])
            
    #         aux_df = pd.DataFrame(data_copy)
    #         aux_df.drop(['geom', 'id'], axis=1, inplace=True)
    #         aux_gdf = gpd.GeoDataFrame(aux_df, geometry=gpd.points_from_xy(aux_df.minLongitude, aux_df.minLatitude, crs="EPSG:4326"))
    #         aux_gdf['geometry2'] = [Point(x, y) for x, y in zip(aux_df.maxLongitude, aux_df.maxLatitude)]
    #         aux_gdf['BOX'] = [MultiPoint([x, y]) for x, y in zip(aux_gdf.geometry, aux_gdf.geometry2)]
    #         cleaned_gdf = aux_gdf.set_geometry('BOX').drop(['geometry', 'geometry2'], axis=1)

    #     except Exception as e:
    #         return f'Multipoint conversion error: {e}'
    #     else:
    #         return cleaned_gdf
        