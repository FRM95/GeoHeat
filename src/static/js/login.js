import {createRenderer, setCamera, Earth, THREE} from './threeJSFunctions.js';

function main(){

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('container-canvas');
    container.appendChild(renderer.domElement);

    // Camera creation
    const camera = setCamera(75, width/height, 0.1, 10, 0, 0, 3);
    // camera.rotateZ(-0.3);

    // Scene creation
    const scene = new THREE.Scene();

    // Earth creation
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const earth_radius = 1.5;
    const earth = Earth(earth_radius, 32, 32, material, "./static/textures/earthmap10k.jpg");
    // earth.rotateX(+0.65);
    // earth.rotateY(-2.2);

    // Add earth to scene
    scene.add(earth);

    const onWindowResize=() => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    }

    window.addEventListener("resize", onWindowResize);
    
    const animate=()=>{
        requestAnimationFrame(animate);
        earth.rotation.y -= 0.0015;
        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener("load", function () {
    main();
});

