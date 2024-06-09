import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';

/* Creates scene render */
function createRenderer(w, h){
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(w,h);
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
function setControls(camera, domElem, damping = true, dampFactor = 0.03, pan = false){
    let controls = new OrbitControls(camera, domElem);
    controls.enableDamping = damping;
    controls.dampingFactor = dampFactor;
    controls.enablePan = pan;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.75;
    controls.minDistance = 1.15;
    controls.maxDistance = 3;
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
    setLabelAttributes,
    removeMesh,
    addMesh,
    THREE, 
    CSS2DRenderer, 
    CSS2DObject
};

