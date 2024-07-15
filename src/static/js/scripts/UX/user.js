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


/* Interface select layers */
const user_events = () =>{

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
}


/* LabelRenderer Zoom in/Out */
const user_zoom = (labelRenderer, TrackballControls) => {

    let pressedIn;
    let pressedOut;
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
                labelRenderer.domElement.dispatchEvent(wheelEvent(0, -70));
            }, 20);
        }
    });
    zoomIn.addEventListener('mouseup', event => {
        if(event.button == 0){
            clearInterval(pressedIn);
        }
    });
    zoomOut.addEventListener("mousedown", event => {
        if(event.button == 0){
            pressedOut = setInterval(() => {
                labelRenderer.domElement.dispatchEvent(wheelEvent(0, +70));
            }, 20);
        }
    });
    zoomOut.addEventListener('mouseup', event => {
        if(event.button == 0){
            clearInterval(pressedOut);
        }
    });
    zoomDefault.addEventListener("click", _ =>{
        TrackballControls.reset();
    });
}


/* Interface select layers */
const select_layers = (textureProperties) => {
    const layersDropwdown = document.getElementById('dropwdown-layers');
    if(layersDropwdown!=null){
        const newContent = document.createElement('div');
        newContent.className = 'dropdown-content';
        for(const[key, value] of Object.entries(textureProperties)){
            const layerDropdown = document.createElement("div");
            const newNode = document.createElement("input");
            newNode.setAttribute('type', 'checkbox');
            newNode.className = 'checkbox-layer';
            newNode.checked = value;
            newNode.setAttribute('property', key);
            const label = document.createElement("label");
            label.innerHTML = key;
            layerDropdown.appendChild(newNode);
            layerDropdown.appendChild(label);
            newContent.appendChild(layerDropdown);
        }
        const applyLayers = document.createElement("button");
        applyLayers.className = "action-button";
        applyLayers.textContent = "Apply";
        applyLayers.id = "apply-interface-layers";
        newContent.appendChild(applyLayers);
        layersDropwdown.appendChild(newContent);
    }
}


/* User interface and experience functions */
function userInterface(labelRenderer, TrackballControls, textureProperties){

    // General UI/UX functions
    user_events();

    // Earth 3D Zoom in-out with wheel events
    user_zoom(TrackballControls, labelRenderer);

    // Select layers to apply
    select_layers(textureProperties);

}

/* Apply layers to texture Object */
function applyLayers(textureProperties){
    const checkBoxLayers = document.getElementsByClassName("checkbox-layer");
    for(let i = 0; i < checkBoxLayers.length; i++){
        const layerProp = checkBoxLayers[i].getAttribute('property');
        const ischecked = checkBoxLayers[i].checked;
        textureProperties[layerProp] = ischecked;
    }
    return textureProperties
}


export {userInterface, applyLayers}