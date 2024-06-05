/* Replicates checkbox parent status to child checkboxes */
const forwardEvent = (domElement) => {
    const htmlElm = document.getElementById(domElement);
    if(htmlElm != null){
        htmlElm.addEventListener("change", _ =>{
            let newState = htmlElm.checked;
            let childs = document.getElementsByClassName(htmlElm.id);
            for (let i = 0; i < childs.length; i++) {
                childs[i].checked = newState;
            }
        });
    }
}

/* Changes checkbox parent status based on child checkboxes */
const backwardEvent = (node, parentElem) => {
    const parentNode = document.getElementById(parentElem);
    if(node != null && parentNode != null){
        node.addEventListener("click", _ => {
            let newState = false;
            let equalNodes = document.getElementsByClassName(node.className);
            for (let i = 0; i < equalNodes.length; i++) {
                if (equalNodes[i].checked == true) {
                    newState = true;
                }
            }
            parentNode.checked = newState;
        });
    }
}

/* Applies default status (true) to all checkboxes */
const resetDefault = (domElement, nodesClass) => {
    const htmlElm = document.getElementById(domElement);
    const checkboxes = document.getElementsByClassName(nodesClass);
    if (htmlElm != null && checkboxes!=null){
        let event = new Event("change");
        htmlElm.addEventListener("click", _ => {
            for(let i = 0; i<checkboxes.length; i++){
                checkboxes[i].checked = true;
                checkboxes[i].dispatchEvent(event);
            }
        });
    }
}

/* Obtains filtered options */
const filteredOptions = (checkboxes) => {
    let result = {};
    for(let i = 0; i<checkboxes.length; i++){
        if(checkboxes[i].checked == true){
            const className = checkboxes[i].id;
            const childBoxes = document.getElementsByClassName(className);
            for(let j = 0; j<childBoxes.length; j++){
                if (childBoxes[j].checked == true){
                    const key = childBoxes[j].getAttribute('property');
                    const value = childBoxes[j].value;
                    if (key in result){
                        result[key].add(value);
                    }
                    else{
                        result[key] = new Set([value]);
                    }
                }
            }
        }
    }
    return result
}

/* Returns filtered data based on options array */
const applyFilter = (data, options) =>{
    let result = [];
    if (Object.keys(options).length < 1){
        return result
    }
    for(let i = 0; i<data.length; i++){
        let obj = data[i];
        let flag = true;
        for(const[key, value] of Object.entries(obj)){
            if(key in options){
                let filterValues = options[key];
                if (!filterValues.has(value)){
                    flag = false;
                    break;
                }
            }
        }
        if(flag){
            result.push(obj);
        }
    }
    return result
}

/* Creates checkbox filters data */
const setCheckbox = (data, parentElem, domElement, valueProp, labelProp) => {
    const htmlElm = document.getElementById(domElement);
    if(htmlElm != null && parentElem != null){
        forwardEvent(parentElem);
        for (let i = 0; i<data.length; i++){
            if(data[i][valueProp] === "World"){
                continue
            }
            const nodeDiv = document.createElement("div");
            nodeDiv.id = data[i][valueProp] + '-div';
            const node = document.createElement("input");
            node.setAttribute('type', 'checkbox');
            node.name = data[i][valueProp] + '-checkbox';
            node.value = data[i][valueProp];
            node.checked = true;
            node.id = data[i][valueProp] + '-checkbox';
            node.className = parentElem;
            node.setAttribute('property', valueProp);
            const label = document.createElement("label");
            label.innerHTML = data[i][labelProp];
            label.setAttribute('for', node.name);
            label.id = data[i][valueProp] + '-label';
            nodeDiv.appendChild(label);
            nodeDiv.appendChild(node);
            htmlElm.appendChild(nodeDiv);     
            backwardEvent(node, parentElem); 
        }
    }
}

export {setCheckbox, resetDefault, filteredOptions, applyFilter};