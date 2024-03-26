import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

function createRenderer(w, h){
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(w,h);
    renderer.shadowMapEnabled = true;
    return renderer
}

function setCamera(fov, aspect, near, far){
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = 0;
    camera.position.y = 0;
    camera.position.z = 3;
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

// Marker
function createMark(latitude, longitude, earth_radius){

    // Convert latitude and longitude to spherical coordinates
    var phi = (90-latitude)*(Math.PI/180);
    var theta = (longitude+180)*(Math.PI/180);
    let x = -(earth_radius * Math.sin(phi)*Math.cos(theta));
    let y = (earth_radius * Math.cos(phi));
    let z = (earth_radius * Math.sin(phi)*Math.sin(theta));
    
    //Geometry
    const vertices = [];
    vertices.push(x, y, z);
    var geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    var material = new THREE.PointsMaterial({size: 0.01, color: 0xFF0000});
    const points = new THREE.Points(geometry, material);
    return points
}


export {createRenderer, setCamera, setControls, Earth, createMark, THREE};

