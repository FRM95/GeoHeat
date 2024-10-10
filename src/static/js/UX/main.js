import * as Events from "./events.js"
import { setList } from "../HTML/header.js";


/* Buttons UX functionality */
export function setButtonsUX() {
    
    const expandButtons = document.querySelectorAll("[expand-element]");
    expandButtons.forEach(button => {
        button.addEventListener("click", () => {
            Events.expandEvent(button);
        });
    });

    const displayButtons = document.querySelectorAll("[display-element]");
    displayButtons.forEach(button => {
        button.addEventListener("click", () => {
            Events.displayEvent(button);
        });
    });

    const visibleButtons = document.querySelectorAll("[visible-element]");
    visibleButtons.forEach(button => {
        button.addEventListener("click", () => {
            Events.visibleEvent(button);
        });
    });
}

/* Search list UX functionality */
export function inputSearchUX() {

    const resultsElement = document.querySelector(".search-results");
    const search = document.querySelector(".search");
    search.addEventListener("input", (e) => {
        let value = e.target.value;
        if(value.trim()){
            value = value.trim().toLowerCase();
            const countries = firms_data["countries"].filter(country => { return country["name"].toLowerCase().includes(value)}); 
            const areas = firms_data["areas"].filter(area => { return area["name"].toLowerCase().includes(value) });
            if(countries.length > 0 || areas.length > 0){
                let arrayResults = [...countries, ...areas];
                const uniqueArray = arrayResults.filter((obj, index, self) => index === self.findIndex((el) => el.name === obj.name));
                setList(uniqueArray);
            } else {
                Events.messageEvent(resultsElement, "Sorry, we didn't find any results");
            }
            resultsElement.dataset.hidden = "false";
        } else {
            Events.removeEvent(resultsElement);
        }
    });
    
}