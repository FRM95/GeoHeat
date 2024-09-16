/* Set layers to display based on user data */
const setLayerOptions = (texturesObject) => {
    const layersDiv = document.getElementById('earth-layers');
    if(layersDiv!=null){
        for(const[key, value] of Object.entries(texturesObject)){
            const layerSection = document.createElement("div");
            layerSection.className = 'section';
            const newNode = document.createElement("input");
            newNode.setAttribute('type', 'checkbox');
            newNode.className = 'checkbox-layer';
            newNode.checked = value.visible;
            newNode.setAttribute('property', key);
            const label = document.createElement("label");
            label.innerHTML = key;
            layerSection.appendChild(newNode);
            layerSection.appendChild(label);
            layersDiv.appendChild(layerSection);
        }
        const applyLayers = document.createElement("button");
        applyLayers.className = "button-2 action-button";
        applyLayers.textContent = 'Apply layers';
        applyLayers.id = "apply-interface-layers";
        const applyLayersDiv = document.createElement("div");
        applyLayersDiv.appendChild(applyLayers);
        layersDiv.appendChild(applyLayersDiv);
    }
}