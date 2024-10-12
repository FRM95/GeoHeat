import * as HTML from "./functions.js"
import { visibleTexture } from "../UX/events.js"

export function setLayersContent(){
    const layers = document.querySelector(".layers");
    const layersData = user_data["threejs"]["textures"];
    layersData.forEach(element => {
        const name = element["name"];
        if(name != "earth_map"){
            const isVisible = element["visible"];
            const divCheckbox = HTML.createDivWithSpanAndCheckbox("enable-texture", name, name, isVisible);
            const selectOptions = [{value: "high", name:"High"} , {value: "ultrahigh", name:"Ultra-high"}];
            const divSelect = HTML.createDivWithSpanAndSelect("quality", "Quality", selectOptions);
            layers.append(divCheckbox, divSelect);
        }
    });
}

export function setLayersVisibility(scene){
    const layersCheckbox = document.querySelectorAll(".enable-texture");
    layersCheckbox.forEach(checkbox => {
        checkbox.addEventListener("click", () => {
            visibleTexture(scene, checkbox.name)
        })
    })
}


