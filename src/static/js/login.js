import {createRenderer, setCamera, Earth, THREE} from './threeJSFunctions.js';
import {addCartesian, createMarkers} from './globeFunctions.js';

function main(){

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('container-canvas');
    container.appendChild(renderer.domElement);

    // Camera creation
    const camera = setCamera(75, width/height, 0.1, 10, -0.4, 0, 1.5);
    camera.rotation.z = -0.15;

    // Scene creation
    const scene = new THREE.Scene();   

    // Earth creation
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const earth_radius = 1.0;
    const earth = Earth(earth_radius, 64, 32, material, "./static/textures/earthmap10k.jpg");
    earth.rotation.y = -2;
    earth.rotation.z = -0.65;

    // Add earth to scene
    scene.add(earth);

    // Add mock data
    for(let i=0; i<mock_data.length; i++){
        addCartesian(mock_data[i], earth_radius);
    }
    const current_marks_mesh = createMarkers(mock_data);
    earth.add(current_marks_mesh);

    function animate(){
        requestAnimationFrame(animate);
        earth.rotation.y += 0.0009;
        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener("load", function () {
    main();
});

