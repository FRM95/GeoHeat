import {notificationHandler} from '../UX/notifications.js'

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
                newOpt.setAttribute("data-coordinates", currOpt['coordinates']);
                newOpt.setAttribute("data-name", currOpt['name']);
            }
            else if('country' in currOpt){
                newOpt.value = currOpt['country'];
                newOpt.text = currOpt['name'];
                newOpt.setAttribute("data-coordinates", currOpt['coordinates']);
                newOpt.setAttribute("data-name", currOpt['name']);
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
    const date = new Date();
    for(let i = 0; i<selectors.length; i++){
        const selection = selectors[i];
        if (!selection.classList.contains("hidden")){
            const property = selection.getAttribute('property');
            result[property] = selection.value;
            if(property === "location"){
                const options = selection.options[selection.selectedIndex];
                result['coordinates'] = options.dataset.coordinates;
                result['name'] = options.dataset.name;
            }
        }
    }
    result['time'] = date.toTimeString().slice(0, 8);
    result['full_date'] = date.toString().split("(")[0].trim();
    result['utc_date'] = date.toISOString().replace("T"," ").substring(0, 10);
    result['utc_time'] = date.toISOString().replace("T"," ").substring(11, 19);
    result['full_utc_date'] = date.toUTCString();
    return result
}

/* Decides to allow the new request, not to allow, or add aditional data based on dayrange */
const allowRequest = (userKey, currentData, selectedData) => {
    let result = { 'allowed' : true, 'reference' : null, 'reason_denied' : null };
    const userData = currentData[userKey];
    for(let i = 0; i < userData.length; i++){
        const data = userData[i];
        if(data['date'] == selectedData['date']){
            if(data['source'] == selectedData['source']){
                if(data['delimiter'] == 'country'){
                    if(data['location'] == selectedData['location']){
                        if(data['dayrange'] >= parseInt(selectedData['dayrange'])){
                            result['allowed'] = false;
                            result['reason_denied'] = `You've already requested data from: ${data['location']} within ${data['dayrange']} days`;
                            break
                        }
                        else if(data['dayrange'] < parseInt(selectedData['dayrange'])){
                            result['reference'] = data
                            break
                        }
                    }
                }
                else{
                    if(data['location'] == "-180,-90,180,90"){
                        if(data['dayrange'] >= parseInt(selectedData['dayrange'])){
                            result['allowed'] = false;
                            result['reason_denied'] = `You've already requested data from: World within ${data['dayrange']} days`;
                            break
                        }
                        else if(data['dayrange'] < parseInt(selectedData['dayrange'])){
                            result['reference'] = data
                            break
                        }
                    }
                    else{
                        if(data['location'] == selectedData['location']){
                            if(data['dayrange'] >= parseInt(selectedData['dayrange'])){
                                result['allowed'] = false;
                                result['reason_denied'] = `You've already requested data from: ${data['location']} within ${data['dayrange']} days`;
                                break
                            }
                            else if(data['dayrange'] < parseInt(selectedData['dayrange'])){
                                result['reference'] = data
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
const added_data = (userKey, userData, flagRequest, selectedData, newData) => {
    if('error' in newData){
        notificationHandler('request_error', selectedData, newData);
        return false 
    }
    else{
        if(flagRequest['reference'] == null){
            userData[userKey].push(newData[userKey][0]);
        }
        else{
            let pointerReference = flagRequest['reference'];
            pointerReference['firedata'] = newData[userKey][0]['firedata'];
            pointerReference['dayrange'] = newData[userKey][0]['dayrange'];
        }
        notificationHandler('request_correct', selectedData)
        return true
    }
}

/* Fetch new NASA FIRMS DATA based on options */
async function getData(userKey, userData, flagRequest, selectedData){
    try{
        selectedData["key"] = userKey;
        const response = await fetch('/updateData', {
            method: 'POST',
            body: JSON.stringify(selectedData),
            headers: {
              'Content-Type': 'application/json',
            },
        });
        const newData = await response.json();
        return added_data(userKey, userData, flagRequest, selectedData, newData);
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