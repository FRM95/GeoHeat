import { createScene } from "./ThreeJS/main.js"
import { setExploreContent } from "./HTML/explore.js"
import { setLayersContent } from "./HTML/layers.js"
import { setButtonsUX } from "./UX/main.js"
export let meshPointers = {};


/* Main method to load JS scripts */
function main(){
    setExploreContent();
    setLayersContent();
    setButtonsUX();
    const scene = createScene();
}

/* Executes main method after window load */
window.addEventListener("load", () => {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});