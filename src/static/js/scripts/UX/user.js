const sidebar = document.getElementById('container-sidebar');
const Areasidebar = document.getElementById('area-sidebar');
const hideSidebar = document.getElementById('collapse-sidebar');

const zoomIn = document.getElementById('zoom-in');
const zoomOut = document.getElementById('zoom-out');
const cameraDefault = document.getElementById('camera-default');
const labelDivInfo = document.getElementById("markerInformation");
const headerTabs = document.querySelectorAll('.header-tab');
const windowItems = document.querySelectorAll('[data-title-2]');

/*TODO: TERMINAR DE PONER NOMBRES BONITOS*/
const searchInput = document.getElementById('input-location-search');
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
            searchInput.setAttribute("data-location_name", target.getAttribute("name"));
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
        if(sidebar.ariaExpanded === "false"){
            hideSidebar.setAttribute("data-title", "Open panel");
        }
        else{
            hideSidebar.setAttribute("data-title", "Close panel");
        }
        let containerWindow = document.getElementById('container-window');
        let minWindow = document.getElementById('min-window');
        if(containerWindow != null && minWindow != null && containerWindow.ariaExpanded === "true"){
            minWindow.dispatchEvent(new Event("click"));
        }
    });

    /* Add events to every data-action and data-section HTML element */
    const uxElements = document.querySelectorAll('.ux-event');
    uxElements.forEach( function(element) {
        const section = element.getAttribute("data-section");
        const action = element.getAttribute("data-action");
        const elementToEvent = document.querySelector(`[data-content = '${section}']`);
        if(elementToEvent != null) {
            switch (action) {
                case "hide-element":
                    element.addEventListener("click", () => {
                        elementToEvent.ariaHidden = elementToEvent.ariaHidden !== 'true'; })
                    break
                case "expand-element":
                    element.addEventListener("click", () => {
                        elementToEvent.ariaExpanded = elementToEvent.ariaExpanded !== 'true'; })
                    break
                case "change-sidebar":
                    element.addEventListener("click", () => {
                        if(elementToEvent.ariaHidden == 'true'){
                            elementToEvent.ariaHidden = 'false';
                            const areaSections = document.querySelectorAll(".area-section");
                            areaSections.forEach(function(areaToShow){
                                if(areaToShow.getAttribute("data-content") != section){
                                    areaToShow.ariaHidden = 'true';
                                }
                            });
                        }
                        if(sidebar.ariaExpanded == 'false'){
                            hideSidebar.dispatchEvent(new Event("click"));
                        }
                    })
                    break
                }   
                
            }
    });

    // Maximize window
    const maxWindow = document.getElementById('max-window');
    maxWindow.addEventListener('click', () => {
        let containerWindow = document.getElementById('container-window');
        if(containerWindow != null && containerWindow.ariaExpanded === "false"){
            const newWidth = window.innerWidth * 0.75;
            if(sidebar.ariaExpanded === "true"){
                hideSidebar.dispatchEvent(new Event("click"));
            }
            if(labelDivInfo.offsetWidth != 0){
                closeBtn.dispatchEvent(new Event("pointerdown"));
            }
            containerWindow.style = `width: ${newWidth}px; max-width: ${newWidth}px;`;
            containerWindow.ariaExpanded = containerWindow.ariaExpanded !== 'true';
        }
    });

    // Minimize window
    const minWindow = document.getElementById('min-window');
    minWindow.addEventListener('click', () => {
        let containerWindow = document.getElementById('container-window');
        if(containerWindow != null && containerWindow.ariaExpanded === "true"){
            containerWindow.style = "";
            containerWindow.ariaExpanded = containerWindow.ariaExpanded !== 'true';
        }
    });

    // Search countries and areas
    searchInput.addEventListener("input", (e) => {
        let value = e.target.value;
        if(value.trim()){
            value = value.trim().toLowerCase();
            let countries = setList(countries_data.filter(country => {
                return country["name"].toLowerCase().includes(value)
            })); 
            if(countries){
                listDiv.ariaHidden = "false";
            } else {
                let areas = setList(areas_data.filter(area => {
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

    /* window item information (marker) */
    windowItems.forEach(function(hover) {
        hover.addEventListener("mouseover", () => {
            const data = hover.getAttribute('data-title-2');
            const displayData = document.querySelector('.window-item-information');
            if(displayData != null && data != null){
                displayData.lastElementChild.innerHTML = data;
                displayData.ariaHidden = 'false';
            }
        });
        hover.addEventListener("mouseout", () => {
            const displayData = document.querySelector('.window-item-information');
            if(displayData != null){
                displayData.ariaHidden = 'true';
            }
        });
    });
}


/* LabelRenderer Zoom in/Out */
const user_zoom = (labelRenderer, TrackballControls) => {

    let pressedIn;
    let pressedOut;
    let zoomFactor = 5;
    const delay = 0.5;

    const earthCompass = document.getElementById("compass");
    earthCompass.addEventListener("click", () => {
        const cameraTools = document.getElementById("camera-tools");
        if(cameraTools != null){
            cameraTools.ariaHidden = cameraTools.ariaHidden !== "true";
        }
    })

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

    cameraDefault.addEventListener("click", () =>{
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


/* User interface and experience functions */
function userInterface(labelRenderer, TrackballControls){

    // General UI/UX functions
    user_events();

    // Earth 3D Zoom in-out with wheel events
    user_zoom(labelRenderer, TrackballControls);

}

export {userInterface}