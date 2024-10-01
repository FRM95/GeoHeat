import * as THREE from "three";
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';

/* Sidebar and heatspots behaviour for screens below 500px */
const sidebar = document.querySelector(".sidebar");
const heatspots = document.querySelector(".heatspots");
const subcontentBehaviour = () =>{
    if(heatspots.getAttribute("data-visible") === "true" && sidebar.getAttribute("data-expanded") === "true"){
        sidebar.setAttribute("data-expanded", false);
    }
}

/* Control sidebar content */
const sidebarContentButtons = document.querySelectorAll("[sidebar-section]");
sidebarContentButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const sidebarContent = document.querySelectorAll("[sidebar-content]");
        sidebarContent.forEach(content => {
            if(content.getAttribute("sidebar-content") === e.target.getAttribute("sidebar-section")){
                content.setAttribute("data-hidden", false)
                if(sidebar.getAttribute("data-expanded") === "false"){
                    sidebar.setAttribute("data-expanded", true);
                }
            } else {
                content.setAttribute("data-hidden", true)
            }
        })
    });
})

/* Control expanded elements */
const expandElementButtons = document.querySelectorAll("[expand-section]");
expandElementButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const contentToExpandName = e.target.getAttribute("expand-section");
        const contentToExpand = document.querySelector(`[expand-content=${contentToExpandName}]`);
        const oldState = contentToExpand.getAttribute("data-expanded");
        const newState = oldState !== 'true';
        contentToExpand.setAttribute("data-expanded", newState);
        if(newState === true && window.innerWidth < 580){
            heatspots.setAttribute("data-visible", false);
        }
    })
})

/* Control visible elements */
const visibilityElementButtons = document.querySelectorAll("[navbar-section]");
visibilityElementButtons.forEach(button => {
    button.addEventListener("click", (e) => {
        const contentToVisibleName = e.target.getAttribute("navbar-section");
        const contentToVisible = document.querySelector(`[navbar-content=${contentToVisibleName}]`);
        contentToVisible.setAttribute("data-visible", false);
    })
});


/* HTML Renders */
const yOffset = document.querySelector("header").offsetHeight + document.querySelector("footer").offsetHeight;
const width = window.innerWidth;
const height = window.innerHeight - yOffset;

const renderer = new THREE.WebGLRenderer({antialias:true});
renderer.setSize(width, height);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
const container = document.querySelector(".scene-canvas");
container.appendChild(renderer.domElement);

const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
camera.position.set(0, 0, 3);

const scene = new THREE.Scene();
const geometry = new THREE.BoxGeometry( 1, 1, 1 ); 
const material = new THREE.MeshBasicMaterial( {color: 0x00ff00} ); 
const cube = new THREE.Mesh( geometry, material ); 
scene.add( cube );

const controls = new ArcballControls( camera, renderer.domElement, scene );

const animate = () => { 
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    controls.update();
}

const onWindowResize = () => {
    camera.aspect = innerWidth / (innerHeight - yOffset);
    camera.updateProjectionMatrix();
    renderer.setSize(innerWidth, (innerHeight - yOffset));
    if(window.innerWidth < 580){
        subcontentBehaviour()
    }
}

window.addEventListener("resize", onWindowResize);

animate();