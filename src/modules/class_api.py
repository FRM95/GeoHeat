from requests import exceptions, Response, get, post, JSONDecodeError

class APIOperations():

    def isValidKey(self, endpoint:str, api_key:str, param_val:str = 'MAP_KEY') -> (list|str):
        if not isinstance(endpoint, str):
            return 'ENDPOINT Parameter exception: endpoint must be a string type'
        elif not isinstance(api_key, str):
            return 'KEY Parameter exception: api_key must be a string type'
        else:
            response = self.getRequest(endpoint, params = {param_val : api_key})
            if not isinstance(response, str):
                try:
                    response = response.json()
                except JSONDecodeError:
                    response = response.text
                except Exception as e:
                    response = f'KEY Unhandled exception: {e}'
                else:
                    response['key'] = api_key
                    response_processed = [response]
                    return response_processed
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
            keys = txt[0].split(',')
            response_processed = []
            for elem in txt[1:]:
                sub_arr = elem.split(',')
                new_dict = {}
                for index in range(len(sub_arr)):
                    new_dict[keys[index]] = sub_arr[index]
                response_processed.append(new_dict) 
        except Exception as e:
            return f'TEXT Decode exception: {e}'
        else:
            return response_processed
        
    