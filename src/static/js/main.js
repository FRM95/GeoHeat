import { createRenderer, createCamera, createControls, Group, setLabelAttributes, removeObject, addObject, buildLight, textureVisible, THREE } from './scripts/threeJS/functions.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { setOption, requestedData, allowRequest, putData, getData, exportData } from './scripts/requests/functions.js';
import { processFireData, displayFireData, coordToCartesian } from './scripts/fires/functions.js';
import { setCheckbox, setNewDate, resetDefault, filteredOptions, setMultipleDates } from './scripts/UX/filter.js';
// import { setInspectData } from './scripts/UX/plotly_functions.js'
import { userInterface } from './scripts/UX/user.js'
import { notificationHandler } from './scripts/UX/notifications.js'
import { moveToPoint } from './scripts/UX/globe.js'
import { texturesQuality, texturesProperties, lightProperties } from "./config.js";

const $ = (element) => {
    document.querySelector(element);
} 

/* const $ = el => document.querySelector(el);
    const $$ = el => document.querySelectorAll(el);
*/

async function main(){

    // Renderer creation and DOM append
    const yOffset = document.getElementById("header").offsetHeight;
    const width = window.innerWidth;
    const height = window.innerHeight + yOffset;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('threejs-canvas');
    container.appendChild(renderer.domElement);

    // Label Render creation
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = 'absolute';
    labelRenderer.domElement.style.top = '0px';
    container.appendChild(labelRenderer.domElement);   
    
    // Scene creation
    const scene = new THREE.Scene();

    // Camera creation
    const camera = createCamera(75, width/height, 0.1, 1000, 0, 0, 3);

    // Earth creation
    const earth_radius = 1.0;
    const sphereProperties = {radius: earth_radius, widthSegments : 64, heightSegments: 32};
    const meshes = Group(sphereProperties, texturesProperties, texturesQuality);
    const earth = meshes.groupMesh;
    scene.add(earth);
    camera.lookAt(earth.position);

    // Controls creation
    const controls = createControls(camera, labelRenderer.domElement, earth);

    // Lights creation
    const lightObject = buildLight(lightProperties); 
    const sphereLight = lightObject.ambientLight;
    const sunLight = lightObject.directionalLight;
    sunLight.position.set(-4, 3, 2);
    scene.add(sphereLight);
    camera.add(sunLight);
    scene.add(camera);


    // Example
    // const axesHelper = new THREE.AxesHelper(2);
    // scene.add(axesHelper);

    // Background creation
    const stars = meshes.backgroundMesh;
    scene.add(stars);

    // Default data
    let meshPointers = [];

    // Globe mark label functionality
    const markerElement = document.querySelector("[data-content='Marker-Label']");
    const markerCSS2 = new CSS2DObject(markerElement);
    const earthMesh = earth.children[0];
    setLabelAttributes(markerCSS2, earthMesh, camera)
    scene.add(markerCSS2);


    // Mark information functionality
    const closeMarker = document.querySelector("[data-section = 'Marker-Label']");
    const markerInformation = document.querySelector("[data-content = 'Marker-Information']");
    closeMarker.addEventListener("pointerdown", _ => {
        markerInformation.ariaHidden = "true";
    })

    // Creates filter data and request data options
    for(const[key, value] of Object.entries(options_data)){
        setCheckbox(key, value); 
        setOption(key, value);
    }
    
    console.log('1', user_data_2)
    console.log('2', countries_data)
    console.log('3', firms_data)
    console.log('4', areas_data)

    // Request date creation
    const currDay = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    document.getElementById('requestDate').max = currDay;
    document.getElementById('requestDate').value = currDay;


    // Applies filter
    const saveFilter = document.getElementById("save-button");
    let boxes = document.getElementsByClassName("summary-checkbox");
    saveFilter.addEventListener("click", _ => {
        let filtersToApply = filteredOptions(boxes);
        removeObject(scene, meshPointers)
        meshPointers = processFireData(user_key, user_data, earth_radius, filtersToApply);
        addObject(scene, meshPointers);
        markerElement.ariaHidden = "true";
        markerInformation.ariaHidden = "true";
    });

    // Get and update user data
    const requestData = document.getElementById("request-button");
    const selectors = document.getElementsByClassName("request-parameter");
    let tweenAnimation = null;

    // Include it when load windows
    if(user_data[user_key].length > 0){
        meshPointers = processFireData(user_key, user_data, earth_radius);
        addObject(scene, meshPointers);
        setMultipleDates(user_key, user_data, 'availableDate', 'filterDate')
    }

    // Search location 
    const searchLocation = document.getElementById("input-location-search-button");
    searchLocation.addEventListener("click", () => {
        const inputSearch = document.getElementById("input-location-search");
        if(inputSearch != null){
            const coordToSearch = inputSearch.getAttribute("data-coordinates");
            const locationName = inputSearch.getAttribute("data-location_name");
            if(inputSearch.value === locationName && coordToSearch!=null){
                const coordinatesArr = coordToSearch.split(" ");
                let coordinates = {latitude: parseFloat(coordinatesArr[0]), longitude: parseFloat(coordinatesArr[1])};
                coordinates = coordToCartesian(coordinates, earth_radius)
                const vectorRequest = new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z);
                tweenAnimation = moveToPoint(vectorRequest, camera, earth, earth_radius);
                tweenAnimation.start();
            }
        }
    });

    /* Request data */
    requestData.addEventListener("click", async _ => {
        const selectedOptions = requestedData(selectors);
        const flagRequest = allowRequest(user_key, user_data, selectedOptions);
        if(flagRequest.allowed){
            const addedCorrectly = await getData(user_key, user_data, flagRequest, selectedOptions);
            if(addedCorrectly){
                removeObject(scene, meshPointers);
                meshPointers = processFireData(user_key, user_data, earth_radius);
                addObject(scene, meshPointers);
                setNewDate(selectedOptions['date'], 'availableDate', 'filterDate');
                // here goes the calculation of kpi's
                markerElement.ariaHidden = "true";
                markerInformation.ariaHidden = "true";
                const coordinatesArr = selectedOptions['coordinates'].split(" ");
                let coordinates = {latitude: parseFloat(coordinatesArr[0]), longitude: parseFloat(coordinatesArr[1])};
                coordinates = coordToCartesian(coordinates, earth_radius)
                const vectorRequest = new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z);
                tweenAnimation = moveToPoint(vectorRequest, camera, earth, earth_radius);
                tweenAnimation.start();
            }
        }
        else{
            notificationHandler('request_denied', flagRequest, selectedOptions);
        }
    });

    // Reset filters
    resetDefault('reset-button', 'summary-checkbox');

    const compass = document.getElementById("arrow");
    const vectorUp = new THREE.Vector2(earth.position.x, earth.position.y + 1);
    function updateCompass(){
        const mE = camera.matrixWorld.elements;
        const dY = new THREE.Vector2(mE[1], mE[5]);
        const angleYAxis = THREE.MathUtils.radToDeg(vectorUp.angleTo(dY)) * Math.sign(mE[1]);
        compass.style.transform = `rotate(${angleYAxis}deg)`;
    }

    // UX-UI Functions
    userInterface(labelRenderer, controls, texturesProperties);
    const layersApply = document.getElementById("apply-interface-layers");
    layersApply.addEventListener("click", _ =>{
        textureVisible(texturesProperties, earth, stars);
    });
    const datitos = document.getElementById("contenidoDatos");
    datitos.addEventListener("click", () =>{
        console.log(user_data)
    })

    //Download file data
    const getFiles = document.getElementsByClassName('file-request');
    for(let i = 0; i < getFiles.length; i++){
        const fileType = getFiles[i].getAttribute('download-file');
        getFiles[i].addEventListener("click", async _ =>{
            await exportData(user_key, user_data, fileType);
        });
    }

    // Intersect point with raycast
    let pointer = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    labelRenderer.domElement.addEventListener("pointerdown", event => {
        if(tweenAnimation instanceof TWEEN.Tween && tweenAnimation._isPlaying){ tweenAnimation.stop(); }
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / (window.innerHeight + yOffset)) * 2 + 1; /* 21/06/2024 changed from innerHeight to (innerHeight + yOffset) */
        raycaster.setFromCamera(pointer, camera);
        if(raycaster.intersectObject(earth).length > 0){
            labelRenderer.domElement.style.cursor = 'grabbing';
            for(let i = 0; i < meshPointers.length; i++){
                let intersections = raycaster.intersectObject(meshPointers[i]);
                if(intersections.length > 0){
                    let currIntersection = intersections[0];
                    let meshId = currIntersection.instanceId;

                    /* Change the color */
                    // console.log(currIntersection);
                    // const color = new THREE.Color();
                    // console.log(meshPointers[i]);
                    // console.log(currIntersection);
                    // meshPointers[i].setColorAt(meshId, color.setRGB(0.0, 0.0, 1.0));
                    // meshPointers[i].instanceColor.needsUpdate = true;
                    // meshPointers[i].instanceMatrix.needsUpdate = true;

                    /* Display data */
                    let fireInformation = currIntersection.object.userData[meshId];
                    displayFireData(fireInformation, meshId, markerElement, markerInformation);
                    markerCSS2.position.set(currIntersection.point.x, currIntersection.point.y, currIntersection.point.z);

                    /* Start animation */
                    const vectorTarget = new THREE.Vector3(currIntersection.point.x, currIntersection.point.y, currIntersection.point.z);
                    tweenAnimation = moveToPoint(vectorTarget, camera, earth, earth_radius);
                    tweenAnimation.start();
                    break
                }
            }
        }
    });

    labelRenderer.domElement.addEventListener("pointerup", _ => {
        labelRenderer.domElement.style.cursor = 'default';
    });


    // Camera, render and label render window resize
    const onWindowResize=() => {
        camera.aspect = innerWidth / (innerHeight + yOffset); /* 21/06/2024 changed from innerHeight to (innerHeight + yOffset) */
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, (innerHeight + yOffset)); 
        labelRenderer.setSize(innerWidth, (innerHeight + yOffset));
    }

    window.addEventListener("resize", onWindowResize);

    // Animate function to start render
    function animate(){
        requestAnimationFrame(animate);
        updateCompass();
        controls.update();
        TWEEN.update();
        markerCSS2.userData.trackVisibility();
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }

    animate();
}

// Executes main method after window load
window.addEventListener("load", function () {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});
