import {createRenderer, setCamera, setControls, Earth, setLabelAttributes, removeMesh, addMesh, THREE, CSS2DRenderer, CSS2DObject} from './threeJSFunctions.js';
import {setCheckbox, setNewDate, setMultipleDates, resetDefault, filteredOptions} from './filterFunctions.js';
import {processFireData, displayFireData} from './globeFunctions.js';
import {setOption, requestedData, allowRequest, putData, getData} from './clientFunctions.js';
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

    // Camera creation
    const camera = setCamera(75, width/height, 0.1, 10, 0, 0, 3);

    // Scene creation
    const scene = new THREE.Scene();

    // Controls creation
    const orbitControls = setControls(camera, labelRenderer.domElement, true, 0.03, false);

    // Auto rotate speed functionality
    labelRenderer.domElement.addEventListener("click", _ => {
        orbitControls.autoRotateSpeed = (Math.log(orbitControls.getDistance()) - Math.log(orbitControls.minDistance)) * 1.75; 
    });

    // Earth creation
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const earth_radius = 1;
    const earth = Earth(earth_radius, 64, 32, material, "/static/textures/earthmap10k.jpg");
    scene.add(earth);

    // Default data
    let meshPointers = [];

    // Mark information functionality
    const labelDivInfo = document.getElementById("markerInformation");
    const closeBtn = document.getElementById("closeButton");
    closeBtn.addEventListener("pointerdown", _ => {
      labelDiv.classList.add("hidden");
      labelDivInfo.classList.add("hidden");
    })

    // Globe mark label functionality
    const labelDiv = document.getElementById("markerLabel");
    const label = new CSS2DObject(labelDiv);
    setLabelAttributes(label, earth, camera)
    scene.add(label);

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
            const updatedData = await putData(user_data);
        }
    });

    // Reset filters
    resetDefault('reset-button', 'main-checkbox');

    // Hide sidebar
    const sidebar = document.getElementById('container-sidebar');
    const Areasidebar = document.getElementById('area-sidebar');
    const hideSidebar = document.getElementById('collapse-sidebar');
    hideSidebar.addEventListener("click", _=>{
        Areasidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('collapsed-width');
        sidebar.ariaExpanded = sidebar.ariaExpanded !== 'true';
    });

    //OPEN Inspect data
    const inspectButton = document.getElementsByClassName('inspect-data');
    const containerIns = document.getElementById('inspect-container');
    for(let i=0; i< inspectButton.length; i++){
        inspectButton[i].addEventListener("click", _ =>{
        containerIns.classList.toggle('hidden');
        });
    }

    //OPEN summary table sections 
    const summaryButton = document.getElementById('summary');
    const summarySection = document.getElementById('summary-section');
    const tableButton = document.getElementById('table');
    const tableSection = document.getElementById('table-section');
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

    // Max window
    // const maxWindow = document.getElementById('max-inspect');
    // maxWindow.addEventListener('click', _ =>{
    //     containerIns.classList.toggle('w-max');
    //     inspectArea.classList.toggle('w-max');
    //     containerIns.classList.toggle('h-100');
    //     inspectArea.classList.toggle('h-100');
    //     inspectSection.classList.toggle('h-max');
    //     tableSection.classList.toogle('h-max');
    //     summarySection.classList.toogle('h-max')
    // });
    

    // Intersect point with raycast
    let pointer = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    labelRenderer.domElement.addEventListener("pointerdown", event => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / (window.innerHeight + yOffset)) * 2 + 1; /* 21/06/2024 changed from innerHeight to (innerHeight + yOffset) */
        raycaster.setFromCamera(pointer, camera);
        for(let i = 0; i < meshPointers.length; i++){
            let intersections = raycaster.intersectObject(meshPointers[i], true);
            if(intersections.length > 0){
                let currIntersection = intersections[0];
                let meshId = currIntersection.instanceId;
                let fireInformation = currIntersection.object.userData[meshId];
                displayFireData(fireInformation, meshId);
                label.position.set(currIntersection.point.x, currIntersection.point.y, currIntersection.point.z);
                label.element.classList.remove("hidden");
                labelDivInfo.classList.remove("hidden")
            }
        }
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
        orbitControls.update();
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
