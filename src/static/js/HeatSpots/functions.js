import { getFirmsData } from '../Fetch/functions.js'
import { createMarkers, addObject, removeObject } from '../ThreeJS/functions.js'
import { meshPointers } from '../main.js'

/* ---------------------------- WORLD HEAT SPOTS ---------------------------- */
/* UTC DATE/TIME VARIABLES */
const date = new Date();
const last24H = new Date(date.setUTCDate(date.getUTCDate() - 1)).toISOString().slice(0, 10); 

/* Set Request data to display heat spots on earth */
const heatSpotsParams = (dayrange) => {

    const dateRequested = date.toISOString().slice(0, 10); /* UTC FORMAT */
    const delimiter = "area";
    const time = date.toTimeString().slice(0, 8);
    const validUntil = new Date(date.setHours(23, 59, 59)).toUTCString();

    let location; 
    let location_name;
    let coordinates;

    firms_data["areas"].forEach(element => {
        if(element.name === "World"){
            location = element.value;
            location_name = element.name;
            coordinates = element.coordinates;
        }
    });

    const dataToRequest = {
            "delimiter" : delimiter,
            "date" : "",
            "source" : "all",
            "location" : location,
            "location_name": location_name,
            "dayrange" : dayrange,
            "coordinates" : coordinates,
            "dateOfRequest" : dateRequested,
            "timeOfRequest" : time,
            "validUntil" : validUntil,
            "groupby" : "acq_date"
    };
    
    return dataToRequest
}

/* ---------------------------- MESHES ---------------------------- */
/* Create a mesh object (points material) for each fetched data */
const setMeshes = (geoHeatObject) => {
    for(const[sourceName, value] of Object.entries(geoHeatObject)){
        if(value instanceof Object){
            for(const[dateSource, arraySpots] of Object.entries(value)){
                const meshName = sourceName + '#' + dateSource;
                const mesh = createMarkers(arraySpots, meshName);
                meshPointers[meshName] = mesh;
            }
        }
    }
}

/* ---------------------------- FILTER MESHES ---------------------------- */
/* Extract sorted dates (descendant) from the fetched response */
const descendantDates = (dataObject) => {
    if("heatspots" in dataObject){
        const dateSet = new Set();
        Object.values(dataObject["heatspots"]).forEach(value => {
            if(value instanceof Object){
                Object.keys(value).forEach(date => dateSet.add(date));
            }
        });
        const unsortedArray = Array.from(dateSet);
        const sortedArray = unsortedArray.map((x) => new Date(x)).reverse().map((x) => x.toISOString().slice(0, 10)); 
        return sortedArray
    }
    return []
}

/* Construction of dateObject which is used to populate filter HTML element */
const createDateObject = (dateArray, dataObject) => {
    const returnObject = {
        "currentDay-spots": {  },
        "completeDay-spots" : {  },
        "filter-dates-info" : { }
    }
    if("heatspots" in dataObject){
        if(dateArray.length > 1){
            returnObject["currentDay-spots"]["data-value"] = dateArray[0];
            returnObject["completeDay-spots"]["data-value"] = dateArray[0] + ";" + dateArray[1];
            returnObject["filter-dates-info"]["UTC today:"] = new Date(dateArray[0]).toUTCString();
            returnObject["filter-dates-info"]["UTC yesterday:"] = new Date(dateArray[1]).toUTCString();
            returnObject["filter-dates-info"]["Local today:"] = new Date(dateArray[0]).toString();
            returnObject["filter-dates-info"]["Local yesterday:"] = new Date(dateArray[1]).toString();
            for(const [source, data] of Object.entries(dataObject["heatspots"])){
                const current = returnObject["currentDay-spots"];
                const complete = returnObject["completeDay-spots"];
                current[source] = 0
                complete[source] = 0
                if(data instanceof Object){
                    for(const [date, spots] of Object.entries(data)){
                        if(date === dateArray[0]){
                            current[source] += spots.length;
                            complete[source] += spots.length;
                        } 
                        else if (date === dateArray[1]){
                            complete[source] += spots.length;
                        }
                    }
                }
            }
        }
    }
    
    return returnObject
}

/* Update content of filter HTML element */
const updateFilterInfo = (dateObject) => {
    for(const [id, data] of Object.entries(dateObject)){
        const element = document.getElementById(id);
        if(element!= null){
            element.innerHTML = "";
            for(const [key, value] of Object.entries(data)){
                if(key != "data-value"){
                    const span = document.createElement("span");
                    span.className = "marker-label";
                    span.textContent = `${key} ${value}`;
                    element.appendChild(span);
                } else {
                    element.setAttribute("data-value", value);
                }
            }
        }
    }
}

/* Update current heat Spots mesh */
const updateSpotsinScene = (scene) => {
    const buttons = document.querySelectorAll(".filter-dates");
    buttons.forEach(button => {
        button.addEventListener("change", () => {
            const spotsDiv = document.getElementById(button.id + "-spots");
            if(spotsDiv!= null){
                removeObject(scene, meshPointers, true);
                const filterDate = spotsDiv.getAttribute("data-value").split(";");
                for(const [key, value] of Object.entries(meshPointers)){
                    if(filterDate.includes(key.split("#")[1])){
                        addObject(scene, value);
                    }
                }
            }
        })
    });
}


/* ---------------------------- MAIN ---------------------------- */
export async function RequestHeatSpots(scene){

    /* Set heat spots parameters to request */
    const last24HData = heatSpotsParams(2);
    
    /* Get user key to make the request */
    const userKey = user_data["threejs"]["firms_key"];

    /* Fetch world data with HTTP request */
    const geoHeatObject = await getFirmsData(userKey, last24HData);

    /* Add geoheat spots object to data */
    last24HData["heatspots"] = geoHeatObject;

    /* Removes previous values of meshPointers from scene and object*/
    for(let key in meshPointers){if(meshPointers.hasOwnProperty(key)){delete meshPointers[key];}}
    removeObject(scene, meshPointers, true);

    /* Creates a new mesh for every fetched source/date*/
    setMeshes(geoHeatObject);
    console.log(last24HData)
    console.log(meshPointers);

    /* Find out what dates we have downloaded */
    const sortedDates = descendantDates(last24HData);

    /* Add heat spots related to 'Today' date */
    for(const [key, value] of Object.entries(meshPointers)){
        if(key.split("#")[1] === sortedDates[0]){
            addObject(scene, value);
        }
    }

    /* Create a filter object to pass as data */
    const filterDateObject = createDateObject(sortedDates, last24HData);

    console.log(filterDateObject);

    /* Seed filter element with data */
    updateFilterInfo(filterDateObject);

    /* Update spots mesh functionality */
    updateSpotsinScene(scene);
}