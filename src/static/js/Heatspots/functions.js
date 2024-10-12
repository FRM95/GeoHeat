import { removeObject, addObject } from "../ThreeJS/main.js"
import { meshPointers } from "../main.js"

export const displayHeatSpots = (sceneObject, optionsObject = null) =>{
    // let groupPointer = null;
    // sceneObject.children.forEach(element => { if (element.name == "heatspots"){ groupPointer = element } }); 
    // if(groupPointer != null){
    if(optionsObject != null){
        for(const [key, value] of Object.entries(meshPointers)){
            const item = key.split("#");
            const source = item[0];
            const date = item[1];
            if(source in optionsObject["source"] && date in optionsObject["date"]){
                addObject(sceneObject, value);
            } else {
                removeObject(sceneObject, value)
            }
        }
    } else {
        addObject(sceneObject, meshPointers, true);
    }
    // }
}
