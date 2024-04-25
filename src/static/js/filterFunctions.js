/*---------EVENTS METHODS---------*/

/* Event to propagate element check status to child elements */
function copyToChildEvent(element, elementChild){
    element.addEventListener("change", event => {
      let toChange = element.checked;
      elementChild.checked = toChange;
      elementChild.dispatchEvent(new Event("change"));
    })
}
  
/* Event to propagate child elements status to parent element */
function copyToFatherEvent(element){
    element.addEventListener("click", event => {
        let parentId = element.getAttribute("parentid");
        while(parentId != "null"){
        let parentElement = document.getElementById(parentId);
        let elementClassName = element.className;
        let equalElements = document.getElementsByClassName(elementClassName);
        let equalElementsLen = equalElements.length;
        let toChange = false;
        for(let i = 0; i < equalElementsLen; i++){
            if(equalElements[i].checked === true){
            toChange = true;
            }
        }
        parentElement.checked = toChange;
        parentId = parentElement.getAttribute("parentid");
        }
    });
}

/* Recursive method to iterate from bottom to top */
function recursionToTop(element){
    copyToFatherEvent(element);
    let upperId = element.getAttribute("parentid");
    if(upperId != "null"){
        let upperElement = document.getElementById(upperId);
        recursionToTop(upperElement);
    }
}

/* Recursive method to iterate from top to bottom */
function recursionToBottom(element){
    let childClass = element.getAttribute("childClass");
    if(childClass == "null"){
        return recursionToTop(element);
    }
    let childElements = document.getElementsByClassName(childClass);
    let childElementsLen = childElements.length;
    for(let i = 0; i < childElementsLen; i++){
        copyToChildEvent(element, childElements[i]);
        recursionToBottom(childElements[i]);
    }
}
  

/*---------ADD DATA TO FILTERS METHODS---------*/

/* Method to add available areas */
function addAreas(data){
    let areasDiv = document.getElementById("available-areas");
    if(areasDiv != null){
        for(const [key, value] of Object.entries(data)){
        let div = document.createElement("div");
        let label = document.createElement("label");
        let checkbox = document.createElement("input");
        checkbox.type= "checkbox";
        checkbox.value = value;
        checkbox.checked = true;
        checkbox.className = "area-checkbox"
        checkbox.id = "area-checkbox " + value.replace(/\s+/g, '-');
        checkbox.setAttribute("childClass", "area-checkbox-country " + value.replace(/\s+/g, '-'));
        checkbox.setAttribute("parentId", "area-filter");
        label.innerText = value;
        label.setAttribute("for", checkbox.id);
        let countryDetails = document.createElement("details");
        countryDetails.id = value + '-details';
        let countrySummary = document.createElement("summary");
        countrySummary.innerText = "";
        countryDetails.appendChild(countrySummary);
        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(countryDetails);
        areasDiv.appendChild(div);
        }
    }
}
  
/* Method to add available countries for each area */
function addAreaCountries(data){
    for(const [key, value] of Object.entries(data)){
        let parentNode = document.getElementById(value.SUBREGION + "-details");
        if(parentNode!=null){
        let element = document.createElement("div");
        let checkbox = document.createElement("input");
        let label = document.createElement("label");
        let space = document.createElement("br");
        checkbox.type = "checkbox";
        checkbox.value = value.WB_NAME;
        checkbox.className = "area-checkbox-country " + value.SUBREGION.replace(/\s+/g, '-');
        checkbox.id = "area-checkbox-country " + value.WB_NAME.replace(/\s+/g, '-');
        checkbox.setAttribute("childClass", "null");
        checkbox.setAttribute("parentId", "area-checkbox " + value.SUBREGION.replace(/\s+/g, '-'));
        checkbox.checked = true;
        label.innerText = value.WB_NAME;
        label.setAttribute("for", checkbox.id);
        element.appendChild(checkbox);
        element.appendChild(label);
        element.appendChild(space);
        parentNode.appendChild(element);
        }
    }
}

/* Method to add available countries */
function addCountries(data){
    for(const [key, value] of Object.entries(data)){
        let parentNode = document.getElementById('available-countries');
        let element = document.createElement("div");
        let checkbox = document.createElement("input");
        let label = document.createElement("label");
        let space = document.createElement("br");
        checkbox.type= "checkbox";
        checkbox.value = value.WB_NAME;
        checkbox.checked = false;
        checkbox.className = "country-checkbox";
        checkbox.id = "area-checkbox " + value.WB_NAME.replace(/\s+/g, '-');
        checkbox.setAttribute("childClass", "null");
        checkbox.setAttribute("parentId", "country-filter");
        label.setAttribute("for", checkbox.id);
        label.innerText = value.WB_NAME;
        element.appendChild(checkbox);
        element.appendChild(label);
        element.appendChild(space);
        parentNode.appendChild(element);
    }
}

function addDates(data){
}
function addTimes(data){
}
function addSources(data){   
}
function addConfidences(data){
}
  


/*---------CREATE FILTERS METHODS---------*/

/* Method to apply filters related to available areas */
function applyAreaFilter(areaData, countryData){
    let areafilter = document.getElementById("area-filter");
    areafilter.checked = true;
    areafilter.setAttribute("childClass", "area-checkbox");
    areafilter.setAttribute("parentId", "null");
    addAreas(areaData);
    addAreaCountries(countryData);
    recursionToBottom(areafilter);
}


/* Method to apply filters related to available areas */
function applyCountryFilter(countryData){
    let countryfilter = document.getElementById("country-filter");
    countryfilter.checked = false;
    countryfilter.setAttribute("childClass", "country-checkbox");
    countryfilter.setAttribute("parentId", "null");
    addCountries(countryData);
    recursionToBottom(countryfilter);
}

function applyDateFilter(dateData){
    let datefilter = document.getElementById("date-filter");
    datefilter.checked = true;
    datefilter.setAttribute("childClass", "");
    datefilter.setAttribute("parentId", "null");
    addDates(dateData);
    recursionToBottom(datefilter);
}

function applyTimeFilter(timeData){
    let timefilter = document.getElementById("time-filter");
    timefilter.checked = true;
    timefilter.setAttribute("childClass", "");
    timefilter.setAttribute("parentId", "null");
    addTimes(timeData);
    recursionToBottom(timefilter);
}

function applySourceFilter(sourceData){
    let sourcefilter = document.getElementById("source-filter");
    sourcefilter.checked = true;
    sourcefilter.setAttribute("childClass", "");
    sourcefilter.setAttribute("parentId", "null");
    addSources(sourceData);
    recursionToBottom(countryfilter);
}

function applyConfidenceFilter(confidenceData){
    let countryfilter = document.getElementById("confidence-filter");
    countryfilter.checked = false;
    countryfilter.setAttribute("childClass", "");
    countryfilter.setAttribute("parentId", "null");
    addConfidences(confidenceData);
    recursionToBottom(countryfilter);
}



/*---------GET FILTERS VALUES---------*/
  
/* Method to get countries related to area filter */
function getAreaMarkedBoxes(element){
    let currentFilter = document.getElementById(element);
    let subArray = [];
    if(currentFilter.checked){
        let filterClasses = document.getElementsByClassName("area-checkbox");
        let totalLen = filterClasses.length;
        for(let i = 0; i < totalLen; i++){
            if(filterClasses[i].checked){
            let areaSubchild = filterClasses[i].getAttribute("childclass");
            let areaSubClasses = document.getElementsByClassName(areaSubchild);
            let subLen = areaSubClasses.length;
            for(let j = 0; j < subLen; j++){
                if(areaSubClasses[j].checked){
                subArray.push(areaSubClasses[j].value);
                }
            }
            }
        }
        }
    return subArray
}
  
/* Method to get child input boxed checked related to a filter */
function getMarkedBoxes(element){
    let currentFilter = document.getElementById(element);
    let subArray = [];
    if(currentFilter.checked){
        let childClass = currentFilter.getAttribute("childclass");
        let filterClasses = document.getElementsByClassName(childClass);
        let totalLen = filterClasses.length;
        for(let i = 0; i < totalLen; i++){
        if(filterClasses[i].checked){
            subArray.push(filterClasses[i].value)
        }
        }
    }
    return subArray
}
  














  function getCountries(areaFilter, countriesFilter){
    let arrayCountries1 = getAreaMarkedBoxes(areaFilter);
    let arrayCountries2 = getMarkedBoxes(countriesFilter);
    let arrayCountries = [...new Set([...arrayCountries1, ...arrayCountries2])];
    return arrayCountries
  }
  
  export {applyAreaFilter, applyCountryFilter, getCountries}