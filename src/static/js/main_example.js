import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const w = window.innerWidth;
const h = window.innerHeight;
const renderer = new THREE.WebGLRenderer({
    antialias:true
});
renderer.setSize(w,h);
renderer.shadowMapEnabled = true;

const container = document.getElementById('container-canvas');
container.appendChild(renderer.domElement)
// document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const fov = 75;
const aspect = w/h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2;


const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;
controls.enablePan = false;

const geometry = new THREE.SphereGeometry(1.1,64,32);
const texture = new THREE.TextureLoader().load("textures/earth.png");
const material = new THREE.MeshBasicMaterial({color: 0xffffff, map: texture}); 
const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

const wireMat = new THREE.MeshBasicMaterial({
    color: 0xc0cccc,
    wireframe: true
});

const wireMesh = new THREE.Mesh(geometry, wireMat);
// wireMesh.scale.setScalar(1.001);

// sphere.rotation.z = 23.5 / 360 * 2 * Math.PI; // earth's axial tilt is 23.5 degrees
sphere.rotateX(+0.5);
sphere.add(wireMesh);




function placeObjectOnPlanet(object, lat, lon, radius) {
    var latRad = lat * (Math.PI / 180);
    var lonRad = -lon * (Math.PI / 180);
    object.position.set(
        Math.cos(latRad) * Math.cos(lonRad) * radius,
        Math.sin(latRad) * radius,
        Math.cos(latRad) * Math.sin(lonRad) * radius
    );
    object.rotation.set(0.0, -lonRad, latRad - Math.PI * 0.5);
}


// pointer
const pointer = new THREE.Mesh(new THREE.CylinderGeometry(2, 0, 10), new THREE.MeshPhongMaterial({color: 0xCC0033}));
placeObjectOnPlanet(pointer, 40.416775, -3.703790, sphere.radius)
const marker = new THREE.Object3D();
marker.add(pointer);

var object = new THREE.Object3D();
object.add(sphere);
object.add(marker);
object.rotation.y = 1.0;
scene.add(object);


function animate(){
    requestAnimationFrame(animate);
    // wireMesh.rotation.x = Math.sin(t*0.0002); //-t * 0.0001;
    // sphere.rotation.y = t * 0.00005;
    // sphere.rotation.y += 0.002;
    object.rotation.y += 0.002;
    // mesh.scale.setScalar(Math.cos(t*0.001) + 1.0);
    renderer.render(scene, camera);
    controls.update();
}
// renderer.render(scene, camera);
animate();