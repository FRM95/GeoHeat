/* Auxiliar function to create Div for inspect section */
const defineNode = (identifier, currData, spots) =>{

    const nodeDiv = document.createElement('div');
    nodeDiv.id = identifier;
    nodeDiv.className = "section d-grid c-inspect";

    const spanDate = document.createElement('span');
    spanDate.innerHTML = `Data from: ${currData['date']}`;
    const numberOfSpots = document.createElement('span');
    numberOfSpots.innerHTML = `Current spots: ${spots}`;
    const spanSource = document.createElement('span');
    spanSource.innerHTML = `Source: ${currData['source']}`;
    const spanDelimiter = document.createElement('span');
    spanDelimiter.innerHTML = `Delimiter: ${currData['delimiter']}`;
    const spanZone = document.createElement('zone');
    spanZone.innerHTML = `Zone: ${currData['zone']}`;
    const spanDayRange = document.createElement('span');
    spanDayRange.innerHTML = `dayrange: ${currData['dayrange']}`;

    nodeDiv.appendChild(spanDate);
    nodeDiv.appendChild(numberOfSpots);
    nodeDiv.appendChild(spanSource);
    nodeDiv.appendChild(spanDelimiter);
    nodeDiv.appendChild(spanZone);
    nodeDiv.appendChild(spanDayRange);

    return nodeDiv
}

/* Auxiliar function to create table html element for inspect section */
const createTable = (objectsArray) => {
    if (objectsArray.length === 0) 
        return '';

    // Crear el elemento de la tabla
    let table = document.createElement('table');

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


/* Display user data in inspect data section */
const setInspectData = (userKey, dataObject, summaryName, tableName) =>{

    const dataArr = dataObject[userKey];
    let totalSpots = 0
    let nodesToAppend = [];
    let tableInfo = [];

    /* Iterates through user current data */
    for(let i = 0; i < dataArr.length; i++){
        const currData = dataArr[i];
        const firedata = currData['firedata'];
        const nSpots = firedata.length;
        totalSpots += nSpots;
        const divIdentifier = `Identifier:${currData['date']}_${currData['source']}_${currData['delimiter']}_${currData['zone']}_${currData['dayrange']}`;

        /* If inspect data does not contains that request information*/
        if (document.getElementById(divIdentifier) == null){
            const newNode = defineNode(divIdentifier, currData, nSpots);
            nodesToAppend.push(newNode);
        }

        /* We do not care about new spots information here, just add all */
        for(let j=0; j<firedata.length;j++){
            tableInfo.push(firedata[j])
        }

    }

    /* Add content to summary */
    const summaryNode = document.getElementById(summaryName);
    const emptyNode = document.getElementById("empty-data-summary");
    if(summaryNode != null){
        if(emptyNode){
            summaryNode.removeChild(emptyNode)
        }
        let nodeTSpots = document.getElementById('user_totalSpots');
        let nodeKey = document.getElementById('user_key');
        if(nodeTSpots == null){
            nodeTSpots = document.createElement('span');
            nodeTSpots.id = 'user_totalSpots';
            nodeTSpots.innerHTML = `Total spots: ${totalSpots}`;
            summaryNode.appendChild(nodeTSpots);
        }
        else{
            nodeTSpots.innerHTML = `Total spots: ${totalSpots}`;
        }
        if(nodeKey == null){
            nodeKey = document.createElement('span');
            nodeKey.id = 'user_key';
            nodeKey.innerHTML = `FIRMS key: ${userKey}`; 
            summaryNode.appendChild(nodeKey);   
        }
        else{
            nodeKey.innerHTML = `FIRMS key: ${userKey}`;
        }
        for(let k = 0; k < nodesToAppend.length; k++){
            summaryNode.appendChild(nodesToAppend[k]);
        }
    }

    /* Add content to table */
    const tableNode = document.getElementById(tableName);
    if(tableNode != null){
        tableNode.innerHTML = createTable(tableInfo)
    }

    return;
}


export {setInspectData}