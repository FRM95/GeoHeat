import { createRenderer, createCamera, createControls, Group, setLabelAttributes, removeObject, addObject, buildLight, textureVisible, THREE } from './scripts/threeJS/functions.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';
import { setOption, requestedData, allowRequest, putData, getData, exportData } from './scripts/requests/functions.js';
import { processFireData, displayFireData } from './scripts/fires/functions.js';
import { setCheckbox, setNewDate, resetDefault, filteredOptions } from './scripts/UX/filter.js';
import { setInspectData } from './scripts/UX/inspect.js'
import { userInterface } from './scripts/UX/user.js'
import { texturesQuality, texturesProperties, lightProperties } from "./config.js";

function main(){

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
    const earth_radius = 1;
    const sphereProperties = {radius: earth_radius, widthSegments : 64, heightSegments: 32};
    const meshes = Group(sphereProperties, texturesProperties, texturesQuality);
    const earth = meshes.groupMesh;
    scene.add(earth);

    // Controls creation
    const TrackballControls = createControls(camera, labelRenderer.domElement, earth);

    // Lights creation
    const lightObject = buildLight(lightProperties); 
    const sphereLight = lightObject.ambientLight;
    const sunLight = lightObject.directionalLight;
    sunLight.position.set(-4, 3, 2);
    scene.add(sphereLight);
    camera.add(sunLight);
    scene.add(camera);

    // Background creation
    const stars = meshes.backgroundMesh;
    scene.add(stars);

    // Default data
    let meshPointers = [];

    // Globe mark label functionality
    const labelDiv = document.getElementById("markerLabel");
    const label = new CSS2DObject(labelDiv);
    const earthMesh = earth.children[0];
    setLabelAttributes(label, earthMesh, camera)
    scene.add(label);

    // Mark information functionality
    const labelDivInfo = document.getElementById("markerInformation");
    const closeBtn = document.getElementById("closeButton");
    closeBtn.addEventListener("pointerdown", _ => {
        labelDiv.classList.add("hidden");
        labelDivInfo.classList.add("hidden");
        labelDivInfo.ariaExpanded = "false";
    })

    // Creates filter data and request data options
    for(const[key, value] of Object.entries(options_data)){
        setCheckbox(key, value); 
        setOption(key, value);
    }

    // Request date creation
    const currDay = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    document.getElementById('requestDate').max = currDay;
    document.getElementById('requestDate').value = currDay;

    // Applies filter
    const saveFilter = document.getElementById("save-button");
    let boxes = document.getElementsByClassName("main-checkbox");
    saveFilter.addEventListener("click", _ => {
        let filtersToApply = filteredOptions(boxes);
        removeObject(scene, meshPointers)
        meshPointers = processFireData(user_key, user_data, earth_radius, filtersToApply);
        addObject(scene, meshPointers);
        labelDiv.classList.add("hidden");
        labelDivInfo.classList.add("hidden");
    });

    // Get and update user data
    const requestData = document.getElementById("request-button");
    const selectors = document.getElementsByClassName("request-parameter");
    requestData.addEventListener("click", async _ => {
        const selectedOptions = requestedData(selectors);
        const flagRequest = allowRequest(user_key, user_data, selectedOptions);
        const flagResult = await getData(user_key, user_data, flagRequest, selectedOptions);
        if(flagResult){
            removeObject(scene, meshPointers);
            meshPointers = processFireData(user_key, user_data, earth_radius);
            addObject(scene, meshPointers);
            setNewDate(selectedOptions['date'], 'availableDate', 'filterDate');
            setInspectData(user_key, user_data, 'summary-section', 'table-section');
            labelDiv.classList.add("hidden");
            labelDivInfo.classList.add("hidden");
            // const updatedData = await putData(user_data);
        }
    });

    // Reset filters
    resetDefault('reset-button', 'main-checkbox');

    // UX-UI Functions
    userInterface(labelRenderer, TrackballControls, texturesProperties);
    const layersApply = document.getElementById("apply-interface-layers");
    layersApply.addEventListener("click", _ =>{
        textureVisible(texturesProperties, earth, stars);
    });


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
                    let fireInformation = currIntersection.object.userData[meshId];
                    displayFireData(fireInformation, meshId);
                    label.position.set(currIntersection.point.x, currIntersection.point.y, currIntersection.point.z);
                    label.element.classList.remove("hidden");
                    labelDivInfo.classList.remove("hidden");
                    labelDivInfo.ariaExpanded = "true";
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
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
        TrackballControls.update();
        label.userData.trackVisibility();
    }

    animate();
}

// Executes main method after window load
window.addEventListener("load", function () {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});
