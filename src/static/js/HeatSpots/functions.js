import { getFirmsData } from '../Fetch/functions.js'

/* ---------------------------- WORLD HEAT SPOTS ---------------------------- */
/* Set Request data to display on earth */
const setdataToRequest = (dayrange) => {

    const date = new Date();
    const dateRequested = date.toISOString().split("T")[0];
    const delimiter = "area";
    const time = date.toTimeString().slice(0, 8);
    const validUntil = new Date(date.setHours(23, 59, 59)).toUTCString();

    let location; 
    let location_name;
    let coordinates;
    let sources;

    firms_data["areas"].forEach(element => {
        if(element.name === "World"){
            location = element.value;
            location_name = element.name;
            coordinates = element.coordinates;
        }
    });

    firms_data["parameters"].forEach(element => {
        if(element.parameter === "source"){
            sources = [...element.values];
        }
    });

    const dataToRequest = [];
    sources.forEach(source => {
        dataToRequest.push({
            "delimiter" : delimiter,
            "date" : dateRequested,
            "source" : source,
            "location" : location,
            "location_name": location_name,
            "dayrange" : dayrange,
            "coordinates" : coordinates,
            "dateOfRequest" : dateRequested,
            "timeOfRequest" : time,
            "validUntil" : validUntil
        })
    });

    return dataToRequest
}

/* Request World data Heat Spots to display on earth */
function getHeatSpots(key, dataToRequest, arrayElements){
    dataToRequest.forEach(data => {
        getFirmsData(key, data).then((result) => {
            arrayElements.push(result);
            console.log(data, result);
            }
        ).catch(error => alert(error));
    });
}

/* ---------------------------- MAIN ---------------------------- */
export function HeatSpots(){

    /* Get user key to make the request */
    const userKey = user_data["threejs"]["firms_key"];

    /* Set data to make the request */
    const dataToRequest = setdataToRequest(1);
    
    /* Obtain World data to display on earth */
    const spotsArray = [];
    getHeatSpots(userKey, dataToRequest, spotsArray);
}