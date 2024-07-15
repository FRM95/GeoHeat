/* Default Textures path */
const texturesQuality = {
    Earth_map :{
        'high' : "/static/textures/high/earth_map_10k.png",
        'ultrahigh': "/static/textures/ultra-high/earth_map_16k.png"
    },
    Bump_map :{
        'high' : "/static/textures/high/earth_bump_10k.png",
        'ultrahigh': "/static/textures/ultra-high/earth_bump_16k.png"
    },
    Clouds_map :{
        'high' : "/static/textures/high/earth_cloud_10k.png",
        'ultrahigh': "/static/textures/ultra_high/earth_cloud_16k.png"
    },
}

/* Default Textures properties */
var texturesProperties = {
    Earth_map : {
        visible : true,
        texture_quality: 'high',
        properties : {
            color: 0xffffff,
            emissive: 0x000000
        }
    },
    Clouds_map:{
        visible : true,
        texture_quality: 'high',
        properties : {
            color: 0xffffff,
            emissive: 0x000000,
            opacity: 1,
            transparent: true
        },
        scale: 1.0025,
    },
    Exosphere_map:{
        visible : true,
        properties : {},
        scale: 1.003
    }
}

/* Default Light properties */
const lightProperties = {
    ambient_light : {
        visible : true,
        properties : {
            color: 0xFFFFFF, 
            intensity: 0.25
        }
    },
    directional_light : {
        visible : true,
        properties : {
            color: 0xFFFFFF, 
            intensity: 6.5  
        }

    }
}

export { texturesQuality, texturesProperties, lightProperties }