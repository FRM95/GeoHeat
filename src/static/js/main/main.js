import {createRenderer, setCamera, setControls, Earth, Earth3D, setLabelAttributes, removeMesh, addMesh, THREE, CSS2DRenderer, CSS2DObject} from '../scripts/threeJSFunctions.js';
import {setCheckbox, setNewDate, setMultipleDates, resetDefault, filteredOptions} from '../scripts/filterFunctions.js';
import {processFireData, displayFireData} from '../scripts/globeFunctions.js';
import {setOption, requestedData, allowRequest, putData, getData, exportData} from '../scripts/clientFunctions.js';
import {setInspectData} from '../scripts/contentFunctions.js'
import {userInterface, applyLayers} from '../scripts/userFunctions.js'

function main(){

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const yOffset = document.getElementById("header").offsetHeight;
    const height = window.innerHeight + yOffset; /* 21/06/2024 changed from innerHeight to (innerHeight + yOffset) */
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
    const camera = setCamera(75, width/height, 0.1, 10, 0, 0, 3);

    // Controls creation
    const TrackballControls = setControls(camera, labelRenderer.domElement);

    // Earth creation
    const earth_radius = 1;
    const sphereProperties = {radius: earth_radius, widthSegments : 64, heightSegments: 32};
    let textureProperties = {Earth_map: true, Bump_map:true, Clouds_map: true, Hydrosphere_map: true};
    const earthObject = Earth3D(sphereProperties, textureProperties);
    const earth = earthObject.earthGroup;
    const earthMesh = earthObject.earthMesh;
    scene.add(earth);

    // Lights creation
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.25);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 6.5);
    sunLight.position.set(-4, 3, 2);
    camera.add(sunLight);
    scene.add(camera);

    // Default data
    let meshPointers = [];

    // Globe mark label functionality
    const labelDiv = document.getElementById("markerLabel");
    const label = new CSS2DObject(labelDiv);
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
        removeMesh(scene, meshPointers)
        meshPointers = processFireData(user_key, user_data, earth_radius, filtersToApply);
        addMesh(scene, meshPointers);
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
            removeMesh(scene, meshPointers);
            meshPointers = processFireData(user_key, user_data, earth_radius);
            addMesh(scene, meshPointers);
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
    userInterface(labelRenderer, TrackballControls, textureProperties);
    const layersApply = document.getElementById("apply-interface-layers");
    layersApply.addEventListener("click", _ =>{
        textureProperties = applyLayers(textureProperties);
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
