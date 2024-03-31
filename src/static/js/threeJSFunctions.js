import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

function createRenderer(w, h){
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(w,h);
    renderer.shadowMapEnabled = true;
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
    let wireMat = new THREE.MeshBasicMaterial({color: 0xc0cccc, wireframe: true});
    let wireMesh = new THREE.Mesh(geometry, wireMat);
    sphere.add(wireMesh);
    return sphere
}

function coordToCartesian(coordinates, earth_radius){
    let latitude = coordinates.lat;
    let longitude = coordinates.long;
    let phi = (90-latitude)*(Math.PI/180);
    let theta = (longitude+180)*(Math.PI/180);
    let x_point = -(earth_radius * Math.sin(phi)*Math.cos(theta));
    let y_point = (earth_radius * Math.cos(phi));
    let z_point = (earth_radius * Math.sin(phi)*Math.sin(theta));
    return {x:x_point,
            y:y_point,
            z:z_point}
}

export {createRenderer, setCamera, setControls, Earth, coordToCartesian, THREE, CSS2DRenderer, CSS2DObject};

