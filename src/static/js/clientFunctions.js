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

/* Checks filtered options */
const allowRequest = (userKey, currentData, selectedData) => {
    const userData = currentData[userKey];
    let result = "request"; /* request, not request, add */
    for(let i = 0; i < userData.length; i++){
        const data = userData[i];
        if(data['date'] == selectedData['date']){
            if(data['source'] == selectedData['source']){
                if(data['delimiter'] == 'country'){
                    if(data['zone'] == selectedData['zone']){
                        if(String(data['dayrange']) == selectedData['dayrange']){
                            result = "not request"
                            break
                        }
                        else{
                            result = "add"
                            break
                        }
                    }
                }
                else{
                    if(data['zone'] == "-180,-90,180,90"){
                        if(String(data['dayrange']) == selectedData['dayrange']){
                            result = "not request"
                            break
                        }
                        else{
                            result = "add"
                            break
                        }
                    }
                    else{
                        if(data['zone'] == selectedData['zone']){
                            if(String(data['dayrange']) == selectedData['dayrange']){
                                result = "not request"
                                break
                            }
                            else{
                                result = "add"
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


/* Hide options based on value */
async function getData(data, key){
    try {
        data["key"] = key;
        const response = await fetch('/getData', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
              'Content-Type': 'application/json',
            },
        });
        return await response.json();
    } catch (error) {
        console.error(error)
    }
}

export {setOption, getData, requestedData, allowRequest};