import {createRenderer, setCamera, setControls, Earth, createMark, THREE} from './threeJSFunctions.js';

function main(){

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('container-canvas');
    container.appendChild(renderer.domElement);

    // Camera creation
    const camera = setCamera(75, width/height, 0.1, 10);

    // Scene creation
    const scene = new THREE.Scene();

    // Controls creation
    const orbitControls = setControls(camera, renderer.domElement, true, 0.03, false);

    // Earth creation
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const earth_radius = 1.5;
    const earth = Earth(earth_radius, 32, 32, material, "./static/textures/earthmap10k.jpg");
    earth.rotateX(+0.5);

    // Add point
    const point_mark = createMark(40.416775, -3.703790, earth_radius);
    const point_mark2 = createMark(48.864716, 2.349014, earth_radius);
    const point_mark3 = createMark(40.730610, -73.935242, earth_radius);

    earth.add(point_mark, point_mark2, point_mark3);

    // Add earth to scene
    scene.add(earth);
    
    function animate(){
        requestAnimationFrame(animate);
        earth.rotation.y += 0.0015;
        renderer.render(scene, camera);
        orbitControls.update();
    }

    console.log(nasa_data);
    animate();
}

window.addEventListener("load", function () {

    main();

});
