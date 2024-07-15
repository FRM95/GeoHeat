import * as THREE from "three";
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { getFresnelMat } from "./glowMaterial.js";

/* Creates WebGL renderer based on width and height parameters */
const createRenderer = (sceneWidth, sceneHeight) => {
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(sceneWidth, sceneHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    return renderer
}

/* Creates Perspective Three JS camera */
const createCamera = (fov, aspect, near, far, position_x, position_y, position_z) => {
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = position_x; 
    camera.position.y = position_y; 
    camera.position.z = position_z;
    return camera
}

/* Set camera controls */
const createControls = (camera, domElem, staticMove = false, dampFactor = 0.04, noPan = true, rotSpeed = 1.5, zoomSpeed = 0.05) => {
    let controls = new TrackballControls(camera, domElem);
    controls.staticMoving = staticMove;
    controls.dynamicDampingFactor = dampFactor;
    controls.minDistance = 1.15;
    controls.maxDistance = 5;
    controls.noPan = noPan;
    controls.rotateSpeed = rotSpeed;
    controls.zoomSpeed = zoomSpeed;
    return controls
}

/* Creates earth geometry */
function Earth(radius = 1.0, widthSegments = 64, heightSegments = 32, material = null, texture_path = null){
    let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    if (texture_path != null){
        let texture = new THREE.TextureLoader().load(texture_path);
        material.map = texture;
    }
    let sphere = new THREE.Mesh(geometry, material);
    return sphere
}

/* Creates sphere geometry */
const createSphere = (sphereProperties) => {
    const geometry = new THREE.SphereGeometry(
        sphereProperties.radius, 
        sphereProperties.widthSegments, 
        sphereProperties.heightSegments
    );
    return geometry
}

/* Creates Textures */
const buildTextures = (sphereGeometry, texturesObject, texturesQuality) => {
    const loader = new THREE.TextureLoader();
    let returnObject = {};
    if(texturesObject.Earth_map.visible){

        const earthMaterial = new THREE.MeshPhongMaterial(texturesObject.Earth_map.properties);
        const earthQuality = texturesObject.Earth_map.texture_quality;
        const earthTexture = loader.load(texturesQuality.Earth_map[earthQuality]);
        earthMaterial.map = earthTexture;

        if(texturesObject.Bump_map.visible){
            const bumpQuality = texturesObject.Bump_map.texture_quality;
            const bumpTexture = loader.load(texturesQuality.Bump_map[bumpQuality]);
            earthMaterial.bumpMap = bumpTexture;
            earthMaterial.bumpScale = texturesObject.Bump_map.scale;
        }

        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        returnObject.earthMesh = earthMesh;
    }

    if(texturesObject.Clouds_map.visible){

        const cloudsMat = new THREE.MeshStandardMaterial(texturesObject.Clouds_map.properties);
        const cloudsQuality = texturesObject.Clouds_map.texture_quality;
        const cloudsTexture = loader.load(texturesQuality.Clouds_map[cloudsQuality]);
        cloudsMat.alphaMap = cloudsTexture;

        const cloudsMesh = new THREE.Mesh(sphereGeometry, cloudsMat);
        cloudsMesh.scale.setScalar(texturesObject.Clouds_map.scale);
        returnObject.cloudsMesh = cloudsMesh;
    }

    if(texturesObject.Hydrosphere_map.visible){
        const fresnelMat = getFresnelMat();
        const hydrosphereMesh = new THREE.Mesh(sphereGeometry, fresnelMat);
        hydrosphereMesh.scale.setScalar(texturesObject.Hydrosphere_map.scale);
        returnObject.hydrosphereMesh = hydrosphereMesh;
    }

    return returnObject
}

/* Creates Three group */
const createGroup = (texturesObject) =>{
    const group = new THREE.Group();
    for(const [key, value] of Object.entries(texturesObject)){
        group.add(value);
    }
    return group
}


/* Returns earth group and meshes related to group */
const Group = (sphereProperties, texturesObject, texturesQuality) => {
    const sphere = createSphere(sphereProperties);
    const textures = buildTextures(sphere, texturesObject, texturesQuality);
    const groupMesh = createGroup(textures);
    return {group: groupMesh, meshes: textures}
}

/* Add Earth label functionality */
function setLabelAttributes(label, earth, camera){
    label.userData = {
        cNormal: new THREE.Vector3(),
        cPosition: new THREE.Vector3(),
        mat4: new THREE.Matrix4(),
        trackVisibility: () => { 
            let ud = label.userData;
            ud.cNormal.copy(label.position).normalize().applyMatrix3(earth.normalMatrix);
            ud.cPosition.copy(label.position).applyMatrix4(ud.mat4.multiplyMatrices(camera.matrixWorldInverse, earth.matrixWorld));
            let d = ud.cPosition.negate().normalize().dot(ud.cNormal);
            d = smoothstep(0.2, 0.7, d);
            label.element.style.opacity = d;
            function smoothstep(min, max, value) {
                var x = Math.max(0, Math.min(1, (value-min)/(max-min)));
                return x*x*(3-2*x);
                };
            }
    };
}

/* Creates lights from scene */
const buildLight = (lightObject) => {
    let returnObject = {};
    if(lightObject.ambient_light.visible){
        const ambientLight = new THREE.AmbientLight(
            lightObject.ambient_light.properties.color, 
            lightObject.ambient_light.properties.intensity
        );
        returnObject.ambientLight = ambientLight;
    }
    if(lightObject.directional_light.visible){
        const directionalLight = new THREE.DirectionalLight(
            lightObject.directional_light.properties.color, 
            lightObject.directional_light.properties.intensity
        );
        returnObject.directionalLight = directionalLight;
    }
    return returnObject
}

/* Remove object from scene */
const removeObject = (sceneObject, object) => {
    if(object instanceof Array){
        for(let i= 0; i < object.length; i++){
            object[i].dispose();
            sceneObject.remove(object[i]);
        }
    } else {
        object.dispose();
        sceneObject.remove(object);
    }
}

/* Add object to scene */
const addObject = (sceneObject, object) => {
    if(object instanceof Array){
        for(let i = 0; i < object.length; i++){
            sceneObject.add(object[i]);
        }
    } else {
        sceneObject.add(object);
    }
}

export {
    createRenderer, 
    createCamera, 
    createControls, 
    Earth,
    Group,
    setLabelAttributes,
    addObject,
    removeObject,
    buildLight,
    THREE,
};

