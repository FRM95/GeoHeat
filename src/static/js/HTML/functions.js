export const createDivWithSpanAndSelect = (selectClass, spanText, optionsArray) => {
    const div = document.createElement("div");
    div.className = "select";
    const span = document.createElement("span");
    span.textContent = spanText;
    const select = document.createElement("select");
    select.className = selectClass;
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

export const createDivWithSpanAndCheckbox = (checkBoxClass, checkBoxName, spanText, isChecked = false) => {
    const div = document.createElement("div");
    div.className = "input";
    const checkbox = document.createElement("input");
    checkbox.name = checkBoxName;
    checkbox.type = "checkbox";
    checkbox.checked = isChecked;
    checkbox.className = checkBoxClass;
    const label = document.createElement("label");
    let spanValue = spanText.charAt(0).toUpperCase() + spanText.slice(1);
    label.textContent = spanValue.replace(/_/g, " ");
    label.setAttribute("for", checkBoxName);
    div.appendChild(checkbox);
    div.appendChild(label);
    return div;
}

export const createDivWithTimeSelect = (options, spanText) => {
    const div = document.createElement("div");
    div.className = "select";
    const select = document.createElement("select");
    options.forEach(optionData => {
        const option = document.createElement("option");
        option.value = optionData.value;
        option.textContent = optionData.text; 
        select.appendChild(option); 
    });
    const span = document.createElement("span");
    span.textContent = spanText;
    div.append(span, select);
    return div;
}

export const createDivWithDateInput = (inputClassName, spanText) => {
    const div = document.createElement("div");
    div.className = "input";
    const date = document.createElement("input");
    date.className = inputClassName;
    date.type = "date";
    date.placeholder = "DD-MM-YYYY";
    const currDay = new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
    date.max = currDay;
    date.value = currDay;
    const span = document.createElement("span");
    span.textContent = spanText;
    div.append(span, date);
    return div;
}

export const createDetailsElement = (summaryText, summaryDescription, contentElement) => {
    const details = document.createElement("details");
    const summary = document.createElement("summary");
    summary.className = "subsection-summary";
    summary.innerHTML = `<span class="subsection-title">${summaryText}</span><br><span class="subsection-description">${summaryDescription}</span>`;
    details.appendChild(summary);
    contentElement.className = "subsection-content";
    details.appendChild(contentElement);
    details.open = true;
    details.className = "subsection-details";
    return details;
}