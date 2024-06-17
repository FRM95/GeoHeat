import {createRenderer, setCamera, Earth, THREE} from './threeJSFunctions.js';
import {addCartesian, createMarkers} from './globeFunctions.js';
import {getFresnelMat} from "./getFresnelMat.js";

function main(){

    // Renderer creation and DOM append
    const width = window.innerWidth;
    const height = window.innerHeight;
    const renderer = createRenderer(width, height);
    const container = document.getElementById('threejs-canvas');
    container.appendChild(renderer.domElement);

    // Camera creation
    const camera = setCamera(75, width/height, 0.1, 10, -0.4, 0, 1.5);
    camera.rotation.z = -0.15;

    // Scene creation
    const scene = new THREE.Scene();   

    // Sphere creation
    const sphereGroup = new THREE.Group();
    const earth_radius = 1.0;
    const loader = new THREE.TextureLoader();
    const sphereGeometry = new THREE.SphereGeometry(earth_radius, 64, 32);

    // Earth creation
    const material = new THREE.MeshPhongMaterial({
        map: loader.load("./static/textures/earthmap10k.jpg"),
        bumpMap: loader.load("./static/textures/earthbump10k.jpg")
    });
    const earthMesh = new THREE.Mesh(sphereGeometry, material);    
    earthMesh.rotation.y = -2;
    earthMesh.rotation.z = -0.65;
    sphereGroup.add(earthMesh);

    // Clouds creation
    const cloudsMat = new THREE.MeshStandardMaterial({
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
        alphaMap: loader.load('./static/textures/earthhiresclouds4K.jpg')
      });
    const cloudsMesh = new THREE.Mesh(sphereGeometry, cloudsMat);
    cloudsMesh.scale.setScalar(1.0025);
    
    // Hydrosphere creation
    const fresnelMat = getFresnelMat();
    const glowMesh = new THREE.Mesh(sphereGeometry, fresnelMat);
    glowMesh.scale.setScalar(1.0028);

    sphereGroup.add(glowMesh);
    sphereGroup.add(earthMesh);
    sphereGroup.add(cloudsMesh);

    // Add earth to scene
    scene.add(sphereGroup);
    
    // Add scene light
    const sunLight = new THREE.DirectionalLight(0xffffff, 3.0);
    sunLight.position.set(-2, 0.5, 1.5);
    scene.add(sunLight);

    // Add mock data
    for(let i=0; i<mock_data.length; i++){ addCartesian(mock_data[i], earth_radius);}
    const current_marks_mesh = createMarkers(mock_data);
    earthMesh.add(current_marks_mesh);

    // Camera, render and label render window resize
    const onWindowResize=() => {
        camera.aspect = innerWidth / innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    }

    // Submit functionality
    const submitButton = document.getElementById("submit-form");
    submitButton.onsubmit = function(){
        if(submitButton[0].value == ""){
            return false
        }
    }

    window.addEventListener("resize", onWindowResize);

    function animate(){
        requestAnimationFrame(animate);
        sphereGroup.rotation.y += 0.0005;
        renderer.render(scene, camera);
    }

    animate();
}

window.addEventListener("load", function () {
    main();
});

