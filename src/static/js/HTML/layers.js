import * as HTML from "./functions.js"

const selectLayers = () => {
    const layers = document.querySelector(".layers");
    const layersData = user_data["threejs"]["textures"];
    layersData.forEach(element => {
        const name = element["name"];
        if(name != "earth_map"){
            const isVisible = element["visible"];
            const divCheckbox = HTML.createDivWithSpanAndCheckbox(name, name, isVisible);
            const selectOptions = [{value: "high", name:"High"} , {value: "ultrahigh", name:"Ultra-high"}];
            const divSelect = HTML.createDivWithSpanAndSelect("Quality", selectOptions);
            layers.append(divCheckbox, divSelect);
        }
    });
}

export function setLayersContent(){
    selectLayers();
}