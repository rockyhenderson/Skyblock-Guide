function getuuid() {
  fetch("/.netlify/functions/hello")
    .then(response => response.json())
    .then(data => {
      const apiResponse = data.apiResponse; // Store API response in a variable
      console.log("API Response:", apiResponse); // Log the API response to the console
      document.getElementById("message").innerText = apiResponse.message; // Update the DOM with the response message
    })
    .catch(error => console.error('Error fetching data:', error));
}
