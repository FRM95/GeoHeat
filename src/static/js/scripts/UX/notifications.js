const notificationsDropdown = document.getElementById("dropwdown-notifications");
const notificationDiv = document.getElementById("notifications-layer");
const notificationsCounter = document.getElementById("notification-counter");


/* Reset notifications to empty (REQUEST) */
const setToEmpty = () =>{
    if(notificationsDropdown.getAttribute("status") == "active"){
        notificationsDropdown.setAttribute("status", "empty");
        notificationsDropdown.setAttribute("notifications", "0");
    }
}

/* Updates notifications counter (REQUEST) */
const updateNotificationCounter = (action) => {
    let currentValue = parseInt(notificationsDropdown.getAttribute("notifications"));
    if(action == "increase"){
        let increasedValue = currentValue + 1;
        let stringIncreased = String(increasedValue);
        notificationsDropdown.setAttribute("notifications", stringIncreased);
        notificationsDropdown.setAttribute("status", "active");
        if(increasedValue <= 5){
            notificationsCounter.textContent = stringIncreased;
        } else {
            notificationsCounter.textContent = "+5";
        }
    }
    else if (action == "decrease"){
        let decreasedValue = currentValue - 1;
        if(decreasedValue <= 0){
            setToEmpty();
        } else{
            let stringDecreased = String(decreasedValue);
            notificationsDropdown.setAttribute("notifications", stringDecreased);
            notificationsDropdown.setAttribute("status", "active");
            notificationsCounter.textContent = stringDecreased;
        }
    }
}

/* Close notification event (REQUEST) */
function closeNotification(notificationElement){
    updateNotificationCounter("decrease");
    notificationElement.remove();
}

/* Creates div related to a single notification (REQUEST) */
function notification_DIV(status, divIdentifier){
    const notification = document.createElement("div");
    notification.className = "notification d-grid";
    notification.id = divIdentifier;
    notification.setAttribute('status', status);
    updateNotificationCounter("increase");
    return notification
}

/* Creates div related to notification ID section (REQUEST) */
function notification_ID_DIV(message, domElement) {
    const notification_id = document.createElement("div");
    notification_id.className = "notification-id";
    const span_message = document.createElement("span");
    span_message.innerText = message;
    const buttonClose = document.createElement("button");
    buttonClose.textContent = 'X';
    buttonClose.addEventListener("click", _ =>{
        closeNotification(domElement);
    });
    notification_id.appendChild(span_message);
    notification_id.appendChild(buttonClose);
    return notification_id
}

/* Creates div related to notification message section (REQUEST) */
function notification_MESSAGE_DIV(message) {
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
        const identifier = `notification_id_${data['source']}_${data['full_date']}_${data['zone']}`;
        if(document.getElementById(identifier) == null){
            const notification = notification_DIV(requestStatus, identifier);
            const notification_id = notification_ID_DIV(`Requested fire data from FIRMS`, notification);
            const notification_message = notification_MESSAGE_DIV(data['full_date']);
            notification.appendChild(notification_id);
            notification.appendChild(notification_message);
            notificationDiv.appendChild(notification);
        }
    } catch(error) {
        console.error(error);
    }
}

/* User notification when request is allowed but came with error (REQUEST) */
const setErrorNotification = (data, requestData, requestStatus) => {
    try{
        const identifier = `notification_error_id_${data['source']}_${data['full_date']}_${data['zone']}`;
        if(document.getElementById(identifier) == null){
            const notification = notification_DIV(requestStatus, identifier);
            const notification_id = notification_ID_DIV(`Request from FIRMS error: ${requestData['error']}`, notification);
            const notification_message = notification_MESSAGE_DIV(data['full_date']);
            notification.appendChild(notification_id);
            notification.appendChild(notification_message);
            notificationDiv.appendChild(notification);
        }
    } catch(error) {
        console.error(error);
    }
}

/* User notification when request is not allowed (REQUEST) */
const setDeniedNotification = (data, requestStatus) => {
    try{
        console.log(requestStatus, data)
    } catch (error) {
        console.log(error)
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