import { RequestOptions } from './Request/functions.js'
import { FilterOptions } from './Filter/functions.js'
import { setThreeJS } from './ThreeJS/functions.js'
import { HeatSpots } from './HeatSpots/functions.js'

/* Main method to load JS scripts */
function main(){
    RequestOptions();
    FilterOptions();
    setThreeJS();
    HeatSpots();
}

/* Executes main method after window load */
window.addEventListener("load", () => {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});