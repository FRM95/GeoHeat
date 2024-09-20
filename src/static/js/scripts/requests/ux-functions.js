/* Request data UX Functions */

/* Change visibility between location area/country */
const hideOptions = (htmlElm) =>{
    const request_area = document.getElementById("request_area");
    const request_country = document.getElementById("request_country");
    htmlElm.addEventListener("change", () => {
        if(htmlElm.value === 'area'){
            request_area.classList.remove("hidden");
            request_country.classList.add("hidden");
        }
        else{
            request_country.classList.remove("hidden");
            request_area.classList.add("hidden");
        }
    })
}

/* Create a new option */
const createOption = (htmlElement, optionValue, optionText) => {
    const optionElement = document.createElement("option");
    optionElement.value = optionValue;
    optionElement.text = optionText;
    htmlElement.add(optionElement, null);
    return optionElement
}

/* Set the options to request FIRMS data */
export const setRequestOptions = (optKey, optValue) => {
    switch (optKey) { 
        case "country":
            const countryElement = document.getElementById('request_' + optKey);
            if(countryElement != null) {
                for(let i = 0; i < optValue.length; i++) {
                    const option = createOption(countryElement, optValue[i]['value'], optValue[i]['name']);
                    option.setAttribute("data-coordinates", optValue[i]['coordinates']);
                    option.setAttribute("data-location_name", optValue[i]['name']);
                    option.setAttribute("data-area_name", optValue[i]['area-name']);
                }
            }
            break

        case "area":
            const areaElement = document.getElementById('request_' + optKey);
            if(areaElement!=null){
                for(let i = 0; i < optValue.length; i++) {
                    const option = createOption(areaElement, optValue[i]['value'], optValue[i]['name']);
                    option.setAttribute("data-coordinates", optValue[i]['coordinates']);
                    option.setAttribute("data-location_name", optValue[i]['name']);
                }
            }
            break

        case "firms":
            for(let i = 0; i < optValue.length; i++) {
                const object = optValue[i];
                const element = object["parameter"];
                const values = object["values"];
                switch (element) {
                    case "delimiter":
                        const delimiterElement = document.getElementById('request_' + element);
                        if(delimiterElement != null){
                            hideOptions(delimiterElement);
                            for(let j = 0; j < values.length; j++){
                                const text = values[j][0].toUpperCase() + values[j].substring(1);
                                createOption(delimiterElement, values[j], text);
                            }
                        }
                        break

                    case "dayrange":
                        const dayrangeElement = document.getElementById('request_' + element);
                        if(dayrangeElement != null){
                            for(let j = 0; j < values.length; j++){
                                createOption(dayrangeElement, values[j], values[j]);           
                            }
                        }
                        break

                    case "source":
                        const sourceElement = document.getElementById('request_' + element);
                        if(sourceElement != null){
                            for(let j = 0; j < values.length; j++){
                                createOption(sourceElement, values[j], values[j].replace(/_/g, " "));                    
                            }                            
                        }
                        break
                }
            }
            break

        case "date":
            const currDay = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
            const dateElement = document.getElementById('request_' + optKey);
            if (dateElement != null) {
                dateElement.max = currDay;
                dateElement.value = currDay;
            }
            break
    }
}