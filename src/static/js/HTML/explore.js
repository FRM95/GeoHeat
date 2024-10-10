import * as HTML from "./functions.js"

const createRequestAPI = () => {
    const element = document.querySelector(".explore");
    const elementContent = document.createElement("div");
    let orderedElements = [null,null,null,null,null];
    let divChild;
    for(const [key, value] of Object.entries(firms_data)){
        switch (key){
            case "areas":
                divChild = HTML.createDivWithSpanAndSelect("Area", value);
                orderedElements[2] = divChild;
                break
            case "countries":
                divChild = HTML.createDivWithSpanAndSelect("Country", value);
                orderedElements[3] = divChild;
                break
            case "parameters":
                value.forEach(item => {
                    if(item["parameter"] === "delimiter"){
                        divChild = HTML.createDivWithSpanAndSelect("Delimiter", item["values"]);
                        orderedElements[1] = divChild;
                    } else if(item["parameter"] === "source"){
                        divChild = HTML.createDivWithSpanAndSelect("Source", item["values"]);
                        orderedElements[0] = divChild;
                    } else {
                        divChild = HTML.createDivWithSpanAndSelect("Range day", item["values"]);
                        orderedElements[4] = divChild;
                    }
                })  
                break
        }
    }
    orderedElements.forEach(element => elementContent.appendChild(element));
    const button = document.createElement("button");
    button.textContent = "Request";
    elementContent.appendChild(button);
    element.appendChild(HTML.createDetailsElement("FIRMS API", elementContent));
}

const enableAutoMode = () =>{
    const element = document.querySelector(".explore");
    const elementContent = HTML.createDivWithSpanAndCheckbox("auto-mode", "auto-mode", "Enable", true);
    const options = [
        { value: 60, text: '60 minutes' },
        { value: 30, text: '30 minutes' },
        { value: 15, text: '15 minutes' },
        { value: 5, text: '5 minutes' }
    ];
    const time = HTML.createDivWithTimeSelect(options);
    const button = document.createElement("button");
    button.textContent = "Apply";
    elementContent.append(time, button);
    const details = HTML.createDetailsElement("Auto mode", elementContent)
    element.appendChild(details);
}


export function setExploreContent(){
    enableAutoMode();
    createRequestAPI();
}