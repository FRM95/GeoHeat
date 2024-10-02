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