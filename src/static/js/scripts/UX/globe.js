export const moveToPoint = (vectorTarget, sceneCamera, meshObject, meshRadius) => {

    const cameraDistance = sceneCamera.position.distanceTo(meshObject.position) - meshRadius;
    const scalarMultiplier = meshRadius + cameraDistance;

    const tween = new TWEEN.Tween(sceneCamera.position)
        .to(vectorTarget, 2500)
        .dynamic(true)
        .easing(TWEEN.Easing.Quadratic.InOut)
        .onUpdate(() => {
            update();
        })

    function update(){
        sceneCamera.position.normalize().multiplyScalar(scalarMultiplier);
    }

    return tween;
}

