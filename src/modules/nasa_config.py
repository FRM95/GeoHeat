NASA_TYPES = {
    'latitude': float, 
    'longitude': float, 
    'path':str,
    'row':str,
    'brightness':float,
    'bright_t31':float,
    'scan':float, 
    'track':float, 
    'bright_ti4': float, 
    'bright_ti5': float,
    'confidence': str,
    'frp': float, 
    'acq_time': int,
    'daynight': str,
    'satellite':str,
    'instrument':str,
    'version':str
}

NASA_SOURCES = [
    "VIIRS_SNPP_NRT",
    "VIIRS_SNPP_SP",
    "VIIRS_NOAA20_NRT",
    "VIIRS_NOAA21_NRT",
    "MODIS_NRT",
    "MODIS_SP",
    "LANDSAT_NRT"
]