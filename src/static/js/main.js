import { createScene } from "./ThreeJS/main.js"
import { setExploreContent } from "./HTML/explore.js"
import { setLayersContent, setLayersVisibility } from "./HTML/layers.js"
import { setButtonsUX, inputSearchUX } from "./UX/main.js"
import { displayWorldData } from "./Fetch/main.js"
export let meshPointers = {};

/* Main method to load JS scripts */
async function main(){
    console.log(user_data, firms_data)
    setExploreContent();
    setLayersContent();
    setButtonsUX();
    inputSearchUX();
    const scene = createScene();
    setLayersVisibility(scene);
    // displayWorldData(scene);
}

/* Executes main method after window load */
window.addEventListener("load", () => {
    main();
    const data_processed = document.getElementById("data");
    data_processed.remove();
});