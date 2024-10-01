import { setThreeJS } from "./ThreeJS/functions.js"
import { populateHTML } from "./HTML/explore.js"
export let meshPointers = {};

/* Main method to load JS scripts */
function main(){
    const scene = setThreeJS();
    populateHTML();
}

/* Executes main method after window load */
window.addEventListener("load", () => {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});