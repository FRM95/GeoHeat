import { RequestOptions } from './Request/functions.js'
// import { FilterOptions } from './Filter/functions.js'
import { setThreeJS } from './ThreeJS/functions.js'
import { DocumentUX } from './UX/functions.js'
import { RequestHeatSpots } from './HeatSpots/functions.js'

export let meshPointers = {};

/* Main method to load JS scripts */
function main(){
    RequestOptions();
    const scene = setThreeJS();
    DocumentUX();
    RequestHeatSpots(scene);
}

/* Executes main method after window load */
window.addEventListener("load", () => {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});