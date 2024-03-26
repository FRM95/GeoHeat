import requests
import pandas as pd

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

    # Function that returns country box as dictionary
    def getCountriesBox(self):
        url = f'{self.__endpoint}countries/?format=json'
        result = self.__requestURL(url)
        if not isinstance(result, str):
            try:
                result = result.json()
            except Exception as e:
                result = f'Countries box error: {e}'
            else:
                result_dict = {}
                for item in result:
                    abreviation = item.get('abreviation')
                    result_dict[abreviation] = {'name': item.get('name'),
                                                'geom':item.get('geom')}
                result = result_dict
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
                result = f'Sources error: {e}'
            else:
                if output_format == 'json':
                    result = result.to_dict('records')
        return result

    # Function that returns fire coordinates from area as dataframe
    def getAreaFire(self, area, source='VIIRS_SNPP_NRT', dayrange=1, date='', output_format = 'json'):
        area_coord = self.area_dictionary.get(area)
        if area_coord == None:
            return f'Error: invalid area value {area}'
        url = f'{self.__endpoint}area/csv/{self.__api_key}/{source}/{area_coord}/{dayrange}/{date}'
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