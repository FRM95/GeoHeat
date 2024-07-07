const padTwoDigits = (num) => {
    return num.toString().padStart(2, "0");
  }

/* Hide options based on value */
const hideOptions = (htmlElm) =>{
    if(htmlElm != null){
        htmlElm.addEventListener("change", _ =>{
            let showElement = htmlElm.value;
            if (showElement == 'area'){
                document.getElementById("requestArea").classList.remove("hidden");
                document.getElementById("requestCountry").classList.add("hidden");
            }
            else{
                document.getElementById("requestCountry").classList.remove("hidden");
                document.getElementById("requestArea").classList.add("hidden");
            }
        })
    }
}

/* Appends options to existing collection */
const setOption = (optKey, optValue) => {
    const htmlElm = document.getElementById('request' + optKey);
    if(htmlElm!=null){
        const arrValues = optValue;
        if(htmlElm.id === 'requestDelimiter'){ hideOptions(htmlElm); }
        for(let i = 0; i < arrValues.length; i++){
            const newOpt = document.createElement("option");
            const currOpt = arrValues[i];
            if('area' in currOpt){
                newOpt.value = currOpt['area'];
                newOpt.text = currOpt['name'];
            }
            else if('country' in currOpt){
                newOpt.value = currOpt['country'];
                newOpt.text = currOpt['name'];
            }
            else if('delimiter' in currOpt){
                newOpt.value = currOpt['delimiter'];
                newOpt.text = currOpt['delimiter'][0].toUpperCase() + currOpt['delimiter'].substring(1);
            }
            else if('source' in currOpt){
                newOpt.value = currOpt['source'];
                newOpt.text = currOpt['source'].replace(/_/g, " ");
            }
            else if('dayrange' in currOpt){
                newOpt.value = currOpt['dayrange'];
                newOpt.text = currOpt['dayrange'];
            }
            if(newOpt.value != ""){ htmlElm.add(newOpt, null); }
        }
    }
}

/* Obtains filtered options */
const requestedData = (selectors) => {
    let result = {};
    for(let i = 0; i<selectors.length; i++){
        if (!selectors[i].classList.contains("hidden")){
            result[selectors[i].getAttribute('property')] = selectors[i].value;
        }
    }
    return result
}

/* Decides to allow the new request, not to allow, or add aditional data based on dayrange */
const allowRequest = (userKey, currentData, selectedData) => {
    let result = true;
    const userData = currentData[userKey];
    for(let i = 0; i < userData.length; i++){
        const data = userData[i];
        if(data['date'] == selectedData['date']){
            if(data['source'] == selectedData['source']){
                if(data['delimiter'] == 'country'){
                    if(data['zone'] == selectedData['zone']){
                        if(data['dayrange'] >= parseInt(selectedData['dayrange'])){
                            result = false
                            break
                        }
                        else if(data['dayrange'] < parseInt(selectedData['dayrange'])){
                            result = data
                            break
                        }
                    }
                }
                else{
                    if(data['zone'] == "-180,-90,180,90"){
                        if(data['dayrange'] >= parseInt(selectedData['dayrange'])){
                            result = false
                            break
                        }
                        else if(data['dayrange'] < parseInt(selectedData['dayrange'])){
                            result = data
                            break
                        }
                    }
                    else{
                        if(data['zone'] == selectedData['zone']){
                            if(data['dayrange'] >= parseInt(selectedData['dayrange'])){
                                result = false
                                break
                            }
                            else if(data['dayrange'] < parseInt(selectedData['dayrange'])){
                                result = data
                                break
                            }
                        }
                    }
                }
            }
        }
    }
    return result
}

/* Adds requested data to user data */
function addData(userKey, userData, flagOption, newData){
    if('error' in newData){
        console.log(newData);
        return false 
    }
    else{
        if(flagOption == true){
            userData[userKey].push(newData[userKey][0]);
            console.log(userData);
        }
        else{
            flagOption['firedata'] = newData[userKey][0]['firedata'];
            flagOption['dayrange'] = newData[userKey][0]['dayrange'];
            console.log(userData);
        }
        return true
    }
}

/* Fetch new NASA FIRMS DATA based on options */
async function getData(userKey, userData, flagOption, selectedData){
    if(flagOption == false){
        return flagOption // flash message of data is already downloaded
    }
    try {
        selectedData["key"] = userKey;
        const response = await fetch('/updateData', {
            method: 'POST',
            body: JSON.stringify(selectedData),
            headers: {
              'Content-Type': 'application/json',
            },
        });
        const newData = await response.json();
        return addData(userKey, userData, flagOption, newData);
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}

/* Saves NASA FIRMS DATA in backend*/
async function putData(userData){
    try {
        const response = await fetch('/updateData', {
            method: 'PUT',
            body: JSON.stringify(userData),
            headers: {
              'Content-Type': 'application/json',
            },
        });
        return await response.text();
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}

/* Exports NASA FIRMS DATA to file */
async function exportData(userKey, userData, option) {
    const data = userData[userKey];
    if(data.length == 0){
        console.error('empty')
        return null // flash message of empty data
    }
    if(option == 'csv') {
        let headers = null;
        let rows = [];
        try {
            for(let i = 0; i < data.length; i++){
                const requestedFires = data[i][firedata];
            }
        } catch (error) {
            console.error(error) // flash message of fetch error
        }
    }
    else if(option == 'json'){
        try{
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], {type: 'application/json'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            const currDate = new Date();
            const fileName = `${padTwoDigits(currDate.getDate())}${padTwoDigits(currDate.getMonth() + 1)}${currDate.getFullYear()}_${padTwoDigits(currDate.getHours())}${padTwoDigits(currDate.getMinutes())}`;
            a.download = `firms_data_${fileName}.json`;
            a.click();
            URL.revokeObjectURL(url);
            // const tab = window.open("data:application/json," + encodeURIComponent(json), "_blank");
            // tab.focus();
        }
        catch (error) {
            console.error(error) // flash message of fetch error
        }
    }
}


export {setOption, getData, putData, requestedData, allowRequest, exportData};