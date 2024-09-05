function getuuid() {
  const username = document.getElementById('usernameInput').value;

  if (!username) {
    alert("Please enter a username.");
    return; // Stop the function if the input is empty
  }

  fetch(`/.netlify/functions/hello?username=${username}`)
    .then(response => response.json())
    .then(data => {
      const UUID = data.userId; // Store the userId in a variable called UUID
      console.log("UUID:", UUID); // Log the UUID to the console

      // Save the UUID and the username to localStorage
      localStorage.setItem("uuid", UUID);
      localStorage.setItem("username", username); // Save the username too

      // Update the DOM with the UUID and username
      document.getElementById("message").innerText = `${UUID}`;
      document.getElementById("usernameDisplay").innerText = `${username}`;
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Check for cached UUID and username when the page loads
let UUID = localStorage.getItem("uuid");
let cachedUsername = localStorage.getItem("username");

if (UUID && cachedUsername) {
  console.log("UUID from local storage is ", UUID);
  document.getElementById("message").innerText = `${UUID}`;
  document.getElementById("usernameDisplay").innerText = `${cachedUsername}`;
} else {
  console.log("No UUID or username locally stored");
}
