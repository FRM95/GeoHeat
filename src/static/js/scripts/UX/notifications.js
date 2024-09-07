const dropdown_notifications = document.getElementById("dropwdown-notifications");
const notifications_layer = document.getElementById("notifications-layer");
const notifitications_counter_value = document.querySelector(".notifications-counter-value");


/* Reset notifications to empty (REQUEST) */
const setToEmpty = () =>{
    if(dropdown_notifications.getAttribute("data-status") == "active"){
        dropdown_notifications.setAttribute("data-status", "empty");
        dropdown_notifications.setAttribute("data-notifications", "0");
    }
}

/* Updates notifications counter (REQUEST) */
const updateNotificationCounter = (action) => {
    let currentValue = parseInt(dropdown_notifications.getAttribute("data-notifications"));
    if(action == "increase"){
        let increasedValue = currentValue + 1;
        let stringIncreased = String(increasedValue);
        dropdown_notifications.setAttribute("data-notifications", stringIncreased);
        dropdown_notifications.setAttribute("data-status", "active");
        if(increasedValue <= 5){
            notifitications_counter_value.textContent = stringIncreased;
        } else {
            notifitications_counter_value.textContent = "+5";
        }
    }
    else if (action == "decrease"){
        let decreasedValue = currentValue - 1;
        if(decreasedValue <= 0){
            setToEmpty();
        } else{
            let stringDecreased = String(decreasedValue);
            dropdown_notifications.setAttribute("data-notifications", stringDecreased);
            dropdown_notifications.setAttribute("data-status", "active");
            notifitications_counter_value.textContent = stringDecreased;
        }
    }
}

/* Close notification event (REQUEST) */
function closeNotification(notificationElement){
    updateNotificationCounter("decrease");
    notificationElement.remove();
}

/* Creates div related to a single notification (REQUEST) */
function setSingleNotification(status, divIdentifier){
    const notification = document.createElement("div");
    notification.className = "notification d-grid";
    notification.id = divIdentifier;
    notification.setAttribute("data-status", status);
    updateNotificationCounter("increase");
    return notification
}

/* Creates div related to notification ID section (REQUEST) */
function setNotificationId(message, domElement) {
    const notification_id = document.createElement("div");
    notification_id.className = "notification-id";
    const span_message = document.createElement("span");
    span_message.innerText = message;
    const buttonClose = document.createElement("button");
    buttonClose.className = "button-4 window-button selector";
    buttonClose.setAttribute('action', 'hide');
    buttonClose.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="currentColor" class="bi bi-x-circle-fill" viewBox="0 0 17 17"><path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0M5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293z"></path></svg>';
    buttonClose.addEventListener("click", _ =>{
        closeNotification(domElement);
    });
    notification_id.appendChild(span_message);
    notification_id.appendChild(buttonClose);
    return notification_id
}

/* Creates div related to notification message section (REQUEST) */
function setNotificationMessage(message) {
    const notification_message = document.createElement("div");
    notification_message.className = "notification-message";
    const span_hour = document.createElement("span");
    span_hour.innerText = message;
    notification_message.appendChild(span_hour);
    return notification_message
}

/* User notification when request is correct (REQUEST) */
const setCorrectNotification = (data, requestStatus) => {
    try{
        const identifier = `notification_id_${data['source']}_${data['full_date']}_${data['location']}`;
        if(document.getElementById(identifier) == null){
            const notification = setSingleNotification(requestStatus, identifier);
            const notification_id = setNotificationId(`Requested fire data from FIRMS`, notification);
            const notification_message = setNotificationMessage(data['full_date']);
            notification.appendChild(notification_id);
            notification.appendChild(notification_message);
            notifications_layer.appendChild(notification);
        }
    } catch(error) {
        console.error(error);
    }
}

/* User notification when request is allowed but came with error (REQUEST) */
const setErrorNotification = (data, requestData, requestStatus) => {
    try{
        const identifier = `notification_error_id_${data['source']}_${data['full_date']}_${data['location']}`;
        if(document.getElementById(identifier) == null){
            const notification = setSingleNotification(requestStatus, identifier);
            const notification_id = setNotificationId(`Request from FIRMS error: ${requestData['error']}`, notification);
            const notification_message = setNotificationMessage(data['full_date']);
            notification.appendChild(notification_id);
            notification.appendChild(notification_message);
            notifications_layer.appendChild(notification);
        }
    } catch(error) {
        console.error(error);
    }
}

/* User notification when request is not allowed (REQUEST) */
const setDeniedNotification = (data, requestStatus) => {
    try{
        // console.log(requestStatus, data)
    } catch (error) {
        // console.log(error)
    }
}

/* User notification handler */
const notificationHandler = (notificationType, param1 = null, param2 = null) => {
    switch(notificationType){
        case 'request_correct':
            setCorrectNotification(param1, "correct");
            break;

        case 'request_error':
            setErrorNotification(param1, param2, "error");
            break;

        case 'request_denied':
            setDeniedNotification(param1, "denied");
            break;
    }
}


export { notificationHandler }