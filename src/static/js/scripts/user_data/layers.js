/* Creates a textures input checkbox */
const createTextureSection = (name, isVisible, textures, texturesBackground) =>{
    const layerSection = document.createElement("div");
    layerSection.className = 'section';
    const newNode = document.createElement("input");
    newNode.setAttribute('type', 'checkbox');
    newNode.className = 'checkbox-layer';
    newNode.checked = isVisible;
    if(name != "starfield_map") {
        newNode.addEventListener("change", (event) => {
            const meshes = textures.children;
            for(let j=0; j < meshes.length; j++){
                if(meshes[j].name == name){
                    meshes[j].visible = event.target.checked;
                    break;
                }
            }
        });
    } else {
        newNode.addEventListener("change", (event) => {
            texturesBackground.visible = event.target.checked;
        });
    }
    newNode.setAttribute('property', name);
    const label = document.createElement("label");
    const labelName = name.replace(/_/g, " ");
    label.innerHTML = labelName[0].toUpperCase() + labelName.substring(1);
    layerSection.appendChild(newNode);
    layerSection.appendChild(label);
    return layerSection
}

/* Apply visibility property to texture Object */
const saveLayers = (texturesArray) => {
    for(let i = 0; i < texturesArray.length; i++) {
        const layerData = texturesArray[i]["name"];
        const optionChecked = document.querySelector(`.checkbox-layer[property = '${layerData}']`).checked;
        texturesArray[i]["visible"] = optionChecked;
        // here we should make a fetch
    }
}

/* Set layers options to display based on user data */
export const setTexturesOptions = (texturesArray, groupMesh, backgroundMesh) => {
    const layersDiv = document.getElementById("earth-layers");
    if(layersDiv != null){
        for(let i = 0; i < texturesArray.length; i++){
            const textureOption = createTextureSection(texturesArray[i]["name"], 
                                                        texturesArray[i]["visible"], 
                                                        groupMesh, 
                                                        backgroundMesh);
            layersDiv.appendChild(textureOption);
        }
        const applyLayers = document.createElement("button");
        applyLayers.className = "button-2 action-button";
        applyLayers.textContent = "Save layers";
        applyLayers.id = "save-interface-layers";
        applyLayers.addEventListener("click", () => {
            saveLayers(texturesArray);
        });
        const applyLayersDiv = document.createElement("div");
        applyLayersDiv.appendChild(applyLayers);
        layersDiv.appendChild(applyLayersDiv);
    }
}