import {createRenderer, setCamera, setControls, Earth, coordToCartesian, THREE, CSS2DRenderer, CSS2DObject} from './threeJSFunctions.js';

function main(){

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('container-canvas');
    container.appendChild(renderer.domElement);

    // Camera creation
    const camera = setCamera(75, width/height, 0.1, 10, 0, 0, 3);

    // Scene creation
    const scene = new THREE.Scene();

    // Controls creation
    const orbitControls = setControls(camera, renderer.domElement, true, 0.03, false);

    // Earth creation
    const material = new THREE.MeshBasicMaterial({color: 0xffffff});
    const earth_radius = 1;
    const earth = Earth(earth_radius, 32, 32, material, "./static/textures/earthmap10k.jpg");

    // Add earth to scene
    scene.add(earth);

    // Create point
    let coordinates = {
        lat : 40.416775,
        long : -3.703790
    }

    // Add point to scene
    let geom2 = new THREE.SphereGeometry(0.005, 32, 32);
    let mesh = new THREE.Mesh(geom2, new THREE.MeshBasicMaterial({color: 0xffffff}))
    let point = coordToCartesian(coordinates, earth_radius);
    mesh.position.set(point.x,point.y,point.z);
    console.log(mesh);
    earth.add(mesh);

    // Intersect point with raycast
    let pointer = new THREE.Vector2();
    let raycaster = new THREE.Raycaster();
    let intersections;
    window.addEventListener("pointerdown", event => {
        pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
        pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        intersections = raycaster.intersectObject(mesh, false);
        if (intersections.length > 0) {
            console.log(intersections);
        }
    });


    const onWindowResize=() => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    }
    window.addEventListener("resize", onWindowResize);
    
    function animate(){
        requestAnimationFrame(animate);
        earth.rotation.y += 0.0015;
        renderer.render(scene, camera);
        orbitControls.update();
    }
    animate();
}

window.addEventListener("load", function () {
    main();
});
