/* Hide options based on value */
const hideOptions = (htmlElm) =>{
    if(htmlElm != null){
        htmlElm.addEventListener("change", _ =>{
            let showElement = htmlElm.value;
            if (showElement == 'Area'){
                document.getElementById("new-area").classList.remove("hidden");
                document.getElementById("new-country").classList.add("hidden");
            }
            else{
                document.getElementById("new-country").classList.remove("hidden");
                document.getElementById("new-area").classList.add("hidden");
            }
        })
    }
}

/* Appends options to existing collection */
const setOption = (data, domElement, valueProp, labelProp) =>{
    const htmlElm = document.getElementById(domElement);
    if(htmlElm != null && data != null){
        if (htmlElm.id == 'new-delimiter'){
            hideOptions(htmlElm);
        }
        for (let i = 0; i<data.length; i++){
            const newOpt = document.createElement("option");
            const value = data[i][valueProp];
            const text = data[i][labelProp];
            newOpt.value = value;
            newOpt.text = text;
            htmlElm.add(newOpt, null);
        }
    }
}

async function getData(){
    try {
        const response = await fetch('/getData', {
            method: 'POST',
            body: JSON.stringify({ key: 'value' }),
            headers: {
              'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        console.error(error)
    }
}

export {setOption};