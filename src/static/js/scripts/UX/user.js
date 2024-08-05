import { moveToPoint } from "./globe.js";

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
const zoomIn = document.getElementById('zoom-in');
const zoomOut = document.getElementById('zoom-out');
const zoomDefault = document.getElementById('zoom-default');
const labelDivInfo = document.getElementById("markerInformation");

/*TODO: TERMINAR DE PONER NOMBRES BONITOS*/
const searchInput = document.getElementById('header-input-form');
const list = document.getElementById("header-form-list");
const listDiv = document.getElementById("header-form-result-list");

/*looping through each child of the search results list and remove each child*/
const clearList = () =>{
    list.innerHTML = ""
    listDiv.ariaHidden = "true";
}

const noResults = () =>{
    const error = document.createElement('li')
    error.classList.add('list-error-background')
    const text = document.createTextNode("Sorry, we didn't find any results");
    error.appendChild(text)
    list.appendChild(error)
}

const searhcCoordinates = (searchElement) =>{
    const coordinatesArr = searchElement['coordinates'].split(" ");
    let coordinates = {latitude: parseFloat(coordinatesArr[0]), longitude: parseFloat(coordinatesArr[1])};
    coordinates = coordToCartesian(coordinates, earth_radius)
}

/* show results*/
const setList = (results) =>{
    clearList();
    for (const country of results){
        const resultItem = document.createElement('li');
        resultItem.classList.add('header-list-item');
        resultItem.setAttribute("coordinates", country["coordinates"]);
        resultItem.setAttribute("name", country["name"]);
        const text = document.createTextNode(country.name);
        resultItem.appendChild(text);
        resultItem.addEventListener("click", (e)=> {
            let target = e.target;
            searchInput.value = target.getAttribute("name");
            searchInput.setAttribute("data-coordinates", target.getAttribute("coordinates"));
            searchInput.setAttribute("data-name", target.getAttribute("name"));
            clearList();
        })
        list.appendChild(resultItem);
    }
    if (results.length === 0 ){
        return false
    }
    return true;
}

/* Interface select layers */
const user_events = () => {

    // Hide sidebar
    hideSidebar.addEventListener("click", _=>{
        Areasidebar.classList.toggle('collapsed');
        sidebar.classList.toggle('collapsed-width');
        sidebar.ariaExpanded = sidebar.ariaExpanded !== 'true';
        if(containerIns.ariaExpanded == "true"){
            minWindow.dispatchEvent(new Event("click"));
        }
    });

    // Open Inspect data
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

    // Exit full screen Inspect data
    minWindow.addEventListener('click', _ =>{
        if(containerIns.ariaExpanded === "true"){
            containerIns.style = "";
            containerIns.ariaExpanded = containerIns.ariaExpanded !== 'true';
        }
    });

    // Open summary/table sections 
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

    // Search countries and areas
    searchInput.addEventListener("input", (e) => {
        let value = e.target.value;
        if(value.trim()){
            value = value.trim().toLowerCase();
            let countries = setList(options_data['Country'].filter(country => {
                return country["name"].toLowerCase().includes(value)
            })); 
            if(countries){
                listDiv.ariaHidden = "false";
            } else {
                let areas = setList(options_data['Area'].filter(area => {
                    return area["name"].toLowerCase().includes(value)
                }));
                if(areas){
                    listDiv.ariaHidden = "false";
                } else {
                    noResults();
                }
            }
        } else {
            clearList();
        }
    });    

}


/* LabelRenderer Zoom in/Out */
const user_zoom = (labelRenderer, TrackballControls) => {

    let pressedIn;
    let pressedOut;
    let zoomFactor = 5;
    const delay = 0.5;

    const wheelEvent = (delx, delty) => new WheelEvent('wheel', {
        deltaX: delx,
        deltaY: delty,
        bubbles: true,
        cancelable: true,
        view: window
    });

    zoomIn.addEventListener("mousedown", event =>{
        if(event.button == 0){
            pressedIn = setInterval(() => {
                labelRenderer.domElement.dispatchEvent(wheelEvent(0, -zoomFactor));
                zoomFactor += 0.25;
            }, delay);
        }
    });

    zoomIn.addEventListener('mouseup', () => {
        clearInterval(pressedIn);
        zoomFactor = 5;
    });

    zoomOut.addEventListener("mousedown", event => {
        if(event.button == 0){
            pressedOut = setInterval(() => {
                labelRenderer.domElement.dispatchEvent(wheelEvent(0, zoomFactor));
                zoomFactor += 0.25;
            }, delay);
        }
    });

    zoomOut.addEventListener('mouseup', () => {
        clearInterval(pressedOut);
        zoomFactor = 5;
    });

    zoomDefault.addEventListener("click", () =>{
        TrackballControls.reset();
        clearInterval(pressedIn);
        clearInterval(pressedOut);
        zoomFactor = 5;
    });

    labelRenderer.domElement.addEventListener('mouseup', () =>{
        clearInterval(pressedIn);
        clearInterval(pressedOut);
        zoomFactor = 5;
    })
}


/* Interface select layers */
const select_layers = (texturesObject) => {
    const layersDropwdown = document.getElementById('dropwdown-layers');
    if(layersDropwdown!=null){

        const newContent = document.createElement('div');
        newContent.className = 'dropdown-content';

        for(const[key, value] of Object.entries(texturesObject)){
            const layerDropdown = document.createElement("div");
            layerDropdown.className = 'dropdown-area';
            const newNode = document.createElement("input");
            newNode.setAttribute('type', 'checkbox');
            newNode.className = 'checkbox-layer';
            newNode.checked = value.visible;
            newNode.setAttribute('property', key);
            const label = document.createElement("label");
            label.innerHTML = key;
            layerDropdown.appendChild(newNode);
            layerDropdown.appendChild(label);
            newContent.appendChild(layerDropdown);
        }

        const layerDropdown = document.createElement("div");
        layerDropdown.className = 'dropdown-area';
        layerDropdown.style.justifyContent = 'center';
        layerDropdown.style.margin = '0.45em';
        layerDropdown.style.borderRadius = '5px';

        const applyLayers = document.createElement("button");
        applyLayers.className = "dropdown-area-button";
        applyLayers.textContent = 'Apply layers';
        applyLayers.id = "apply-interface-layers";

        layerDropdown.appendChild(applyLayers);
        newContent.appendChild(layerDropdown);
        layersDropwdown.appendChild(newContent);
    }
}


/* User interface and experience functions */
function userInterface(labelRenderer, TrackballControls, texturesObject){

    // General UI/UX functions
    user_events();

    // Earth 3D Zoom in-out with wheel events
    user_zoom(labelRenderer, TrackballControls);

    // Select layers to apply
    select_layers(texturesObject);

}

const updateLoadingProgressBar = async (frac, delay=200) => {
    return new Promise(resolve => {
        const progress = document.getElementById("progress");
        progress.style.width = `${frac * 200}px`;
        setTimeout(resolve, delay)
    })
}

export {userInterface}