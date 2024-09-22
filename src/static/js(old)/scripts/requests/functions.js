import { notificationHandler } from '../UX/notifications.js'
import { getFirmsData } from '../fetch/functions.js'

/* Request data fetch Functions */

/* Set the unique data identifier */
const setUdid = (date, time, offset) => {
    let sumDate = 0; let sumTime = 0; let offsetNumber = Number(offset);
    date.split("-").map((element)=>{sumDate += Number(element)});
    time.split(":").map((element)=>{sumTime += Number(element)});
    sumTime = sumTime % 100 == sumTime ? "0" + String(sumTime) : String(sumTime);
    let sumOffset = offsetNumber % 10 == 0 ? String(offsetNumber) : "0" + offset; 
    const identifier = String(sumDate) + sumTime + sumOffset;
    return Number(identifier)
}

/* Selected data to request */
const dataToRequest = (requestClassNodes) => {
    let result = {};
    let date = new Date();
    for(let i = 0; i < requestClassNodes.length; i++){
        const selection = requestClassNodes[i];
        if(!selection.classList.contains("hidden")){
            const property = selection.getAttribute('property');
            result[property] = selection.value;
            if(property === "location"){
                const dataset = selection.options[selection.selectedIndex].dataset;
                result['coordinates'] = dataset.coordinates;
                result['location_name'] = dataset['location_name'];
                const parent = dataset['area_name'] == undefined ? dataset['location_name'] : dataset['area_name'];
                result['area_parent'] = parent;
            }
        }
    }
    // result['time'] = date.toTimeString().slice(0, 8);
    // result['validUntil'] = new Date(date.setHours(23, 59, 59)).toUTCString();
    // result['udid'] = setUdid(result['date'], result['time'], result['dayrange']);
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
export async function requestData(key, data){
    if(data == null){
        const classNodes = document.getElementsByClassName("request-parameter");
        if(classNodes != null) {
            data = dataToRequest(classNodes);
        } else {
            return 'Error'
        }
    } 
    const parentArea = data["area_parent"];
    const urlParams = setQueryParameters(data);
    const response = await getFirmsData(key, urlParams);
    data[parentArea] = response
    return data
}