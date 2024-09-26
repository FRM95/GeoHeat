/* ---------------------------- UX FUNCTIONALITY ---------------------------- */
const filterHidden = '<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="currentColor" class="bi bi-filter-circle-fill" viewBox="0 0 16 16"><path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16M3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1M5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5m2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5"/></svg>'
const filterExpanded = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 16 16"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"/></svg>'

/* Add events to every data-action and data-section HTML element */
const applyUX = () => {
    const uxElements = document.querySelectorAll('.ux-event');
    uxElements.forEach(function(element){
        const section = element.getAttribute("data-section");
        const action = element.getAttribute("data-action");
        const elementToEvent = document.querySelector(`[data-content = '${section}']`);
        if(elementToEvent != null) {
            switch (action) {
                case "hide-element":
                    element.addEventListener("click", () => {
                        elementToEvent.ariaHidden = elementToEvent.ariaHidden !== 'true'; })
                    break
                case "expand-element":
                    if(section === "Sidebar"){
                        const hideSidebar = document.getElementById('collapse-sidebar');
                        element.addEventListener("click", () => {
                            elementToEvent.ariaExpanded = elementToEvent.ariaExpanded !== 'true';
                            if(elementToEvent.ariaExpanded === "false"){
                                hideSidebar.setAttribute("data-title", "Open panel");
                            } else {
                                hideSidebar.setAttribute("data-title", "Close panel");
                            }
                        });
                    } else if(section === "Filter"){
                        element.addEventListener("click", () => {
                            elementToEvent.ariaExpanded = elementToEvent.ariaExpanded !== 'true';
                            if(elementToEvent.ariaExpanded === 'false'){
                                element.innerHTML = filterHidden;
                                element.setAttribute("data-title", "Open filter panel");
                            } else {
                                element.innerHTML = filterExpanded;
                                element.setAttribute("data-title", "Close filter panel");
                            }

                        });
                    } else {
                        element.addEventListener("click", () => {
                            elementToEvent.ariaExpanded = elementToEvent.ariaExpanded !== 'true';
                        });
                    }
                    break
                case "change-sidebar":
                    element.addEventListener("click", () => {
                        if(elementToEvent.ariaHidden == 'true'){
                            elementToEvent.ariaHidden = 'false';
                            const areaSections = document.querySelectorAll(".area-section");
                            areaSections.forEach(function(areaToShow){
                                if(areaToShow.getAttribute("data-content") != section){
                                    areaToShow.ariaHidden = 'true';
                                }
                            });
                        }
                        if(sidebar.ariaExpanded == 'false'){
                            hideSidebar.dispatchEvent(new Event("click"));
                        }
                    })
                    break
                }   
                
            }
    });
}

/* Window item information hover related to a heat spot (marker) */
const spotHoverInfo = () => {
    const windowItems = document.querySelectorAll('[data-title-2]');
    windowItems.forEach(function(hover) {
        hover.addEventListener("mouseover", () => {
            const data = hover.getAttribute('data-title-2');
            const displayData = document.querySelector('.window-item-information');
            if(displayData != null && data != null){
                displayData.lastElementChild.innerHTML = data;
                displayData.ariaHidden = 'false';
            }
        });
        hover.addEventListener("mouseout", () => {
            const displayData = document.querySelector('.window-item-information');
            if(displayData != null){
                displayData.ariaHidden = 'true';
            }
        });
    });
}

/* Window item date information hover related to a mesh UTC date */
const dateHoverInfo = () => {
    const dateExplanation = document.querySelector('.filter-explanation');
    const displayData = document.querySelector('.window-item-filter-information');
    dateExplanation.addEventListener("mouseover", () => {
        displayData.ariaHidden = 'false';
    });
    dateExplanation.addEventListener("mouseout", () => {
        displayData.ariaHidden = 'true';
    });
}

/* Geo heat spots filter selection button */
const filterInfo = () => {
    const filterButtons = document.querySelectorAll('.filter-dates');
    const explanation = document.querySelector(".filter-explanation");
    filterButtons.forEach(function(button) {
        button.addEventListener("click", (e) => {
            if(button.getAttribute("data-selected") != "true"){
                explanation.innerHTML = button.getAttribute("data-text");
                button.setAttribute("data-selected", true);
                document.querySelectorAll('.filter-dates').forEach(buttonToHide => {
                    if(buttonToHide != e.target){
                        buttonToHide.setAttribute("data-selected", false);
                    }
                }); 
                document.querySelectorAll(".filter-spots-number").forEach(spotsToHide => {
                    if(spotsToHide.id != button.id + '-spots'){
                        spotsToHide.ariaHidden = "true";
                    } else {
                        spotsToHide.ariaHidden = "false";
                    }
                });
                button.dispatchEvent(new Event("change"))
            }
        });
    });
}

/* NASA LINKS */
const wikiLink = "https://en.wikipedia.org/wiki/";
const svgWiki = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-wikipedia" viewBox="0 0 16 16"><path d="M8.835 3.003c.828-.006 2.688 0 2.688 0l.033.03v.288q0 .12-.133.12c-.433.02-.522.063-.68.29-.087.126-.258.393-.435.694l-1.52 2.843-.043.089 1.858 3.801.113.031 2.926-6.946q.152-.42-.044-.595c-.132-.114-.224-.18-.563-.195l-.275-.014a.16.16 0 0 1-.096-.035.1.1 0 0 1-.046-.084v-.289l.042-.03h3.306l.034.03v.29q0 .117-.133.117-.65.03-.962.281a1.64 1.64 0 0 0-.488.704s-2.691 6.16-3.612 8.208c-.353.672-.7.61-1.004-.019A224 224 0 0 1 8.044 8.81c-.623 1.285-1.475 3.026-1.898 3.81-.411.715-.75.622-1.02.019-.45-1.065-1.131-2.519-1.817-3.982-.735-1.569-1.475-3.149-1.943-4.272-.167-.4-.293-.657-.412-.759q-.18-.15-.746-.18Q0 3.421 0 3.341v-.303l.034-.03c.615-.003 3.594 0 3.594 0l.034.03v.288q0 .119-.15.118l-.375.016q-.483.02-.483.288-.002.125.109.4c.72 1.753 3.207 6.998 3.207 6.998l.091.023 1.603-3.197-.32-.71L6.24 5.095s-.213-.433-.286-.577l-.098-.196c-.387-.77-.411-.82-.865-.88-.137-.017-.208-.035-.208-.102v-.304l.041-.03h2.853l.075.024v.303q0 .104-.15.104l-.206.03c-.523.04-.438.254-.09.946l1.057 2.163 1.17-2.332c.195-.427.155-.534.074-.633-.046-.055-.202-.144-.54-.158l-.133-.015a.16.16 0 0 1-.096-.034.1.1 0 0 1-.045-.085v-.288l.041-.03Z"/></svg>'
const instrumentLink = "https://www.earthdata.nasa.gov/learn/find-data/near-real-time/";
// const questionSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-info-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/><path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0"/></svg>'
const landsat = 'https://www.earthdata.nasa.gov/faq/firms-faq#ed-landsat-fires-attributes';
const modis = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/mcd14dl-nrt#ed-firms-attributes';
const viirs = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/vnp14imgtdlnrt#ed-viirs-375m-attributes';
const noaa20 = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/vj114imgtdlnrt';
const noaa21 = 'https://www.earthdata.nasa.gov/learn/find-data/near-real-time/firms/vj214imgtdlnrt';

/* Check the name of the satellite associated to a heat spot and returns its link */
const checkSatellite = (name) => {
    let returnLink = null;
    let returnName = null;
    switch (name) {
        case 'L8':
            returnLink = landsat;
            returnName = 'Lansat 8';
            break
        case 'L9':
            returnLink = landsat;
            returnName = 'Lansat 9';
            break
        case 'Aqua':
            returnLink = modis;
            returnName = 'Modis Aqua';
            break
        case 'Terra':
            returnLink = modis;
            returnName = 'Modis Terra';
            break
        case 'N':
            returnLink = viirs;
            returnName = 'Suomi NPP';
            break
        case 'N20':
            returnLink = noaa20;
            returnName = 'NOAA-20';
            break
        case 'N21':
            returnLink = noaa21;
            returnName = 'NOAA-21';
            break
    }
    return {link:returnLink, name:returnName}
}

/* UX for display heat spot information over the marker label and marker information divs */
export const displayFireData = (dataObject, identifier, markerElement, markerInformation) => {

    /* Delete previous marker content */
    const markersGrid = document.querySelectorAll('.marker-property');
    markersGrid.forEach((property) => {
        property.ariaHidden = "true";
        const value = property.lastChild;
        if(value != null){
            value.innerHTML = "";
        }
    });

    /* Spot attributes link */
    let attributesLink = null;

    /* Updates with new marker content */
    for(const[key, value] of Object.entries(dataObject)){
        const htmlElm = document.getElementById(key);
        const markerGrid = document.querySelector(`.marker-property[data-content = ${key}]`);
        if(htmlElm){
            if(key == 'country' || key == 'region' || key == 'subregion'){
                const wikiRef = `<a target="_blank" href="${wikiLink}${value}" class="link-url d-flex centered">${svgWiki}</a>`;
                htmlElm.innerHTML = `${value} ${wikiRef}`;
            }
            else if(key == 'instrument'){
                const intrumentRef = `<a target="_blank" href="${instrumentLink}${value}" class="link-url d-flex centered">${value}</a>`;
                htmlElm.innerHTML = intrumentRef;
            }
            else if(key == 'satellite'){
                const attrObject = checkSatellite(value);
                const attrLink = attrObject.link;
                const attrName = attrObject.name;
                if(attrLink != null){
                    attributesLink = attrLink;
                }
                if(attrName != null){
                    htmlElm.innerHTML = attrName;
                }
            }
            else if(key == 'bright_ti4' || key == 'bright_ti5' || key == 'bright_t31' || key == 'brightness'){
                htmlElm.innerHTML = `${value} K`;
            }
            else if(key == "frp"){
                htmlElm.innerHTML = `${value} MW`;
            }
            else if(key == "acq_date"){
                htmlElm.innerHTML = value.split("-").toReversed().join("-");
            }
            else{
                htmlElm.innerHTML = value;
            }
            markerGrid.ariaHidden = "false";
        }
    }

    /* Updates values of marker Earth */
    const idLabel = document.getElementById('spot-id-label');
    const attributesLabel = document.getElementById('spot-attributes-link');
    /* If we have the ID and the attributes heat spot, display spot data */
    if(idLabel != null && attributesLink != null){ 
        idLabel.innerHTML = identifier;
        attributesLabel.setAttribute("href", attributesLink);
        markerElement.ariaHidden = "false";
        markerInformation.ariaHidden = "false";
    }
}

/* ---------------------------- MAIN ---------------------------- */
export function DocumentUX(){
    /* User Experience events */
    applyUX();

    /* Heat Spot title information hover */
    spotHoverInfo()

    /* Filter Heat Spots */
    filterInfo()

    /* Date filter hover info */
    dateHoverInfo()
}