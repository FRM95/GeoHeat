import * as THREE from "three";

/* Aux function to add cartesian points to object based on lat/long */
function coordToCartesian(coordinates, earth_radius){
    let latitude = coordinates.latitude;
    let longitude = coordinates.longitude;
    let phi = (90-latitude)*(Math.PI/180);
    let theta = (longitude+180)*(Math.PI/180);
    let x_point = -(earth_radius * Math.sin(phi)*Math.cos(theta));
    let y_point = (earth_radius * Math.cos(phi));
    let z_point = (earth_radius * Math.sin(phi)*Math.sin(theta));
    return {x:x_point,
            y:y_point,
            z:z_point}
}

/* Auxiliar function to iterate and call coordToCartesian function in object array */
function addCartesian(dataObject, earth_radius){
    if(dataObject['earth_cartesian'] == undefined){
        let pointObject = coordToCartesian(dataObject, earth_radius);
        dataObject.earth_cartesian = pointObject;
    }
}

/* Auxiliar function to create mesh based on object array */
function createMarkers(dataObject){
    const common_geo = new THREE.CircleGeometry(0.0015, 32);
    const common_mat = new THREE.MeshBasicMaterial({color:0xff0000});
    let dummy = new THREE.Object3D();
    let user_Data = {};
    let markMesh = new THREE.InstancedMesh(common_geo, common_mat, dataObject.length);
    for(let i = 0; i < dataObject.length; i++){
        dummy.position.x = dataObject[i].earth_cartesian.x;
        dummy.position.y = dataObject[i].earth_cartesian.y;
        dummy.position.z = dataObject[i].earth_cartesian.z;
        dummy.lookAt(dummy.position.clone().setLength(1.5));
        dummy.updateMatrix();
        markMesh.setMatrixAt(i, dummy.matrix);
        user_Data[i] = dataObject[i];
    }
    markMesh.userData = user_Data;
    return markMesh
}


/* Process user fire data, adds cartesian and mesh to each value */
function processFireData(userKey, dataObject, earth_radius, filterOptions = null){
    if(dataObject[userKey] == [] || (filterOptions != null && Object.keys(filterOptions).length < 1)){
        return []
    }
    let meshPointers = [];
    let dataArr = dataObject[userKey];
    for(let i = 0; i < dataArr.length; i++){
        let currData = dataArr[i];
        let firedata = currData['firedata'];
        if(filterOptions != null){
            let acceptedFires = [];
            if('date' in filterOptions && (filterOptions['date'].has(currData['date']) == false)){
                continue
            }
            if('source' in filterOptions && (filterOptions['source'].has(currData['source']) == false)){
                continue
            }
            for(let j = 0; j < firedata.length; j++){
                const currfireData = firedata[j];
                addCartesian(currfireData, earth_radius);
                if('region' in filterOptions && (filterOptions['region'].has(currfireData['region']) == false)){
                    continue
                }
                if('nasa_abreviation' in filterOptions && (filterOptions['nasa_abreviation'].has(currfireData['nasa_abreviation']) == false)){
                    continue
                }
                acceptedFires.push(currfireData);
            }
            if(acceptedFires.length > 0){
                const currMesh = createMarkers(acceptedFires);
                meshPointers.push(currMesh);
            }
        }
        else{
            for(let k = 0; k < firedata.length; k++){
                addCartesian(firedata[k], earth_radius);
            }
            const currMesh = createMarkers(firedata);
            meshPointers.push(currMesh);
        }
    }
    return meshPointers
}


const wikiLink = "https://en.wikipedia.org/wiki/";
const svgWiki = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wikipedia" viewBox="0 0 16 16"><path d="M8.835 3.003c.828-.006 2.688 0 2.688 0l.033.03v.288q0 .12-.133.12c-.433.02-.522.063-.68.29-.087.126-.258.393-.435.694l-1.52 2.843-.043.089 1.858 3.801.113.031 2.926-6.946q.152-.42-.044-.595c-.132-.114-.224-.18-.563-.195l-.275-.014a.16.16 0 0 1-.096-.035.1.1 0 0 1-.046-.084v-.289l.042-.03h3.306l.034.03v.29q0 .117-.133.117-.65.03-.962.281a1.64 1.64 0 0 0-.488.704s-2.691 6.16-3.612 8.208c-.353.672-.7.61-1.004-.019A224 224 0 0 1 8.044 8.81c-.623 1.285-1.475 3.026-1.898 3.81-.411.715-.75.622-1.02.019-.45-1.065-1.131-2.519-1.817-3.982-.735-1.569-1.475-3.149-1.943-4.272-.167-.4-.293-.657-.412-.759q-.18-.15-.746-.18Q0 3.421 0 3.341v-.303l.034-.03c.615-.003 3.594 0 3.594 0l.034.03v.288q0 .119-.15.118l-.375.016q-.483.02-.483.288-.002.125.109.4c.72 1.753 3.207 6.998 3.207 6.998l.091.023 1.603-3.197-.32-.71L6.24 5.095s-.213-.433-.286-.577l-.098-.196c-.387-.77-.411-.82-.865-.88-.137-.017-.208-.035-.208-.102v-.304l.041-.03h2.853l.075.024v.303q0 .104-.15.104l-.206.03c-.523.04-.438.254-.09.946l1.057 2.163 1.17-2.332c.195-.427.155-.534.074-.633-.046-.055-.202-.144-.54-.158l-.133-.015a.16.16 0 0 1-.096-.034.1.1 0 0 1-.045-.085v-.288l.041-.03Z"/></svg>'
const instrumentLink = "https://www.earthdata.nasa.gov/learn/find-data/near-real-time/";

const questionSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'
const landsat = 'https://www.earthdata.nasa.gov/faq/firms-faq#ed-landsat-fires-attributes';
const modis = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/mcd14dl-nrt#ed-firms-attributes';
const viirs = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/vnp14imgtdlnrt#ed-viirs-375m-attributes';
const noaa20 = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/vj114imgtdlnrt';
const noaa21 = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/vj214imgtdlnrt';

const checkSatellite = (name) => {
    let returnLink = null;
    switch (name) {
        case 'L8':
            returnLink = landsat;
            break
        case 'L9':
            returnLink = landsat;
            break
        case 'Aqua':
            returnLink = modis;
            break
        case 'Terra':
            returnLink = modis;
            break
        case 'N':
            returnLink = viirs;
            break
        case 'N20':
            returnLink = noaa20;
            break
        case 'N21':
            returnLink = noaa21;
            break
    }
    return returnLink
}

/* Display selected data fire point */
function displayFireData(dataObject, identifier){

    const markers = document.getElementsByClassName('marker-info');
    for(let i = 0; i< markers.length; i++){
        markers[i].ariaHidden = "true";
        markers[i].innerHTML = "";
    }

    for(const[key, value] of Object.entries(dataObject)){
        const htmlElm = document.getElementById(key);
        const earthLabel = document.getElementById(key + 'Label');

        if(htmlElm){
            if(key == 'country'){
                const wikiRef = `<a target="_blank" href="${wikiLink}${value}" class="link-url">${svgWiki}</a>`;
                htmlElm.innerHTML = `<b>${key}:</b> ${value} ${wikiRef}`;
            }
            else if(key == 'instrument'){
                const intrumentRef = `<a target="_blank" href="${instrumentLink}${value}" class="link-url">${value}</a>`;
                htmlElm.innerHTML = `<b>${key}:</b> ${intrumentRef}`;
            }
            else if(key == 'satellite'){
                htmlElm.innerHTML = `<b>${key}:</b> ${value}`;
                const attrLink = checkSatellite(value);
                if(attrLink != null){
                    const satelliteRef = `<a target="_blank" href="${attrLink}" class="link-url" style="display: inherit;gap: 0.5em; align-items: center;">Official attributes description ${questionSVG}</a>`;
                    const htmlAttr = document.getElementById('spot_attributes');
                    htmlAttr.innerHTML = satelliteRef;
                    htmlAttr.ariaHidden = "false";
                }
            }
            else{
                htmlElm.innerHTML = `<b>${key}:</b> ${value}`;
            }
            htmlElm.ariaHidden = "false";
        }

        if(earthLabel){
            earthLabel.innerHTML = `<b>${key}:</b> ${value}`;
        }
    }

    document.getElementById('id').ariaHidden = "false";
    document.getElementById('id').innerHTML = `<b>Id:</b> ${identifier}`;
    document.getElementById('idLabel').innerHTML = `<b>Id</b>: ${identifier}`;
}


export {processFireData, displayFireData, addCartesian, createMarkers}