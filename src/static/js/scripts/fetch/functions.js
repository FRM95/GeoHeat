/* Update user data in mongodb */
export async function updateUserData(userkey, params, objectBody){
    try {
        let urlParams = "";
        urlParams += '?' + (new URLSearchParams(params)).toString();
        const url = `/updateUserData/${userkey}/` + urlParams;
        const response = await fetch(url, {
            method: 'PUT',
            body: JSON.stringify(objectBody),
            headers: {
              'Content-Type': 'application/json',
                }
            });
        return await response.text();
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}

/* Add new user data in mongodb */
export async function addUserData(userkey, params, objectBody){
    try {
        let urlParams = "";
        urlParams += '?' + (new URLSearchParams(params)).toString();
        const url = `/addUserData/${userkey}/` + urlParams;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(objectBody),
            headers: {
              'Content-Type': 'application/json',
                }
            });
        return await response.text();
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}

/* Get heat spot data in FIRMS */
export async function getFirmsData(userkey, params){
    try {
        let urlParams = "";
        urlParams += '?' + (new URLSearchParams(params)).toString();
        const url = `/getFirmsData/${userkey}/` + urlParams;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
                }
            });
        return await response.json();
    } catch (error) {
        console.error(error) // flash message of fetch error
    }
}