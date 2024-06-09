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
            result[selectors[i].id] = selectors[i].value
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

export {setOption, getData, requestedData};