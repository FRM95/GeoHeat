import * as fetch from "./functions.js"
import { createMarkers } from "../ThreeJS/main.js"
import { displayHeatSpots } from "../Heatspots/functions.js"
import { meshPointers } from "../main.js"

const automaticParameters = () => {
    let location; 
    let coordinates;
    let result = null;
    for(let i = 0; i < firms_data["areas"].length; i++){
        const element = firms_data["areas"][i];
        if(element.name === "World"){
            location = element.value;
            coordinates = element.coordinates;
            result = { "delimiter" : "area", "date" : "", 
                "source" : "all", "location" : location, 
                "dayrange" : 2, "coordinates" : coordinates,
                "groupby" : "acq_date" };
            break
        }
    }
    return result
}

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

/* Display World data (automatic mode) */
export async function displayWorldData(scene){
    const worldParameters = automaticParameters();
    const response = await fetch.getHTTP(user_data["data"].firms_key, worldParameters);
    setMeshes(response);
    displayHeatSpots(scene);
}