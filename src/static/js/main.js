import {createRenderer, setCamera, setControls, Earth, addCartesian, createMarkers, setLabelAttributes, THREE, CSS2DRenderer, CSS2DObject} from './threeJSFunctions.js';
import {applyAreaFilter, applyCountryFilter, getCountries} from './clientFunctions.js';

function main(){

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('container-canvas');
    container.appendChild(renderer.domElement);

    // Label Render
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width,height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    container.appendChild(labelRenderer.domElement);

    // Camera creation
    const camera = setCamera(75, width/height, 0.1, 10, 0, 0, 3);

    // Scene creation
    const scene = new THREE.Scene();

    // Controls creation
    const orbitControls = setControls(camera, labelRenderer.domElement, true, 0.03, false);
    orbitControls.autoRotate = true;
    orbitControls.autoRotateSpeed = 1.75;
    orbitControls.minDistance = 1.15;
    orbitControls.maxDistance = 3;

    // Auto rotate speed functionality
    labelRenderer.domElement.addEventListener("click", event => {
        orbitControls.autoRotateSpeed = (Math.log(orbitControls.getDistance()) - Math.log(orbitControls.minDistance)) * 1.75; 
    });

    // Earth creation
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const earth_radius = 1;
    const earth = Earth(earth_radius, 64, 32, material, "./static/textures/earthmap10k.jpg");
    scene.add(earth);

    // Add cartesian points based on earth radius
    addCartesian(initial_data, earth_radius);

    // Add points to scene
    var filteredIds = [];
    var filterObject = {};
    var current_marks_mesh = createMarkers(initial_data, filteredIds);
    scene.add(current_marks_mesh);

    // Mark information functionality
    let labelDivInfo = document.getElementById("markerInformation");
    let closeBtn = document.getElementById("closeButton");
    closeBtn.addEventListener("pointerdown", event => {
      labelDiv.classList.add("hidden");
      labelDivInfo.classList.add("hidden");
    })

    // Globe mark label functionality
    let labelDiv = document.getElementById("markerLabel");
    let label = new CSS2DObject(labelDiv);
    setLabelAttributes(label, earth, camera)
    scene.add(label);

    // Filters creation
    applyAreaFilter(available_areas, available_countries);
    applyCountryFilter(available_countries);

    let saveFilter = document.getElementById("save-filter");
    saveFilter.addEventListener("click", event => {
        filterObject["countries"] = getCountries("area-filter", "country-filter");
    });

    // // autofilter country
    // let filteredArea = document.getElementById("available-areas");
    // let filteredCountry = document.getElementById("available-countries");
    // let initialCountry = filteredCountry.value;
    // filteredArea.addEventListener("change", event => {
    //     let current_value = filteredArea.value;
    //     let new_value = null;
    //     if(current_value === "World"){
    //         for(let i = 0; i < filteredCountry.length; i++){
    //             filteredCountry[i].setAttribute("visible", "true");
    //         }
    //         filteredCountry.value = initialCountry;
    //     } else {
    //         for(let i = 1; i < filteredCountry.length; i++){
    //             if(filteredCountry[i].getAttribute('subregion') != filteredArea.value) {
    //                 filteredCountry[i].setAttribute("visible", "false");
    //             }
    //             else {
    //                 if(new_value==null){
    //                     new_value = filteredCountry[i].value;
    //                 }
    //                 filteredCountry[i].setAttribute("visible", "true");
    //             }
    //         }
    //         filteredCountry.value = new_value;
    //     }
    // });

    // filteredCountry.addEventListener("change", event => {
    //     let currentCountry = filteredCountry.value;
    //     if(currentCountry != "All"){
    //         let options = filteredCountry.querySelectorAll(`option[value="${currentCountry}"]`)
    //         filteredArea.value = options[0].getAttribute('subregion');
    //     }
    // });

    

        // let areaFilter = document.getElementById("area-filter");
        // let countryFilter = document.getElementById("country-filter");
        // let dateFilter = document.getElementById("date-filter");
        // let timeFilter = document.getElementById("time-filter");
        // let sourceFilter = document.getElementById("source-filter");
        // let confidenceFilter = document.getElementById("confidence-filter");
        
        // if (newArea!='World'){
        //     if (newCountry === 'All'){
        //         Object.values(initial_data).forEach(
        //             value => {
        //                 if (value.SUBREGION === newArea){
        //                     filteredIds.push(iterator);
        //                     }
        //                 iterator++;
        //             }
        //         );
        //     } else {
        //         Object.values(initial_data).forEach(
        //             value => {
        //                 if (value.SUBREGION === newArea && value.WB_NAME === newCountry){
        //                     filteredIds.push(iterator);
        //                     }
        //                 iterator++;
        //             }
        //         );
        //     }
        //     if(filteredIds.length > 0){
        //         current_marks_mesh.dispose();
        //         scene.remove(current_marks_mesh);
        //         labelDiv.classList.add("hidden");
        //         labelDivInfo.classList.add("hidden");
        //         current_marks_mesh = createMarkers(initial_data, filteredIds);
        //         scene.add(current_marks_mesh);
        //     }
        // }

    // let defaultButton = document.getElementById("default-filter");
    // defaultButton.addEventListener("click", event => {
    //     selectedFilters.innerHTML = "";
    //     current_marks_mesh.dispose();
    //     scene.remove(current_marks_mesh);
    //     labelDiv.classList.add("hidden");
    //     labelDivInfo.classList.add("hidden");
    //     filteredIds = [];
    //     current_marks_mesh = createMarkers(initial_data, filteredIds);
    //     scene.add(current_marks_mesh);
    // });

    // Intersect point with raycast
    let pointer = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    let intersections;

    // Label short information
    let markerIDAux = document.getElementById("markerIdAux");
    let markerLatAux = document.getElementById("markerLatitudeAux");
    let markerLongAux = document.getElementById("markerLongitudeAux");

    // Marker Country information
    let markerId = document.getElementById("markerId");
    let markerCountryName= document.getElementById("markerCountryName");
    let markerCountryFormalName = document.getElementById("markerCountryFormalName");
    let markerLatitude = document.getElementById("markerLatitude");
    let markerLongitude = document.getElementById("markerLongitude");
    let markerCountryISOA3= document.getElementById("markerCountryISOA3");
    let markerCountryISOA2= document.getElementById("markerCountryISOA2");
    let markerRegion = document.getElementById("markerRegion");
    let markerSubRegion = document.getElementById("markerSubRegion");
    let markerContinent = document.getElementById("markerContinent");
    let markerType = document.getElementById("markerType");

    // Marker NASA information
    let markerdayNight= document.getElementById("markerdayNight");
    let markerSatellite= document.getElementById("markerSatellite");
    let markerConfidence = document.getElementById("markerConfidence");
    let markerBright_ti4 = document.getElementById("markerBright_ti4");
    let markerBright_ti5 = document.getElementById("markerBright_ti5");
    let markerScan = document.getElementById("markerScan");
    let markerTrack = document.getElementById("markerTrack");

    labelRenderer.domElement.addEventListener("pointerdown", event => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        intersections = raycaster.intersectObject(current_marks_mesh, true);
        if (intersections.length > 0){
            let meshId = intersections[0].instanceId;
            let dataId = intersections[0].object.userData[meshId];
            let markInformation = initial_data[dataId];

            markerIDAux.innerHTML = `ID: <b>${dataId}</b>`;
            markerLatAux.innerHTML = `Latitude: <b>${markInformation.latitude}</b>`;
            markerLongAux.innerHTML = `Longitude: <b>${markInformation.longitude}</b>`;

            markerId.innerHTML = `ID: <b>${dataId}</b>`;
            markerLatitude.innerHTML = `Latitude: <b>${markInformation.latitude}</b>`;
            markerLongitude.innerHTML = `Longitude: <b>${markInformation.longitude}</b>`;
            markerCountryName.innerHTML = `Country name: <b>${markInformation.WB_NAME}</b>`;
            markerCountryFormalName.innerHTML = `Formal name: <b>${markInformation.FORMAL_EN}</b>`;
            markerCountryISOA3.innerHTML = `Country ISO-A3: <b>${markInformation.ISO_A3}</b>`;
            markerCountryISOA2.innerHTML = `Country ISO-A2: <b>${markInformation.ISO_A2}</b>`;
            markerRegion.innerHTML = `Region: <b>${markInformation.REGION_UN}</b>`;
            markerSubRegion.innerHTML = `Sub-Region: <b>${markInformation.SUBREGION}</b>`;
            markerContinent.innerHTML = `Continent: <b>${markInformation.CONTINENT}</b>`;
            markerType.innerHTML = `Type: <b>${markInformation.TYPE}</b>`;

            markerdayNight.innerHTML = `Time adquisiton: <b>${markInformation.daynight}</b>`;
            markerSatellite.innerHTML = `Satellite: <b>${markInformation.satellite}</b>`;
            markerConfidence.innerHTML = `Confidence: <b>${markInformation.confidence}</b>`;
            markerBright_ti4.innerHTML = `Bright Ti 4: <b>${markInformation.bright_ti4}</b>`;
            markerBright_ti5.innerHTML = `Bright Ti 5: <b>${markInformation.bright_ti5}</b>`;
            markerScan.innerHTML = `Scan: <b>${markInformation.scan}</b>`;
            markerTrack.innerHTML = `Scan: <b>${markInformation.track}</b>`;

            label.position.set(intersections[0].point.x, intersections[0].point.y, intersections[0].point.z);
            label.element.classList.remove("hidden");
            labelDivInfo.classList.remove("hidden");
        }
    });

    const onWindowResize=() => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
        labelRenderer.setSize(innerWidth, innerHeight);
    }

    window.addEventListener("resize", onWindowResize);
    
    function animate(){
        requestAnimationFrame(animate);
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        orbitControls.update();
        label.userData.trackVisibility();
    }

    animate();
}

window.addEventListener("load", function () {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});
