import requests
import pandas as pd
import geopandas as gpd
import json
from shapely.geometry import MultiPoint, Point

class firmsAPI():

    area_dictionary = {
        'World':'-180,-90,180,90', 
        'Canada':'-150,40,-49,79', 
        'Alaska':'-180,50,-139,72', 
        'USA_Hawaii':'-160.5,17.5,-63.8,50', 
        'Central_America':'-119.5,7,-58.5,33.5', 
        'South_America':'-112,-60,-26,13', 
        'Europe':'-26,34,35,82',
        'North_Central_Africa':'-27,-10,52,37.5',
        'South_Africa':'10,-36,58.5,-4', 
        'Russia_Asia':'26,9,180,83.5', 
        'South_Asia':'54,5.5,102,40', 
        'South_East_Asia':'88,-12,163,31', 
        'Australia_NewZealand':'110,-55,180,-10'
    }


    def __init__(self):
        self.__api_key =  None
        self.__endpoint = 'https://firms.modaps.eosdis.nasa.gov/api/'


    # GETTERS
    def getEndpoint(self):
        return self.__endpoint
    

    def getAPIKEY(self):
        return self.__api_key


    # SETTER
    def setAPIKey(self, apikey: str):
        self.__api_key = apikey


    # Function to request information from url
    def __requestURL(self, url):
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
        

    # Function that checks the status of the API KEY
    def checkAPIKey(self, api_key):
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


    # Function that returns country box as dictionary
    def getSources(self, output_format = 'json'):
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
                    result = result.to_dict('records')
        return result
    

    # Private method, create new geodataframe with multi colum set as the geopandas geometry column
    def __toGeoPandas(self, json_data):
        try:
            data_copy = json_data.copy()
            for item in data_copy:
                values = item['geom'].replace('BOX','').replace(')','').replace('(','').replace(',',' ').split(' ')
                item['minLongitude'] = float(values[0])
                item['minLatitude'] = float(values[1])
                item['maxLongitude'] = float(values[2])
                item['maxLatitude'] = float(values[3])
            
            aux_df = pd.DataFrame(data_copy)
            aux_df.drop(['geom', 'id'], axis=1, inplace=True)
            aux_gdf = gpd.GeoDataFrame(aux_df, geometry=gpd.points_from_xy(aux_df.minLongitude, aux_df.minLatitude, crs="EPSG:4326"))
            aux_gdf['geometry2'] = [Point(x, y) for x, y in zip(aux_df.maxLongitude, aux_df.maxLatitude)]
            aux_gdf['BOX'] = [MultiPoint([x, y]) for x, y in zip(aux_gdf.geometry, aux_gdf.geometry2)]
            cleaned_gdf = aux_gdf.set_geometry('BOX').drop(['geometry', 'geometry2'], axis=1)

        except Exception as e:
            return f'GeoPandas conversion error: {e}'

        else:
            return cleaned_gdf
        

    # Function that returns country box as dictionary
    def getCountriesBox(self, output_format = 'geodataframe'):
        url = f'{self.__endpoint}countries/?format=json'
        result = self.__requestURL(url)
        if not isinstance(result, str):
            try:
                result = result.json()
            except Exception as e:
                result = f'Get Countries box error: {e}'
            else:
                if output_format == 'geodataframe':
                    result = self.__toGeoPandas(result)
        return result
        

    # Function that returns fire coordinates from country as dataframe
    def getCountryFire(self, country, source='VIIRS_SNPP_NRT', dayrange=1, date='', output_format = 'json'):
        url = f'{self.__endpoint}country/csv/{self.__api_key}/{source}/{country}/{dayrange}/{date}'
        result = self.__requestURL(url)
        if not isinstance(result, str):
            try:
                result = result.text.splitlines()
                result = pd.DataFrame(data = [row.split(',') for row in result[1:]], columns = result[0].split(','))
            except Exception as e:
                result = f'Get Country Fire error: {e}'
            else:
                if output_format == 'json':
                    result = result.to_dict('records')
        return result


    # Function that returns fire coordinates from area as dataframe
    def getAreaFire(self, area, source='VIIRS_SNPP_NRT', dayrange=1, date='', output_format = 'json'):
        area_coord = self.area_dictionary.get(area)
        if area_coord == None:
            return f'Get Area Fire error: invalid area value {area}'
        url = f'{self.__endpoint}area/csv/{self.__api_key}/{source}/{area_coord}/{dayrange}/{date}'
        result = self.__requestURL(url)
        if not isinstance(result, str):
            try:
                result = result.text.splitlines()
                result = pd.DataFrame(data = [row.split(',') for row in result[1:]], columns = result[0].split(','))
            except Exception as e:
                result = f'Get Area Fire error: {e}'
            else:
                if output_format == 'json':
                    result = result.to_dict('records')
        return result