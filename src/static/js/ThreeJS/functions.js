import { CSS2DRenderer, CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import { ArcballControls } from 'three/addons/controls/ArcballControls.js';
import { updateUserData } from "../Fetch/functions.js"
import { texturesQualityPath } from "./config.js";
import * as THREE from "three";

/* ---------------------------- RENDERS ---------------------------- */
/* Creates WebGL and Label renderer based on width and height parameters */
const setRender = (sceneWidth, sceneHeight) => {
    try {

        const renderer = new THREE.WebGLRenderer({antialias:true});
        renderer.setSize(sceneWidth, sceneHeight);
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
        const labelRenderer = new CSS2DRenderer();
        labelRenderer.setSize(sceneWidth, sceneHeight);
        labelRenderer.domElement.style.position = "absolute";
        labelRenderer.domElement.style.top = "0px";
        labelRenderer.domElement.addEventListener("pointerup", () => {
            labelRenderer.domElement.style.cursor = 'default';
        });

        return {'renderer' : renderer, 'labelRenderer': labelRenderer}

    } catch(error) {
        console.log(error)
    }
}

/* Label heat spots functionality */
const setLabelAttributes = (label, earth, camera) => {
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

/* Creates Label for heat spots */
const setHeatSpotLabel = (element, earthMesh, camera) => {
    const markerCSS2 = new CSS2DObject(element);
    setLabelAttributes(markerCSS2, earthMesh, camera);
    return markerCSS2
}

/* Creates Scene and camera */
const setCamera = (sceneWidth, sceneHeight) => {
    try {
        const aspectScene = sceneWidth/sceneHeight;
        const camera = new THREE.PerspectiveCamera(75, aspectScene, 0.1, 1000);
        camera.position.set(0, 0, 3);
        return camera
    } catch (error) {
        console.log(error)
    }
}

/* ---------------------------- CONTROLS ---------------------------- */
/* Creates Controls of Three JS camera */
const createControls = (camera, domElem, targetObject) => {
    const controls = new ArcballControls(camera, domElem);
    controls.target = targetObject.position;
    controls.enablePan = false;
    controls.minDistance = 1.15;
    controls.maxDistance = 5;
    controls.scaleFactor = 1.1;
    controls.dampingFactor = 25;
    return controls
}

/* ---------------------------- TEXTURES ---------------------------- */
/* Creates Fresnel maerial (exoshpere) */
const getFresnelMat = ({rimHex = 0x0088ff, facingHex = 0x000000} = {}) => {
    const uniforms = {
      color1: { value: new THREE.Color(rimHex) },
      color2: { value: new THREE.Color(facingHex) },
      fresnelBias: { value: 0.1 },
      fresnelScale: { value: 1.0 },
      fresnelPower: { value: 4.0 },
    };
    const vs = `
        uniform float fresnelBias;
        uniform float fresnelScale;
        uniform float fresnelPower;
        varying float vReflectionFactor;
        void main() {
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
        vec3 worldNormal = normalize( mat3( modelMatrix[0].xyz, modelMatrix[1].xyz, modelMatrix[2].xyz ) * normal );
        vec3 I = worldPosition.xyz - cameraPosition;
        vReflectionFactor = fresnelBias + fresnelScale * pow( 1.0 + dot( normalize( I ), worldNormal ), fresnelPower );
        gl_Position = projectionMatrix * mvPosition;
    }`;
    const fs = `
        uniform vec3 color1;
        uniform vec3 color2;
        varying float vReflectionFactor;
        void main() {
        float f = clamp( vReflectionFactor, 0.0, 1.0 );
        gl_FragColor = vec4(mix(color2, color1, vec3(f)), f);
    }`;
    const fresnelMat = new THREE.ShaderMaterial({
      uniforms: uniforms,
      vertexShader: vs,
      fragmentShader: fs,
      transparent: true,
      blending: THREE.AdditiveBlending
    });
    return fresnelMat;
}

/* Creates Textures based on textures data*/
const buildTextures = (sphereGeometry, texturesArray, texturesQuality) => {
    const returnObject = {};
    const loader = new THREE.TextureLoader();
    for(let i = 0; i < texturesArray.length; i++){
        const name = texturesArray[i]["name"];
        const properties = texturesArray[i]["properties"];
        const isVisible = texturesArray[i]["visible"];
        switch (name) {
            case "earth_map":
                try {
                    const earthMaterial = new THREE.MeshPhongMaterial(properties);
                    const earthQuality = texturesArray[i]["quality"];
                    const earthTexture = loader.load(texturesQuality[name][earthQuality]);
                    earthMaterial.map = earthTexture;
                    const bumpQuality = earthQuality;
                    const bumpTexture = loader.load(texturesQuality.bump_map[bumpQuality]);
                    earthMaterial.bumpMap = bumpTexture;
                    earthMaterial.bumpScale = 1;
                    const earthMesh = new THREE.Mesh(sphereGeometry, earthMaterial);
                    earthMesh.visible = isVisible;
                    earthMesh.name = name;
                    returnObject[name] = earthMesh;
                } catch (error) {
                    console.log(error);
                }
                break

            case "exosphere_map":
                try {
                    const fresnelMat = getFresnelMat();
                    const exosphereMesh = new THREE.Mesh(sphereGeometry, fresnelMat);
                    exosphereMesh.scale.setScalar(texturesArray[i]["scale"]);
                    exosphereMesh.visible = isVisible;
                    exosphereMesh.name = name;
                    returnObject[name] = exosphereMesh;
                } catch (error) {
                    console.log(error)
                }
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
                points.visible = isVisible;
                points.name = name;
                returnObject[name] = points;
                break

            case "clouds_map":
                try {
                    const cloudsMat = new THREE.MeshStandardMaterial(properties);
                    const cloudsQuality = texturesArray[i]["quality"];
                    const cloudsTexture = loader.load(texturesQuality[name][cloudsQuality]);
                    cloudsMat.alphaMap = cloudsTexture;
                    const cloudsMesh = new THREE.Mesh(sphereGeometry, cloudsMat);
                    cloudsMesh.scale.setScalar(texturesArray[i]["scale"]);
                    cloudsMesh.visible = isVisible;
                    cloudsMesh.name = name;
                    returnObject[name] = cloudsMesh;
                } catch (error) {
                    console.log(error)
                }
                break
        }
    }
    return returnObject
}

/* Creates Textures Three group for Earth */
const createGroup = (texturesObject, earthGroupName) =>{
    const group = new THREE.Group();
    group.name = earthGroupName;
    for(const [key, value] of Object.entries(texturesObject)){
        if(key != 'starfield_map'){
            group.add(value);
        }
    }
    return group
}

/* Returns scene object texturized */
const SceneObjects = (texturesObject, texturesQuality) => {
    const sphere = new THREE.SphereGeometry(1.0, 64, 32);
    const textures = buildTextures(sphere, texturesObject, texturesQuality);
    const EarthGroup = createGroup(textures, "earthMeshes");
    return {earth: EarthGroup, stars: textures["starfield_map"]}
}

/* ---------------------------- LIGHTS ---------------------------- */
/* Creates lights based on lights data */
const buildLights = (lightArray) => {
    const returnObject = {};
    try {
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
                    directionalLight.position.set(-4, 3, 2);
                    returnObject[name] = directionalLight;
                    break
            }
        }
    } catch (error) {
        console.log(error)
    }
    return returnObject
}

/* ---------------------------- LAYERS ---------------------------- */
/* Creates HTML layers section based on textures, apply visibility event */
const createLayersSection = (name, isVisible, textures, texturesBackground) =>{
    const layerSection = document.createElement("div");
    layerSection.className = 'section';
    const newNode = document.createElement("input");
    newNode.setAttribute('type', 'checkbox');
    newNode.className = 'checkbox-layer';
    newNode.checked = isVisible;
    if(name != "starfield_map") {
        newNode.addEventListener("change", (event) => {
            const meshes = textures.children;
            for(let j=0; j < meshes.length; j++){
                if(meshes[j].name == name){
                    meshes[j].visible = event.target.checked;
                    break;
                }
            }
        });
    } else {
        newNode.addEventListener("change", (event) => {
            texturesBackground.visible = event.target.checked;
        });
    }
    newNode.setAttribute('property', name);
    const label = document.createElement("label");
    const labelName = name.replace(/_/g, " ");
    label.innerHTML = labelName[0].toUpperCase() + labelName.substring(1);
    layerSection.appendChild(newNode);
    layerSection.appendChild(label);
    return layerSection
}

/* Save layer visibility status on mongodb */
function saveLayers(key, texturesArray){
    let objectBody = [];
    let params = { "collection" : "threejs", "array": "textures" };
    for(let i = 0; i < texturesArray.length; i++) {
        const layerData = texturesArray[i]["name"];
        const optionChecked = document.querySelector(`.checkbox-layer[property = '${layerData}']`).checked;
        texturesArray[i]["visible"] = optionChecked;
        objectBody.push({"name": layerData, "visible" : optionChecked});
    }
    return updateUserData(key, params, objectBody);
}

/* Set layers options to display based on user data */
const setLayersOptions = (userKey, texturesArray, groupMesh, backgroundMesh) => {
    const layersDiv = document.getElementById("earth-layers");
    if(layersDiv != null){
        for(let i = 0; i < texturesArray.length; i++){
            const textureOption = createLayersSection(texturesArray[i]["name"], 
                                                        texturesArray[i]["visible"], 
                                                        groupMesh, 
                                                        backgroundMesh);
            layersDiv.appendChild(textureOption);
        }
        const applyLayers = document.createElement("button");
        applyLayers.className = "button-2 action-button";
        applyLayers.textContent = "Save layers";
        applyLayers.id = "save-interface-layers";
        applyLayers.addEventListener("click", () => {
            const response = saveLayers(userKey, texturesArray);
        });
        const applyLayersDiv = document.createElement("div");
        applyLayersDiv.appendChild(applyLayers);
        layersDiv.appendChild(applyLayersDiv);
    }
}


/* ---------------------------- MAIN ---------------------------- */
export function setThreeJS() {
    /* HTML Renders */
    const yOffset = document.getElementById("header").offsetHeight;
    const width = window.innerWidth;
    const height = window.innerHeight + yOffset;
    const rendersObject = setRender(width, height);
    const container = document.getElementById("threejs-canvas");
    container.appendChild(rendersObject.renderer.domElement);
    container.appendChild(rendersObject.labelRenderer.domElement);

    /* ThreeJS Camera */
    const camera = setCamera(width, height);
    
    /* ThreeJS Scene Objects and textures */
    const userTextures = user_data["threejs"]["textures"];
    const userLights = user_data["threejs"]["lights"];
    const sceneObjects = SceneObjects(userTextures, texturesQualityPath);
    const lightObjects = buildLights(userLights);

    /* Adding Objects to scene */
    const scene = new THREE.Scene();
    scene.add(sceneObjects.earth);
    scene.add(sceneObjects.stars);
    scene.add(lightObjects.ambient_light);

    /* Adding Sunlight */
    camera.add(lightObjects.directional_light);
    scene.add(camera);

    /* Adding label for heat spots */
    const markerElement = document.querySelector("[data-content='Marker-Label']");
    const earthMesh = sceneObjects.earth.children[0];
    const heatSpotLabel = setHeatSpotLabel(markerElement, earthMesh, camera);
    scene.add(heatSpotLabel);

    /* Set controls for Scene */
    const controls = createControls(camera, rendersObject.labelRenderer.domElement, sceneObjects.earth);

    /* Adding layer options based on textures */
    setLayersOptions(user_data["threejs"]["firms_key"], userTextures, sceneObjects.earth, sceneObjects.stars)

    const animate = () => { 
        requestAnimationFrame(animate);
        heatSpotLabel.userData.trackVisibility();
        rendersObject.renderer.render(scene, camera);
        rendersObject.labelRenderer.render(scene, camera);
        controls.update();
    }

    animate()
}