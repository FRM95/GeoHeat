import {createRenderer, setCamera, setControls, Earth, addCartesian, createMarkers, setLabelAttributes, THREE, CSS2DRenderer, CSS2DObject} from './threeJSFunctions.js';
import {setCheckbox, resetDefault, filteredOptions, applyFilter} from './filterFunctions.js';
import {setOption} from './clientFunctions.js';

function main(){

    console.log(curr_key)

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('container-center');
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
    labelRenderer.domElement.addEventListener("click", _ => {
        orbitControls.autoRotateSpeed = (Math.log(orbitControls.getDistance()) - Math.log(orbitControls.minDistance)) * 1.75; 
    });

    // Earth creation
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const earth_radius = 1;
    const earth = Earth(earth_radius, 64, 32, material, "/static/textures/earthmap10k.jpg");
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
    closeBtn.addEventListener("pointerdown", _ => {
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
    setCheckbox(available_filters.timefilter, 'time-filter', 'available-times', 'daynight', 'daynight');
    setCheckbox(available_filters.sourcefilter, 'source-filter', 'available-sources', 'instrument', 'instrument');
    resetDefault('reset-button', 'main-checkbox');

    // Applies filter
    let saveFilter = document.getElementById("save-button");
    let boxes = document.getElementsByClassName("main-checkbox");
    saveFilter.addEventListener("click", _ => {
        let filtersToApply = filteredOptions(boxes);
        currentData = applyFilter(initial_data, filtersToApply);
        current_marks_mesh.dispose();
        scene.remove(current_marks_mesh);
        current_marks_mesh = createMarkers(currentData);
        scene.add(current_marks_mesh);
        labelDiv.classList.add("hidden");
        labelDivInfo.classList.add("hidden");
    });

    // Request Data creation
    setOption(available_filters.delimiterData, 'new-delimiter', 'delimiter', 'delimiter');
    setOption(available_areas, 'new-area', 'nasa_region', 'nasa_region');
    setOption(available_countries, 'new-country', 'nasa_abreviation', 'nasa_name');
    setOption(available_filters.sourceData, 'new-source', 'source', 'source');
    setOption(available_filters.rangeData, 'new-range', 'dayrange', 'dayrange');
    

    // Intersect point with raycast
    let pointer = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    let intersections = null;

    labelRenderer.domElement.addEventListener("pointerdown", event => {
        pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        pointer.y = - (event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        intersections = raycaster.intersectObject(current_marks_mesh, true);
        if(intersections.length > 0){
            let intersectionData = intersections[0];
            let meshId = intersectionData.instanceId;
            let dataId = intersectionData.object.userData[meshId];
            let fireInformation = currentData[dataId];
            let htmlLabels = document.getElementsByClassName("marker-info");
            for(let i = 0; i < htmlLabels.length; i++){
                let currLabel = htmlLabels[i];
                if(currLabel.id in fireInformation){
                    let strLabel = String(currLabel.id);
                    currLabel.innerHTML = `<b>${strLabel.charAt(0).toUpperCase() + strLabel.slice(1).replace("_", " ")}:</b> ${fireInformation[currLabel.id]}`;
                    currLabel.classList.remove("hidden");
                    if(strLabel == 'latitude'){
                        document.getElementById('markerLatitudeAux').innerHTML = currLabel.innerHTML;
                    }
                    else if(strLabel == 'longitude'){
                        document.getElementById('markerLongitudeAux').innerHTML = currLabel.innerHTML;
                    }
                }
                else{
                    currLabel.innerHTML = "";
                    currLabel.classList.add("hidden");
                }
            }
            document.getElementById('markerId').innerHTML = `<b>Id</b>: ${dataId}`;
            document.getElementById('markerIdAux').innerHTML = `<b>Id</b>: ${dataId}`;
            label.position.set(intersectionData.point.x, intersectionData.point.y, intersectionData.point.z);
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
