/* Set the query parameters to create */
const queryParameters = (requestObject) => {
    const queryParams = {}
    try { 
        queryParams['delimiter'] = requestObject['delimiter']
        queryParams['location'] = requestObject['location']
        queryParams['source'] = requestObject['source']
        queryParams['dayrange'] = requestObject['dayrange']
        queryParams['date'] = requestObject['date']
        if('groupby' in requestObject){
            queryParams['groupby'] = requestObject['groupby']
        }
    } catch (error) {
        return error
    }
    return queryParams
}

/* GET method */
export async function getHTTP(userkey, params){
    try {
        const queryParams = queryParameters(params);
        let urlParams = "";
        urlParams += '?' + (new URLSearchParams(queryParams)).toString();
        const url = `/getFirmsData/${userkey}/` + urlParams;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
                }
            });
        return await response.json();
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}

/* POST method */
export async function postHTTP(userkey, params, objectBody){
    try {
        let urlParams = "";
        urlParams += '?' + (new URLSearchParams(params)).toString();
        const url = `/addUserData/${userkey}/` + urlParams;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(objectBody),
            headers: {
              'Content-Type': 'application/json',
                }
            });
        return await response.text();
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}

/* PUT method */
export async function putHTTP(userkey, params, objectBody){
    try {
        let urlParams = "";
        urlParams += '?' + (new URLSearchParams(params)).toString();
        const url = `/updateUserData/${userkey}/` + urlParams;
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(objectBody),
            headers: {
              'Content-Type': 'application/json',
                }
            });
        return await response.text();
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}