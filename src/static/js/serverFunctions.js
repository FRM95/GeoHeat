function processData(data){
  data.latitude = parseFloat(data.latitude)
}


async function sendApiKey(api_value){
  try{
    const response = await fetch("/active-fires/checkApikey", 
      {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify(api_value)
      });
    const result = await JSON.parse(response);
    console.log("Success:", result);
  } catch (error) {
    console.log("Failed:", error);
  }
}

export {sendApiKey}