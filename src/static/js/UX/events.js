import { searchTexture } from "../ThreeJS/main.js";

/* Expand elements functionality event */
export const expandEvent = (node) =>{
    const className = node.getAttribute("expand-element");
    const element = document.querySelector(`.${className}`)
    element.dataset.expanded = element.dataset.expanded !== "true";
}

/* Change content elements functionality event */
export const displayEvent = (node) => {
    const clickedClassName = node.getAttribute("display-element");
    const elementsToDisplay = document.querySelectorAll(".display");
    elementsToDisplay.forEach(element => {
        if(element.classList.contains(clickedClassName)){
            element.dataset.hidden = "false";
            const parentNode = element.parentElement;
            const parentExpanded = parentNode.getAttribute("data-expanded");
            if(parentExpanded == "false"){
                parentNode.setAttribute("data-expanded", true);
            }
        } else {
            element.dataset.hidden = "true";
        }
    })
}

/* Visible elements functionality event */
export const visibleEvent = (node) => {
    const className = node.getAttribute("visible-element");
    const element = document.querySelector(`.${className}`)
    element.dataset.visible = element.dataset.visible !== "true";
}

/* Remove content and hide event */
export const removeEvent = (resultsElement) =>{
    resultsElement.innerHTML = "";
    resultsElement.dataset.hidden = "true";
}

/* Message event */
export const messageEvent = (resultsElement, message) =>{
    resultsElement.innerHTML = "";
    const span = document.createElement("span");
    span.textContent = message
    resultsElement.appendChild(span);
}

/* Texture visible event */
export const visibleTexture = (scene, textureName) => {
    const children = scene.children;
    const texture = searchTexture(children, textureName);
    if(texture != null){
        texture.visible = texture.visible !== true;
        console.log(texture)
    }
}