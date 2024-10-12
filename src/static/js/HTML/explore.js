import * as HTML from "./functions.js"

const swapDelimiter = () =>{
    const delimiter = document.querySelector(".delimiter");
    const request_area = document.querySelector(".area");
    const request_country = document.querySelector(".country");
    request_country.dataset.hidden = "true";
    delimiter.addEventListener("change", () => {
        if(delimiter.value === "area"){
            request_area.dataset.hidden = "false";
            request_country.dataset.hidden = "true";
        }
        else{
            request_area.dataset.hidden = "true";
            request_country.dataset.hidden = "false";
        }
    })
}

const createRequestAPI = () => {
    const element = document.querySelector(".explore");
    const elementContent = document.createElement("div");
    let orderedElements = [null,null,null,null,null,null];
    let divChild;
    for(const [key, value] of Object.entries(firms_data)){
        switch (key){
            case "areas":
                divChild = HTML.createDivWithSpanAndSelect("area", "Area", value);
                orderedElements[2] = divChild;
                break
            case "countries":
                divChild = HTML.createDivWithSpanAndSelect("country", "Country", value);
                orderedElements[3] = divChild;
                break
            case "parameters":
                value.forEach(item => {
                    if(item["parameter"] === "delimiter"){
                        divChild = HTML.createDivWithSpanAndSelect("delimiter", "Delimiter", item["values"]);
                        orderedElements[1] = divChild;
                    } else if(item["parameter"] === "source"){
                        divChild = HTML.createDivWithSpanAndSelect("source", "Source", item["values"]);
                        orderedElements[0] = divChild;
                    } else {
                        divChild = HTML.createDivWithSpanAndSelect("range","Range day", item["values"]);
                        orderedElements[5] = divChild;
                    }
                })  
                break
        }
    }
    orderedElements[4] = HTML.createDivWithDateInput("date", "Date")
    orderedElements.forEach(element => elementContent.appendChild(element));
    const button = document.createElement("button");
    button.textContent = "Request";
    elementContent.appendChild(button);
    element.appendChild(HTML.createDetailsElement("FIRMS API", "Download heatspots data from FIRMS", elementContent));
}

const enableAutoMode = () =>{
    const element = document.querySelector(".explore");
    const divChild = HTML.createDivWithSpanAndCheckbox("auto-mode", "auto-mode", "Enable", true);
    const options = [
        { value: 60, text: "60 minutes" },
        { value: 30, text: "30 minutes" },
        { value: 15, text: "15 minutes" },
        { value: 5, text: "5 minutes" }
    ];
    const time = HTML.createDivWithTimeSelect(options, "Time Interval");
    const button = document.createElement("button");
    button.textContent = "Apply";
    const elementContent = document.createElement("div");
    elementContent.append(divChild, time, button);
    const details = HTML.createDetailsElement("Auto mode", "Display new heatspots automatically", elementContent);
    element.appendChild(details);
}


export function setExploreContent(){
    enableAutoMode();
    createRequestAPI();
    swapDelimiter();
}