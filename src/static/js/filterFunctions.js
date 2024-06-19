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


/* Insert sorted date node */
const insertDateAt = (date, refElement, domElement, parentName) =>{
    const newNode = document.createElement("input");
    newNode.setAttribute('type', 'checkbox');
    newNode.checked = true;
    newNode.setAttribute('property', 'date');
    newNode.value = date;
    newNode.className = parentName;
    backwardEvent(newNode, parentName);
    const label = document.createElement("label");
    const dateUpdated = date.split("-");
    label.innerHTML = dateUpdated[2] + "/" + dateUpdated[1] + "/" + dateUpdated[0];
    const nodeDiv = document.createElement("div");
    nodeDiv.id = "divFilter-" + date;
    nodeDiv.setAttribute('date', date);
    nodeDiv.appendChild(label);
    nodeDiv.appendChild(newNode);
    domElement.insertBefore(nodeDiv, refElement);
    forwardEvent(parentName);
}


/* Creates a single checkbox date filter from rerquest */
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

/* Creates checkbox filters data (source, area, and country) */
const setCheckbox = (boxKey, boxValue) => {
    const htmlElm = document.getElementById('available' + boxKey);
    if(htmlElm != null){
        const arrValues = boxValue;
        for(let i = 0; i < arrValues.length; i++){

            const currOpt = arrValues[i];
            const newNode = document.createElement("input");
            newNode.setAttribute('type', 'checkbox');
            newNode.checked = true;
            const label = document.createElement("label");
            const nodeDiv = document.createElement("div");

            if('area' in currOpt){
                if(currOpt['name'] != "World"){
                    newNode.value = currOpt['name'];
                    newNode.setAttribute('property', 'region');
                    newNode.className = 'filter' + boxKey;
                    forwardEvent('filter' + boxKey);
                    backwardEvent(newNode, 'filter' + boxKey);
                    label.innerHTML = currOpt['name'];
                    nodeDiv.appendChild(label);
                    nodeDiv.appendChild(newNode);
                    htmlElm.appendChild(nodeDiv); 
                }
            }

            else if('country' in currOpt){
                newNode.value = currOpt['country'];
                newNode.setAttribute('property', 'nasa_abreviation');
                newNode.className = 'filter' + boxKey;
                forwardEvent('filter' + boxKey);
                backwardEvent(newNode, 'filter' + boxKey);
                label.innerHTML = currOpt['name'];
                nodeDiv.appendChild(label);
                nodeDiv.appendChild(newNode);
                htmlElm.appendChild(nodeDiv); 
            }

            else if('source' in currOpt){
                newNode.value = currOpt['source'];
                newNode.setAttribute('property', 'source');
                newNode.className = 'filter' + boxKey;
                forwardEvent('filter' + boxKey);
                backwardEvent(newNode, 'filter' + boxKey);
                label.innerHTML = currOpt['source'].replace(/_/g, " ");
                nodeDiv.appendChild(label);
                nodeDiv.appendChild(newNode);
                htmlElm.appendChild(nodeDiv); 
            }
        }
    }
}

export {setCheckbox, setNewDate, setMultipleDates, filteredOptions, resetDefault};