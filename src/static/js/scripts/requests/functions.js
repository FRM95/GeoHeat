import { notificationHandler } from '../UX/notifications.js'
import { getFirmsData } from '../fetch/functions.js'

/* Request data fetch Functions */

/* Selected data to request */
const dataToRequest = (requestClassNodes) => {
    let result = {};
    let date = new Date();
    for(let i = 0; i < requestClassNodes.length; i++){
        const selection = requestClassNodes[i];
        if (!selection.classList.contains("hidden")){
            const property = selection.getAttribute('property');
            result[property] = selection.value;
            if(property === "location"){
                const options = selection.options[selection.selectedIndex];
                result['coordinates'] = options.dataset.coordinates;
                result['location_name'] = options.dataset['location_name'];
                const area_name = options.dataset['area_name'] == undefined ? null : options.dataset['area_name'];
                result['area_name'] = area_name;
            }
        }
    }
    result['time'] = date.toTimeString().slice(0, 8);
    result['validUntil'] = new Date(date.setHours(23, 59, 59)).toUTCString();
    return result
}

/* Set the query paramters to create the URL */
const setQueryParameters = (requestObject) => {
    let queryParams = {}
    try { 
        queryParams['delimiter'] = requestObject['delimiter']
        queryParams['location'] = requestObject['location']
        queryParams['source'] = requestObject['source']
        queryParams['dayrange'] = requestObject['dayrange']
        queryParams['date'] = requestObject['date']
    } catch (error) {
        return error
    }
    return queryParams
}

/* Make a new request */
export async function requestData(key, data = null){
    if(data == null){
        const classNodes = document.getElementsByClassName("request-parameter");
        if(classNodes != null) {
            data = dataToRequest(classNodes);
        } else {
            return 'Error'
        }
    }
    const urlParams = setQueryParameters(data);
    const response = await getFirmsData(key, urlParams);
    data["heatspots"] = response
    return data
}