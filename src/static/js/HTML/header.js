import {removeEvent} from "../UX/events.js"

/* Create search list results */
export const setList = (results) => {
    const resultsElement = document.querySelector(".search-results");
    removeEvent(resultsElement);
    const search = document.querySelector(".search");
    for (const country of results){
        const resultItem = document.createElement("li");
        resultItem.classList.add("header-list-item");
        resultItem.setAttribute("coordinates", country["coordinates"]);
        resultItem.setAttribute("name", country["name"]);
        const text = document.createTextNode(country.name);
        resultItem.appendChild(text);
        resultItem.addEventListener("click", (e)=> {
            let target = e.target;
            search.value = target.getAttribute("name");
            search.setAttribute("data-coordinates", target.getAttribute("coordinates"));
            search.setAttribute("data-location_name", target.getAttribute("name"));
            removeEvent(resultsElement);
        })
        resultsElement.appendChild(resultItem);
    }
}

