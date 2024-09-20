# Seeding mongodb with default data
mongoimport --authenticationDatabase=$MONGO_INITDB_DATABASE -u=$MONGO_INITDB_ROOT_USERNAME -p=$MONGO_INITDB_ROOT_PASSWORD -d=$FIRMSDB -c=$FIRMSDB_areas --file=$FIRMSDB_areas_file --drop --jsonArray && \
mongoimport --authenticationDatabase=$MONGO_INITDB_DATABASE -u=$MONGO_INITDB_ROOT_USERNAME -p=$MONGO_INITDB_ROOT_PASSWORD -d=$FIRMSDB -c=$FIRMSDB_countries --file=$FIRMSDB_countries_file --drop --jsonArray && \
mongoimport --authenticationDatabase=$MONGO_INITDB_DATABASE -u=$MONGO_INITDB_ROOT_USERNAME -p=$MONGO_INITDB_ROOT_PASSWORD -d=$FIRMSDB -c=$FIRMSDB_parameters --file=$FIRMSDB_firms_file --drop --jsonArray && \
mongoimport --authenticationDatabase=$MONGO_INITDB_DATABASE -u=$MONGO_INITDB_ROOT_USERNAME -p=$MONGO_INITDB_ROOT_PASSWORD -d=$GEOSPATIALDB -c=$GEOSPATIALDB_world_data --file=$GEOSPATIALDB_world_data_file --drop && \
mongoimport --authenticationDatabase=$MONGO_INITDB_DATABASE -u=$MONGO_INITDB_ROOT_USERNAME -p=$MONGO_INITDB_ROOT_PASSWORD -d=$THREEJSDB -c=$THREEJSDB_lights --file=$THREEJSDB_lights_file --drop --jsonArray && \
mongoimport --authenticationDatabase=$MONGO_INITDB_DATABASE -u=$MONGO_INITDB_ROOT_USERNAME -p=$MONGO_INITDB_ROOT_PASSWORD -d=$THREEJSDB -c=$THREEJSDB_textures --file=$THREEJSDB_textures_file --drop --jsonArray
