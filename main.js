function getuuid() {
  fetch("/.netlify/functions/hello")
    .then(response => response.json())
    .then(data => {
      const UUID = data.userId; // Store the userId in a variable called UUID
      console.log("UUID:", UUID); // Log the UUID to the console
      document.getElementById("message").innerText = `User ID: ${UUID}`; // Update the DOM with the UUID
    })
    .catch(error => console.error('Error fetching data:', error));
}
