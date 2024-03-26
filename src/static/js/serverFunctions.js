async function getLocation(location){
  try{
    const response = await fetch("/activeFires/getLocation", 
      {
        method : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body : JSON.stringify(location)
      });
    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.log("Failed:", error);
  }
}