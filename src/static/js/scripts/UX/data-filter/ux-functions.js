/* Replicates checkbox parent status to child checkboxes */
const forwardEvent = (domElement) => {
    const htmlElm = document.getElementById(domElement);
    if(htmlElm != null){
        htmlElm.addEventListener("change", ()=>{
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
        node.addEventListener("click", () => {
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
export const resetFilterOptions = (domElement, nodesClass) => {
    const htmlElm = document.getElementById(domElement);
    const checkboxes = document.getElementsByClassName(nodesClass);
    if (htmlElm != null && checkboxes!=null){
        let event = new Event("change");
        htmlElm.addEventListener("click", () => {
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


/* Insert sorted date node */
const insertDateAt = (date, refElement, domElement, parentName) =>{
    const newNode = document.createElement("input");
    newNode.setAttribute('type', 'checkbox');
    newNode.checked = true;
    newNode.setAttribute('property', 'date');
    newNode.value = date;
    newNode.classList.add(parentName, 'input-checkbox', 'checkbox-1');
    backwardEvent(newNode, parentName);
    const label = document.createElement("label");
    const dateUpdated = date.split("-");
    label.innerHTML = dateUpdated[2] + "/" + dateUpdated[1] + "/" + dateUpdated[0];
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "details-content-option";
    nodeDiv.id = "divFilter-" + date;
    nodeDiv.setAttribute('date', date);
    nodeDiv.appendChild(label);
    nodeDiv.appendChild(newNode);
    domElement.insertBefore(nodeDiv, refElement);
    forwardEvent(parentName);
}


/* Creates a single checkbox date filter from request */
const setNewDate = (date, domElement, parentName) =>{
    const htmlElm = document.getElementById(domElement);
    if(htmlElm != null){
        if(document.getElementById("divFilter-" + date)){
            return;
        }
        const date2Add = new Date(date);
        const arr = Object.values(htmlElm.children);
        let refId = null;
        for(let i=0; i<arr.length; i++){
            const currDate = new Date(arr[i].getAttribute('date'));
            if(date2Add < currDate){
                refId = arr[i];
                break
            }
        }
        insertDateAt(date, refId, htmlElm, parentName);
    }
}

/* Creates multiple date filter checkboxes from user data */
const setMultipleDates = (userKey, data, domElement, parentName) =>{
    const htmlElm = document.getElementById(domElement);
    if(htmlElm != null){
        const dataArr = data[userKey];
        for(let i = 0; i < dataArr.length; i++){
            const currData = dataArr[i];
            setNewDate(currData['date'], domElement, parentName);
        }
    }
}

/* Creates a new details section based on filter category */
const createDetailsContent = (labelToAdd, nodeToAdd) => {
    const nodeDiv = document.createElement("div");
    nodeDiv.className = "details-content-option";
    nodeDiv.appendChild(labelToAdd);
    nodeDiv.appendChild(nodeToAdd);
    return nodeDiv
}

/* Creates a new checkbox */
const createCheckBox = (value, property, key) => {
    const newNode = document.createElement("input");
    newNode.setAttribute('type', 'checkbox');
    newNode.setAttribute('property', property);
    newNode.value = value;
    newNode.checked = true;
    newNode.classList.add('filter_' + key, 'input-checkbox', 'checkbox-1');
    forwardEvent('filter_' + key);
    backwardEvent(newNode, 'filter_' + key); 
    return newNode
}

/* Set the options to filter data */
export const setFilterOptions = (boxKey, boxValue) => {
    switch (boxKey) { 
        case "country":
            const countryElement = document.getElementById('available_' + boxKey);
            if(countryElement != null) {
                for(let i = 0; i < boxValue.length; i++) {
                    const node = createCheckBox(boxValue[i]['value'], 'country', boxKey);
                    const label = document.createElement("label");
                    label.innerHTML = boxValue[i]['name'];
                    const div = createDetailsContent(label, node);     
                    countryElement.appendChild(div);
                }
            }
            break
        case "area":
            const areaElement = document.getElementById('available_' + boxKey);
            if(areaElement != null) {
                for(let i = 0; i < boxValue.length; i++) { 
                    const areaName = boxValue[i]['name'];
                    if(areaName != "World"){
                        const node = createCheckBox(boxValue[i]['value'], 'area', boxKey);
                        const label = document.createElement("label");
                        label.innerHTML = areaName;
                        const div = createDetailsContent(label, node);     
                        areaElement.appendChild(div);
                    }
                }
            }
            break
        case "firms":
            for(let i = 0; i < boxValue.length; i++) { 
                const element = boxValue[i]["property"];
                const values = boxValue[i]["values"];
                switch (element) {
                    case "source":
                        const sourceElement = document.getElementById('available_' + element);
                        if(sourceElement != null) {
                            for(let i = 0; i < values.length; i++) { 
                                const node = createCheckBox(values[i], 'source', element);
                                const label = document.createElement("label");
                                label.innerHTML = values[i].replace(/_/g, " ");
                                const div = createDetailsContent(label, node);     
                                sourceElement.appendChild(div);
                            }
                        }
                        break
                }
            }
            break
    }


}

export {setNewDate, setMultipleDates, filteredOptions};