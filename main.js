function getuuid() {
  
  fetch("/.netlify/functions/hello")
    .then(response => response.json())
    .then(data => {
      const UUID = data.userId; // Store the userId in a variable called UUID
      console.log("UUID:", UUID); // Log the UUID to the console

      // Save the UUID to localStorage
      localStorage.setItem("uuid", UUID);

      // Update the DOM with the UUID
      document.getElementById("message").innerText = `${UUID}`;
    })
    .catch(error => console.error('Error fetching data:', error));
}

let UUID = localStorage.getItem("uuid");

if (UUID){
  console.log("UUID from local storage is ", UUID);
  document.getElementById("message").innerText = `${UUID}`;
}else{
  console.log("no UUID locally stored")
}