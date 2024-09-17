import { createRenderer, createCamera, createControls, Group, setLabelAttributes, removeObject, addObject, buildLights, THREE } from './scripts/threeJS/functions.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

/* Request data */
import { setRequestOptions } from './scripts/requests/ux-functions.js';
import { requestedData, allowRequest, getData } from './scripts/requests/functions.js';

/* Filter data */
import { setFilterOptions, resetFilterOptions, setNewDate, filteredOptions, setMultipleDates } from './scripts/UX/data-filter/ux-functions.js';

/* Layers data */
import { setTexturesOptions } from './scripts/user_data/layers.js';

import { processFireData, displayFireData, coordToCartesian } from './scripts/fires/functions.js';
import { userInterface } from './scripts/UX/user.js'
import { notificationHandler } from './scripts/UX/notifications.js'
import { moveToPoint } from './scripts/UX/globe.js'
import { texturesQuality } from "./config.js";

// const $ = (element) => {
//     document.querySelector(element);
// } 

/* const $ = el => document.querySelector(el);
    const $$ = el => document.querySelectorAll(el);
*/

async function main(){

    // Renderer creation and DOM append
    const yOffset = document.getElementById("header").offsetHeight;
    const width = window.innerWidth;
    const height = window.innerHeight + yOffset;
    const renderer = createRenderer(width, height);
    const container = document.getElementById("threejs-canvas");
    container.appendChild(renderer.domElement);

    // Label Render creation
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(width, height);
    labelRenderer.domElement.style.position = "absolute";
    labelRenderer.domElement.style.top = "0px";
    container.appendChild(labelRenderer.domElement);   
    
    // Scene creation
    const scene = new THREE.Scene();

    // Camera creation
    const camera = createCamera(75, width/height, 0.1, 1000, 0, 0, 3);

    // Earth and textures creation
    const earth_radius = 1.0;
    const sphereProperties = {radius: earth_radius, widthSegments : 64, heightSegments: 32};
    const userTextures = user_data["threejs_configuration"]["textures"];
    const meshes = Group(sphereProperties, userTextures, texturesQuality);

    const earth = meshes.groupMesh;
    scene.add(earth);
    camera.lookAt(earth.position);

    // Controls creation
    const controls = createControls(camera, labelRenderer.domElement, earth);

    // Lights creation
    const userLights = user_data["threejs_configuration"]["lights"];
    const lightObject = buildLights(userLights); 
    const sphereLight = lightObject["ambient_light"];
    const sunLight = lightObject["directional_light"];
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

    /* Set options to select layers data */
    const userKey = user_data["firms_key"];
    setTexturesOptions(userKey, userTextures, earth, stars);

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

    /* Set options to filter data */
    setFilterOptions("country", countries_data);
    setFilterOptions("area", areas_data);
    setFilterOptions("firms", firms_data);
    resetFilterOptions("reset-button", "summary-checkbox");

    /* Apply filter data */
    const saveFilter = document.getElementById("save-button");
    let boxes = document.getElementsByClassName("summary-checkbox");
    saveFilter.addEventListener("click", () => {
        let filtersToApply = filteredOptions(boxes);
        removeObject(scene, meshPointers)
        meshPointers = processFireData(userKey, user_fires, earth_radius, filtersToApply);
        addObject(scene, meshPointers);
        markerElement.ariaHidden = "true";
        markerInformation.ariaHidden = "true";
    });

    /* Set options to request data */
    setRequestOptions("country", countries_data);
    setRequestOptions("area", areas_data);
    setRequestOptions("firms", firms_data);
    setRequestOptions("date", null);
    
    // Get and update user data
    const requestData = document.getElementById("request-button");
    const selectors = document.getElementsByClassName("request-parameter");
    let tweenAnimation = null;

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

    /* Request FIRMS data */
    requestData.addEventListener("click", async () => { 

    });
    // requestData.addEventListener("click", async () => {
    //     const selectedOptions = requestedData(selectors);
    //     const flagRequest = allowRequest(userKey, user_fires, selectedOptions);
    //     if(flagRequest.allowed){
    //         const addedCorrectly = await getData(userKey, user_fires, flagRequest, selectedOptions);
    //         if(addedCorrectly){
    //             removeObject(scene, meshPointers);
    //             meshPointers = processFireData(userKey, user_fires, earth_radius);
    //             addObject(scene, meshPointers);
    //             setNewDate(selectedOptions['date'], 'availableDate', 'filterDate');
    //             // here goes the calculation of kpi's
    //             markerElement.ariaHidden = "true";
    //             markerInformation.ariaHidden = "true";
    //             const coordinatesArr = selectedOptions['coordinates'].split(" ");
    //             let coordinates = {latitude: parseFloat(coordinatesArr[0]), longitude: parseFloat(coordinatesArr[1])};
    //             coordinates = coordToCartesian(coordinates, earth_radius)
    //             const vectorRequest = new THREE.Vector3(coordinates.x, coordinates.y, coordinates.z);
    //             tweenAnimation = moveToPoint(vectorRequest, camera, earth, earth_radius);
    //             tweenAnimation.start();
    //         }
    //     }
    //     else{
    //         notificationHandler('request_denied', flagRequest, selectedOptions);
    //     }
    // });

    const compass = document.getElementById("arrow");
    const vectorUp = new THREE.Vector2(earth.position.x, earth.position.y + 1);
    function updateCompass(){
        const mE = camera.matrixWorld.elements;
        const dY = new THREE.Vector2(mE[1], mE[5]);
        const angleYAxis = THREE.MathUtils.radToDeg(vectorUp.angleTo(dY)) * Math.sign(mE[1]);
        compass.style.transform = `rotate(${angleYAxis}deg)`;
    }

    // UX-UI Functions
    userInterface(labelRenderer, controls);

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
