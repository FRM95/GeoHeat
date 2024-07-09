import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import { getFresnelMat } from "./getFresnelMat.js";

/* Creates scene render */
function createRenderer(w, h){
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(w,h);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    // renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    return renderer
}

/* Creates camera */
function setCamera(fov, aspect, near, far, initial_x, initial_y, initial_z){
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = initial_x; 
    camera.position.y = initial_y; 
    camera.position.z = initial_z;
    return camera
}

/* Set camera controls */
function setControls(camera, domElem, staticMove = false, dampFactor = 0.04, noPan = true, rotSpeed = 1.5, zoomSpeed = 0.05){
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

/* Set sphere */
const setSphere = (sphereProperties) => {
    const geometry = new THREE.SphereGeometry(
        sphereProperties.radius, 
        sphereProperties.widthSegments, 
        sphereProperties.heightSegments
    );
    return geometry
}

/* Set Textures */
const setTextures = (sphereGeometry, texturesProperties) => {
    const loader = new THREE.TextureLoader();
    let returnObject = {};

    if(texturesProperties.earth){
        const earthMaterial = new THREE.MeshPhongMaterial();
        const earthTexture = loader.load("/static/textures/earth_16k.png");
        earthMaterial.map = earthTexture;
        const bumpTexture = loader.load("/static/textures/earth_bump_16k.png");
        earthMaterial.bumpMap = bumpTexture;
        const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
        returnObject.earthMesh = earthMesh;
    }  

    if(texturesProperties.clouds){
        const cloudsMat = new THREE.MeshStandardMaterial();
        const cloudsTexture = loader.load("/static/textures/earth_cloud_16k.png");
        cloudsMat.alphaMap = cloudsTexture;
        cloudsMat.transparent = true;
        cloudsMat.opacity = 1;
        const cloudsMesh = new THREE.Mesh(sphereGeometry, cloudsMat);
        cloudsMesh.scale.setScalar(1.0025);
        returnObject.cloudsMesh = cloudsMesh;
    }

    if(texturesProperties.hydroSphere){
        const fresnelMat = getFresnelMat();
        const glowMesh = new THREE.Mesh(sphereGeometry, fresnelMat);
        glowMesh.scale.setScalar(1.003);
        returnObject.glowMesh = glowMesh;
    }

    return returnObject
}

/* Creates earth 3D */
const Earth3D = (sphereProperties, texturesProperties) => {
    const group = new THREE.Group();
    const sphere = setSphere(sphereProperties);
    const textures = setTextures(sphere, texturesProperties);
    let earthValue = null;
    let cloudValue = null;
    for(const [key, value] of Object.entries(textures)){
        if(key === 'earthMesh'){ earthValue = value; }
        else if(key === 'cloudsMesh'){ cloudValue = value; }
        group.add(value);
    }
    return {earthGroup: group, earthMesh: earthValue, cloudsMesh: cloudValue}
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

/* Remove mesh from scene */
function removeMesh(sceneObject, meshArray){
    for(let i= 0; i < meshArray.length; i++){
        meshArray[i].dispose();
        sceneObject.remove(meshArray[i]);
    }
}

/* Add mesh to scene */
function addMesh(sceneObject, meshArray){
    for(let j= 0; j<meshArray.length;j++){
        sceneObject.add(meshArray[j]);
    }
}

export {
    createRenderer, 
    setCamera, 
    setControls, 
    Earth,
    Earth3D,
    setLabelAttributes,
    removeMesh,
    addMesh,
    THREE, 
    CSS2DRenderer, 
    CSS2DObject
};

