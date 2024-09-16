import * as THREE from "three";
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { getFresnelMat } from "./glowMaterial.js";

/* Creates WebGL renderer based on width and height parameters */
const createRenderer = (sceneWidth, sceneHeight) => {
    let renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setSize(sceneWidth, sceneHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
    return renderer
}

/* Creates Perspective Three JS camera */
const createCamera = (fov, aspect, near, far, position_x, position_y, position_z) => {
    let camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.x = position_x; 
    camera.position.y = position_y; 
    camera.position.z = position_z;
    return camera
}


const rotationSpeed = (dist) =>{
    let rotSpeed = 0.55;
    if(dist < 2){
        rotSpeed = (8/77 * dist) + 47/1540;
    }
    return rotSpeed
}

/* Creates Controls of Three JS camera */
const createControls = (camera, domElem, targetObject) => {

    const controls = new ArcballControls(camera, domElem);
    controls.target = targetObject.position;
    controls.enablePan = false;
    controls.minDistance = 1.15;
    controls.maxDistance = 5;
    controls.scaleFactor = 1.1;
    controls.dampingFactor = 25;

    // controls.addEventListener('change', _ => {
    //     controls.rotateSpeed = rotationSpeed(camera.position.distanceTo(controls.target));
    // });


    return controls
}


/* Creates earth geometry */
function Earth(radius = 1.0, widthSegments = 64, heightSegments = 32, material = null, texture_path = null){
    let geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    if (texture_path != null){
        let texture = new THREE.TextureLoader().load(texture_path);
        material.map = texture;
    }
    let sphere = new THREE.Mesh(geometry, material);
    return sphere
}

/* Creates sphere geometry */
const createSphere = (sphereProperties) => {
    const geometry = new THREE.SphereGeometry(
        sphereProperties.radius, 
        sphereProperties.widthSegments, 
        sphereProperties.heightSegments
    );
    return geometry
}

/* Parse string hexColor to number color */
const parseColor = (properties) => {
    if(properties != null) {
        if("color" in properties) {
            const stringColor = properties.color;
            properties.color = Number(stringColor);
        }
        if ("emissive" in properties) {
            const stringEmissiveColor = properties.emissive;
            properties.emissive = Number(stringEmissiveColor);
        }
        return properties
    }
}

/* Creates Textures based on textures data*/
const buildTextures = (sphereGeometry, texturesArray, texturesQuality) => {
    const loader = new THREE.TextureLoader();
    let returnObject = {};
    for(let i = 0; i < texturesArray.length; i++){
        const name = texturesArray[i]["name"];
        const properties = texturesArray[i]["properties"];
        switch (name) {
            case "earth_map":
                const earthMaterial = new THREE.MeshPhongMaterial(properties);
                const earthQuality = texturesArray[i]["quality"];
                const earthTexture = loader.load(texturesQuality[name][earthQuality]);
                earthMaterial.map = earthTexture;
                const bumpQuality = earthQuality;
                const bumpTexture = loader.load(texturesQuality.bump_map[bumpQuality]);
                earthMaterial.bumpMap = bumpTexture;
                earthMaterial.bumpScale = 1;
                const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
                returnObject[name] = earthMesh;
                break

            case "exosphere_map":
                const fresnelMat = getFresnelMat();
                const exosphereMesh = new THREE.Mesh(sphereGeometry, fresnelMat);
                exosphereMesh.scale.setScalar(texturesArray[i]["scale"]);
                returnObject[name] = exosphereMesh;
                break

            case "starfield_map":
                const vertices = [];
                const pointGeometry = new THREE.BufferGeometry();
                for(let i = 0; i < 5000; i ++) {
                    const x = THREE.MathUtils.randFloatSpread(200);
                    const y = THREE.MathUtils.randFloatSpread(200);
                    const z = THREE.MathUtils.randFloatSpread(200);
                    vertices.push(x,y,z);
                }
                pointGeometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
                const starsQuality = texturesArray[i]["quality"];
                const starsTexture = loader.load(texturesQuality[name][starsQuality]);
                const starsMaterial = new THREE.PointsMaterial(properties);
                starsMaterial.map = starsTexture;
                const points = new THREE.Points(pointGeometry, starsMaterial);
                returnObject[name] = points;
                break

            case "clouds_map":
                const cloudsMat = new THREE.MeshStandardMaterial(properties);
                const cloudsQuality = texturesArray[i]["quality"];
                const cloudsTexture = loader.load(texturesQuality[name][cloudsQuality]);
                cloudsMat.alphaMap = cloudsTexture;
                const cloudsMesh = new THREE.Mesh(sphereGeometry, cloudsMat);
                cloudsMesh.scale.setScalar(texturesArray[i]["scale"]);
                returnObject[name] = cloudsMesh;
                break
        }
    }
    return returnObject
}


/* Creates lights based on lights data */
const buildLights = (lightArray) => {
    let returnObject = {};
    for(let i = 0; i < lightArray.length; i++){ 
        const name = lightArray[i]["name"];
        const properties = lightArray[i]["properties"];
        switch (name) {
            case "ambient_light":
                const ambientLight = new THREE.AmbientLight(properties["color"], properties["intensity"]);
                returnObject[name] = ambientLight;
                break
            case "directional_light":
                const directionalLight = new THREE.DirectionalLight(properties["color"], properties["intensity"]);
                returnObject[name] = directionalLight;
                break
        }
    }
    return returnObject
}


/* Creates Three group */
const createGroup = (texturesObject) =>{
    const group = new THREE.Group();
    group.name = "groupMesh";
    for(const [key, value] of Object.entries(texturesObject)){
        value.name = key;
        if(key != 'starfield_map'){
            group.add(value);
        }
    }
    return group
}


/* Returns earth group and meshes related to group */
const Group = (sphereProperties, texturesObject, texturesQuality) => {
    const sphere = createSphere(sphereProperties);
    const textures = buildTextures(sphere, texturesObject, texturesQuality);
    const groupMesh = createGroup(textures);
    return {groupMesh: groupMesh, backgroundMesh: textures["starfield_map"]}
}

/* Add Earth label functionality */
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


/* Remove object from scene */
const removeObject = (sceneObject, object) => {
    if(object instanceof Array){
        for(let i= 0; i < object.length; i++){
            object[i].dispose();
            sceneObject.remove(object[i]);
        }
    } else {
        object.dispose();
        sceneObject.remove(object);
    }
}

/* Add object to scene */
const addObject = (sceneObject, object) => {
    if(object instanceof Array){
        for(let i = 0; i < object.length; i++){
            sceneObject.add(object[i]);
        }
    } else {
        sceneObject.add(object);
    }
}

export {
    createRenderer, 
    createCamera, 
    createControls, 
    Earth,
    Group,
    setLabelAttributes,
    addObject,
    removeObject,
    buildLights,
    THREE
};

