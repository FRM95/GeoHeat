/* Hide options based on value */
const hideOptions = (htmlElm) =>{
    if(htmlElm != null){
        htmlElm.addEventListener("change", _ =>{
            let showElement = htmlElm.value;
            if (showElement == 'area'){
                document.getElementById("select-area").classList.remove("hidden");
                document.getElementById("select-country").classList.add("hidden");
            }
            else{
                document.getElementById("select-country").classList.remove("hidden");
                document.getElementById("select-area").classList.add("hidden");
            }
        })
    }
}

/* Appends options to existing collection */
const setOption = (data, domElement, valueProp, labelProp) =>{
    const htmlElm = document.getElementById(domElement);
    if(htmlElm != null && data != null){
        if (htmlElm.id == 'select-delimiter'){
            hideOptions(htmlElm);
        }
        for (let i = 0; i<data.length; i++){
            const newOpt = document.createElement("option");
            if(data[i][valueProp] != null){
                const value = data[i][valueProp];
                const text = data[i][labelProp];
                newOpt.value = value;
                newOpt.text = text;
                htmlElm.add(newOpt, null);
            }
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