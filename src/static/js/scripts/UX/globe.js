import { THREE } from "../threeJS/functions.js";

export const moveToPoint = (vectorTarget, sceneCamera, meshObject, meshRadius) => {

    const cameraDistance = sceneCamera.position.distanceTo(meshObject.position) - meshRadius;
    const scalarMultiplier = meshRadius + cameraDistance;

    // console.log(sceneCamera.position.distanceTo(vectorTarget));

    const tween = new TWEEN.Tween(sceneCamera.position)
        .onStart(() =>{
            console.log(sceneCamera)
        })
        .to(vectorTarget, 3000)
        .dynamic(true)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            update();
        })
        .onComplete(() =>{
            console.log(sceneCamera);
        })

    function update(){
        sceneCamera.position.normalize().multiplyScalar(scalarMultiplier);
        sceneCamera.lookAt(new THREE.Vector3(0,0,0));
    }

    return tween;
}

