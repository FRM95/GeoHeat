import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
// import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';

function createRenderer(w, h){
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(w,h);
    return renderer
}

function setCamera(fov, aspect, near, far, initial_x, initial_y, initial_z){
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = initial_x; 
    camera.position.y = initial_y; 
    camera.position.z = initial_z;
    return camera
}

function setControls(camera, domElem, damping = true, dampFactor = 0.03, pan = false){
    let controls = new OrbitControls(camera, domElem);
    controls.enableDamping = damping;
    controls.dampingFactor = dampFactor;
    controls.enablePan = pan;
    return controls
}

function Earth(radius = 1.0, widthSegments = 64, heightSegments = 32, material = null, texture_path = null){
    let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    if (texture_path != null){
        let texture = new THREE.TextureLoader().load(texture_path);
        material.map = texture;
    }
    let sphere = new THREE.Mesh(geometry, material);
    return sphere
}

function coordToCartesian(coordinates, earth_radius){
    let latitude = coordinates.latitude;
    let longitude = coordinates.longitude;
    let phi = (90-latitude)*(Math.PI/180);
    let theta = (longitude+180)*(Math.PI/180);
    let x_point = -(earth_radius * Math.sin(phi)*Math.cos(theta));
    let y_point = (earth_radius * Math.cos(phi));
    let z_point = (earth_radius * Math.sin(phi)*Math.sin(theta));
    return {x:x_point,
            y:y_point,
            z:z_point}
}

function addCartesian(dataObject, earth_radius){
    for(const [key, value] of Object.entries(dataObject)){
        let pointObject = coordToCartesian(value, earth_radius);
        value.earth_cartesian = pointObject;
    }
}

function createMarkers(dataObject, dataIds){
    let common_geo = new THREE.CircleGeometry(0.0015, 32);
    let common_mat = new THREE.MeshBasicMaterial({color:0xff0000});
    let dummy = new THREE.Object3D();
    let inputSize = dataIds.length;
    var meshCount = 0;
    var userData = {};

    if (inputSize == 0){ 
        meshCount = Object.keys(dataObject).length; 
    }
    else{
        meshCount = inputSize;
    }

    var markMesh = new THREE.InstancedMesh(common_geo, common_mat, meshCount);
    if (inputSize == 0) {
        for(let i = 0; i < meshCount; i++){
            dummy.position.x = dataObject[i].earth_cartesian.x;
            dummy.position.y = dataObject[i].earth_cartesian.y;
            dummy.position.z = dataObject[i].earth_cartesian.z;
            dummy.lookAt(dummy.position.clone().setLength(1.5));
            dummy.updateMatrix();
            markMesh.setMatrixAt(i, dummy.matrix);
            userData[i] = i;
        }
    }
    else{
        for(let i = 0; i < meshCount; i++){
            const uniqueId = dataIds[i];
            dummy.position.x = dataObject[uniqueId].earth_cartesian.x;
            dummy.position.y = dataObject[uniqueId].earth_cartesian.y;
            dummy.position.z = dataObject[uniqueId].earth_cartesian.z;
            dummy.lookAt(dummy.position.clone().setLength(1.5));
            dummy.updateMatrix();
            markMesh.setMatrixAt(i, dummy.matrix);
            userData[i] = uniqueId;
        }
    }

    markMesh.userData = userData;
    return markMesh
}

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

export {createRenderer, setCamera, setControls, Earth, addCartesian, createMarkers, setLabelAttributes, THREE, CSS2DRenderer, CSS2DObject};

