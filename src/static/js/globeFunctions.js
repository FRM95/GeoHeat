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
    let userData = {};
    let markMesh = new THREE.InstancedMesh(common_geo, common_mat, dataObject.length);
    for(let i = 0; i < dataObject.length; i++){
        dummy.position.x = dataObject[i].earth_cartesian.x;
        dummy.position.y = dataObject[i].earth_cartesian.y;
        dummy.position.z = dataObject[i].earth_cartesian.z;
        dummy.lookAt(dummy.position.clone().setLength(1.5));
        dummy.updateMatrix();
        markMesh.setMatrixAt(i, dummy.matrix);
        userData[i] = dataObject[i];
    }
    markMesh.userData = userData;
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


/* Display selected data fire point */
function displayFireData(dataObject, identifier){
    for(const[key, value] of Object.entries(dataObject)){
        const htmlElm = document.getElementById(key);
        const earthLabel = document.getElementById(key + 'Label');
        if(htmlElm){
            htmlElm.innerHTML = `<b>${key}</b>: ${value}`;
        }
        if(earthLabel){
            earthLabel.innerHTML = `<b>${key}</b>: ${value}`;
        }
    }
    document.getElementById('id').innerHTML = `<b>Id</b>: ${identifier}`;
    document.getElementById('idLabel').innerHTML = `<b>Id</b>: ${identifier}`;
}

export {processFireData, displayFireData, addCartesian, createMarkers}