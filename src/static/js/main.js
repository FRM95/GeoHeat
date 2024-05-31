import {createRenderer, setCamera, setControls, Earth, addCartesian, createMarkers, setLabelAttributes, THREE, CSS2DRenderer, CSS2DObject} from './threeJSFunctions.js';
import {setCheckbox, resetDefault, filteredOptions, applyFilter} from './filterFunctions.js';

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
    let currentData = [...initial_data];
    console.log(currentData);
    addCartesian(currentData, earth_radius);

    // Add points to scene
    var current_marks_mesh = createMarkers(currentData);
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
    setCheckbox(available_areas, 'area-filter', 'available-areas', 'nasa_region', 'nasa_region');
    setCheckbox(available_countries, 'country-filter', 'available-countries', 'nasa_abreviation', 'nasa_name');
    setCheckbox(initial_data.slice(0,1), 'date-filter', 'available-dates', 'acq_date', 'acq_date');
    setCheckbox(initial_data.slice(0,1), 'time-filter', 'available-times', 'daynight', 'daynight');
    setCheckbox(initial_data.slice(0,1), 'source-filter', 'available-sources', 'instrument', 'instrument');
    setCheckbox(initial_data.slice(0,1), 'confidence-filter', 'available-confidence-levels', 'confidence', 'confidence');
    resetDefault('reset-filter', 'main-checkbox');

    // Apply filter
    let saveFilter = document.getElementById("save-filter");
    let boxes = document.getElementsByClassName("main-checkbox");
    saveFilter.addEventListener("click", event => {
        let filtersToApply = filteredOptions(boxes);
        currentData = applyFilter(initial_data, filtersToApply);
        console.log(currentData);
        current_marks_mesh.dispose();
        scene.remove(current_marks_mesh);
        current_marks_mesh = createMarkers(currentData);
        scene.add(current_marks_mesh);
        labelDiv.classList.add("hidden");
        labelDivInfo.classList.add("hidden");
    });

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
    let markerLatitude = document.getElementById("markerLatitude");
    let markerLongitude = document.getElementById("markerLongitude");
    let markerCountryISOA3= document.getElementById("markerCountryISOA3");
    let markerNASARegion = document.getElementById("markerNASARegion");
    let markerSubRegion = document.getElementById("markerSubRegion");


    // Marker NASA information
    let markerAcq_Date = document.getElementById("markerAcq_Date");
    let markerInstrument = document.getElementById("markerInstrument");

    let markerdayNight = document.getElementById("markerdayNight");
    let markerSatellite = document.getElementById("markerSatellite");
    let markerConfidence = document.getElementById("markerConfidence");
    let markerBright_ti4 = document.getElementById("markerBright_ti4");
    let markerBright_ti5 = document.getElementById("markerBright_ti5");
    let markerScan = document.getElementById("markerScan");
    let markerTrack = document.getElementById("markerTrack");
    let markerFrp = document.getElementById("markerFrp");

    labelRenderer.domElement.addEventListener("pointerdown", event => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        intersections = raycaster.intersectObject(current_marks_mesh, true);
        if (intersections.length > 0){

            let meshId = intersections[0].instanceId;
            let dataId = intersections[0].object.userData[meshId];
            let markInformation = currentData[dataId];
            
            // Earth label information
            markerIDAux.innerHTML = `ID: <b>${dataId}</b>`;
            markerLatAux.innerHTML = `Latitude: <b>${markInformation.latitude}</b>`;
            markerLongAux.innerHTML = `Longitude: <b>${markInformation.longitude}</b>`;

            // Right side information
            markerId.innerHTML = `ID: <b>${dataId}</b>`;
            markerLatitude.innerHTML = `Latitude: <b>${markInformation.latitude}</b>`;
            markerLongitude.innerHTML = `Longitude: <b>${markInformation.longitude}</b>`;
            markerCountryName.innerHTML = `Country name: <b>${markInformation.country}</b>`;
            markerCountryISOA3.innerHTML = `Country ISO-A3: <b>${markInformation.iso_country_a3}</b>`;
            markerAffiliated_country.innerHTML = `Affiliated country: <b>${markInformation.affiliated_country}</b>`;
            markerNASARegion.innerHTML = `NASA Region: <b>${markInformation.nasa_region}</b>`;
            markerSubRegion.innerHTML = `Sub-Region: <b>${markInformation.subregion}</b>`;
            markerAcq_Date.innerHTML = `Date adquisiton: <b>${markInformation.acq_date}</b>`;
            markerInstrument.innerHTML = `Source: <b>${markInformation.instrument}</b>`;
            markerdayNight.innerHTML = `Time adquisiton: <b>${markInformation.daynight}</b>`;
            markerSatellite.innerHTML = `Satellite: <b>${markInformation.satellite}</b>`;
            markerConfidence.innerHTML = `Confidence level: <b>${markInformation.confidence}</b>`;
            markerBright_ti4.innerHTML = `Bright Ti 4: <b>${markInformation.bright_ti4}</b>`;
            markerBright_ti5.innerHTML = `Bright Ti 5: <b>${markInformation.bright_ti5}</b>`;
            markerScan.innerHTML = `Scan: <b>${markInformation.scan}</b>`;
            markerTrack.innerHTML = `Track: <b>${markInformation.track}</b>`;
            markerFrp.innerHTML = `FRP: <b>${markInformation.frp}</b>`;

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
