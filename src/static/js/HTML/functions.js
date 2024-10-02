export const createDivWithSpanAndSelect = (spanText, optionsArray) => {
    const div = document.createElement("div");
    const span = document.createElement("span");
    span.textContent = spanText;
    const select = document.createElement("select");
    optionsArray.forEach(optionVal => {
        if(optionVal instanceof Object){
            const option = document.createElement("option");
            option.value = optionVal["value"];
            option.textContent = optionVal["name"];
            select.appendChild(option); 
        } else {
            const option = document.createElement("option");
            option.value = optionVal;
            if(typeof optionVal === "string"){
                const val = optionVal.charAt(0).toUpperCase() + optionVal.slice(1);
                option.textContent = val.replace(/_/g, " ");
            } else {
                option.textContent = optionVal
            }
            select.appendChild(option); 
        }
    });
    div.appendChild(span);
    div.appendChild(select);
    return div;
}

export const createDivWithSpanAndCheckbox = (checkBoxName, spanText, isChecked = false) => {
    const div = document.createElement('div');
    const checkbox = document.createElement('input');
    let name = checkBoxName.charAt(0).toUpperCase() + checkBoxName.slice(1);
    name = name.replace(/_/g, " "); 
    checkbox.name = name;
    checkbox.type = "checkbox";
    checkbox.checked = isChecked;
    const label = document.createElement('label');
    let spanValue = spanText.charAt(0).toUpperCase() + checkBoxName.slice(1);
    label.textContent = spanValue.replace(/_/g, " ");
    label.setAttribute("for", name);
    div.appendChild(checkbox);
    div.appendChild(label);
    return div;
}

export const createDivWithTimeSelect = (options) => {
    const div = document.createElement('div');
    const select = document.createElement('select');
    options.forEach(optionData => {
        const option = document.createElement('option');
        option.value = optionData.value;
        option.textContent = optionData.text; 
        select.appendChild(option); 
    });
    const span = document.createElement("span");
    span.textContent = "Time Interval";
    div.append(span, select);
    return div;
}

export const createDetailsElement = (summaryText, contentElement) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.textContent = summaryText;
    details.appendChild(summary);
    details.appendChild(contentElement);
    return details;
}