import { getFirmsData } from '../Fetch/functions.js'
import { createMarkers, addObject, removeObject } from '../ThreeJS/functions.js'


/* ---------------------------- WORLD HEAT SPOTS ---------------------------- */
/* Set Request data to display heat spots on earth */
const heatSpotsParams = (dayrange) => {

    const date = new Date();
    const dateRequested = date.toISOString().split("T")[0];
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
/* Process requested World data by adding a Mesh to each data */
const setMeshes = (geoHeatObject) => {
    Object.values(geoHeatObject).forEach(source => {
        if(source instanceof Object){
            for(const[date, arraySpots] of Object.entries(source)){
                const mesh = createMarkers(arraySpots);
                source[date] = mesh;
            }
        }
    });
}

/* ---------------------------- FILTER MESHES ---------------------------- */
const setDatesFilter = (divElement, dataArray, dataObject, sceneObject, meshArray) => {
    for(let i = 0; i < dataArray.length; i++){
        const button = document.createElement("button");
        button.textContent = dataArray[i]["text"];
        button.setAttribute("data-value", dataArray[i]["value"]);
        button.setAttribute("data-selected", dataArray[i]["selected"]);
        button.className = "filter-dates";

        button.addEventListener("click", () => {
            if("meshes" in dataObject){
                const selected = button.getAttribute("data-selected");
                if(selected != true){
                    const dates = button.getAttribute("data-value").split(";");
                    const sources = document.querySelectorAll(".source-element-name");
                    removeObject(sceneObject, meshArray);
                    const meshes = [];
                    sources.forEach(source => {
                        const sourceName = source.getAttribute("data-value");
                        const dataSource = dataObject["heatspots"][sourceName];
                        if(dataSource instanceof Object){
                            let heatSpots = 0;
                            dates.forEach(date => {
                                heatSpots += dataSource[date].length;
                                meshes.push(dataObject["meshes"][sourceName][date])
                            });
                            const spotsNumber = document.getElementById(sourceName + '-heatspots-number');
                            spotsNumber.innerHTML = heatSpots;
                        }
                    });
                    addObject(sceneObject, meshes);
                    meshArray = meshes
                    const buttons = document.querySelectorAll(".filter-dates");
                    buttons.forEach(buttonElement => {
                        if(buttonElement != button){
                            buttonElement.setAttribute("selected", false);
                        } else {
                            buttonElement.setAttribute("selected", true);
                        }
                    })
                }
            }
        });

        divElement.appendChild(button);
    }
}

const setSourcesData = (divElement, dataArray) => {
    for(let i = 0; i < dataArray.length; i++){
        const sourceName = document.createElement("span");
        sourceName.setAttribute("data-value", dataArray[i]);
        sourceName.className = "source-element-name";
        sourceName.textContent = dataArray[i].replace(/_/g, " ");

        const meshLegend = document.createElement("div");
        meshLegend.className = "source-element-mesh-color";

        const heatSpots = document.createElement("span");
        heatSpots.textContent = "Heat Spots: "
        heatSpots.className = "source-element-heatspots";

        const numberHeatSpots = document.createElement("span");
        numberHeatSpots.id = dataArray[i] + '-heatspots-number';
        numberHeatSpots.setAttribute("data-value", 0);
        numberHeatSpots.textContent = 0;
        numberHeatSpots.className = "source-element-heatspots-number";

        const divSource = document.createElement("div");
        divSource.className = "source-element d-flex";
        divSource.append(sourceName, meshLegend, heatSpots, numberHeatSpots)
        divElement.appendChild(divSource);
    }
}

/* Set filter options for World data */
const setDropdownFilterOptions = (datesArray, sourcesArray, dataObject, sceneObject, meshArray) => { 
    const datesDiv = document.getElementById("dropdown_date");
    if(datesDiv != null){
        setDatesFilter(datesDiv, datesArray, dataObject, sceneObject, meshArray);
    }
    const sourcesDiv = document.getElementById("dropdown_source");
    if(sourcesDiv !=null){
        setSourcesData(sourcesDiv, sourcesArray);
    }
}

/* ---------------------------- MAIN ---------------------------- */
export async function HeatSpots(sceneObject){

    /* Get user key to make the request */
    const userKey = user_data["threejs"]["firms_key"];

    /* Set heat spots parameters to request */
    const last24HData = heatSpotsParams(2);

    /* Mesh pointers */
    let meshPointers = [];

    /* Add geoheat world data filter options */
    const today = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    const last24H = new Date(new Date().getTime() - (24 * 60 * 60 * 1000) - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    const dates = [{"value": today, "text": "Today", "selected": false}, {"value": `${today};${last24H}`, "text": "24 Hours", "selected": false}];
    const sources = ["VIIRS_SNPP_NRT", "VIIRS_SNPP_SP", "VIIRS_NOAA20_NRT", "VIIRS_NOAA21_NRT", "MODIS_NRT", "MODIS_SP", "LANDSAT_NRT"];
    setDropdownFilterOptions(dates, sources, last24HData, sceneObject, meshPointers);
    
    /* GeoHeat dict spots construction */
    const geoHeatObject = await getFirmsData(userKey, last24HData);

    /* Create meshes object for each source and date*/
    let meshObject = JSON.parse(JSON.stringify(geoHeatObject))
    setMeshes(meshObject);

    /* Add geoheat spots object to data */
    last24HData["heatspots"] = geoHeatObject;

    /* Add geoheat meshes object to data */
    last24HData["meshes"] = meshObject;
    console.log(last24HData);

    return last24HData
}