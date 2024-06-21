const createTable = (objectsArray) => {
    if (objectsArray.length === 0) 
        return '';

    // Crear el elemento de la tabla
    let table = document.createElement('table');
    table.border = "1";  // Añadir borde a la tabla para mejor visualización

    // Crear el encabezado de la tabla
    let thead = table.createTHead();
    let headerRow = thead.insertRow();

    // Obtener las claves de los objetos para usarlas como encabezados
    let keys = Object.keys(objectsArray[0]);
    keys.forEach(key => {
        if(key != 'earth_cartesian'){
            let th = document.createElement('th');
            th.appendChild(document.createTextNode(key));
            headerRow.appendChild(th);
        }
    });

    // Crear el cuerpo de la tabla
    let tbody = document.createElement('tbody');
    table.appendChild(tbody);

    // Añadir las filas con los valores
    objectsArray.forEach(obj => {
        let row = tbody.insertRow();
        keys.forEach(key => {
            if(key != 'earth_cartesian'){
                let cell = row.insertCell();
                cell.appendChild(document.createTextNode(obj[key]));
            }
        });
    });

    // Devolver la tabla como un string HTML
    return table.outerHTML;
    }

const displayData = (data, userKey, domElement) =>{
    const htmlElm = document.getElementById(domElement);
    if(htmlElm!=null){
        const dataArr = data[userKey];
        let content = []
        for(let i = 0; i < dataArr.length; i++){
            const currData = dataArr[i];
            const firedata = currData['firedata'];
            for(let j=0; j<firedata.length;j++){
                content.push(firedata[j])
            }
        }
        htmlElm.innerHTML = createTable(content);
    }
}

export {displayData}