import {createRenderer, setCamera, setControls, Earth, Earth3D, setLabelAttributes, removeMesh, addMesh, THREE, CSS2DRenderer, CSS2DObject} from './threeJSFunctions.js';
import {setCheckbox, setNewDate, setMultipleDates, resetDefault, filteredOptions} from './filterFunctions.js';
import {processFireData, displayFireData} from './globeFunctions.js';
import {setOption, requestedData, allowRequest, putData, getData, exportData} from './clientFunctions.js';
import {setInspectData} from './contentFunctions.js'

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
    const textureProperties = {earth: true, clouds: false, hydroSphere: true};
    const earthObject = Earth3D(sphereProperties, textureProperties);
    const earth = earthObject.earthGroup;
    const earthMesh = earthObject.earthMesh;
    scene.add(earth);

    // Lights creation
    const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.05);
    scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xFFFFFF, 2.25);
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

    // UI/UX functions
    const sidebar = document.getElementById('container-sidebar');
    const Areasidebar = document.getElementById('area-sidebar');
    const hideSidebar = document.getElementById('collapse-sidebar');
    const inspectButton = document.getElementsByClassName('inspect-data');
    const containerIns = document.getElementById('inspect-container');
    const maxWindow = document.getElementById('max-inspect');
    const minWindow = document.getElementById('min-inspect');
    const summaryButton = document.getElementById('summary');
    const summarySection = document.getElementById('summary-section');
    const tableButton = document.getElementById('table');
    const tableSection = document.getElementById('table-section');
    const getFiles = document.getElementsByClassName('file-request');


    // Hide sidebar
    hideSidebar.addEventListener("click", _=>{
        Areasidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('collapsed-width');
        sidebar.ariaExpanded = sidebar.ariaExpanded !== 'true';
        if(containerIns.ariaExpanded == "true"){
            minWindow.dispatchEvent(new Event("click"));
        }
    });

    //Open Inspect data
    for(let i=0; i< inspectButton.length; i++){
        inspectButton[i].addEventListener("click", _ =>{
        containerIns.classList.toggle('hidden');
        });
    }

    // Max window Inspect data
    maxWindow.addEventListener('click', _ =>{
        if(containerIns.ariaExpanded === "false"){
            const newWidth = window.innerWidth * 0.85;
            if(sidebar.offsetWidth != 0){
                hideSidebar.dispatchEvent(new Event("click"));
            }
            if(labelDivInfo.offsetWidth != 0){
                closeBtn.dispatchEvent(new Event("pointerdown"));
            }
            containerIns.style = `width: ${newWidth}px; max-width: ${newWidth}px;`;
            containerIns.ariaExpanded = containerIns.ariaExpanded !== 'true';
        }
    });

    //Exit full screen Inspect data
    minWindow.addEventListener('click', _ =>{
        if(containerIns.ariaExpanded === "true"){
            containerIns.style = "";
            containerIns.ariaExpanded = containerIns.ariaExpanded !== 'true';
        }
    });

    //OPEN summary/table sections 
    summaryButton.addEventListener("click", _ =>{
        if(summarySection.classList.contains("hidden")){
            summarySection.classList.remove("hidden");
            tableSection.classList.add('hidden');
            summaryButton.ariaSelected = summaryButton.ariaSelected !== 'true';
            tableButton.ariaSelected = tableButton.ariaSelected !== 'true';
        }
    });
    tableButton.addEventListener("click", _ =>{
        if(tableSection.classList.contains("hidden")){
            tableSection.classList.remove("hidden");
            summarySection.classList.add('hidden');
            tableButton.ariaSelected = tableButton.ariaSelected !== 'true';
            summaryButton.ariaSelected = summaryButton.ariaSelected !== 'true';
        }
    });


    //Download file data
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
