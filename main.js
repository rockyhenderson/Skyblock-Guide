// Function to fetch UUID and Skyblock data from the backend using the entered username
function getuuid() {
  const username = document.getElementById('usernameInput').value;

  if (!username) {
    alert("Please enter a username.");
    return; // Stop the function if the input is empty
  }

  // Fetch the UUID and Skyblock data using the backend function
  fetch(`/.netlify/functions/hello?username=${username}`)
    .then(response => response.json())
    .then(data => {
      const UUID = data.userId; // Store the userId in a variable called UUID
      const skyblockData = data.skyblockData; // Store skyblockData
      
      console.log("UUID:", UUID); // Log the UUID to the console
      console.log("Skyblock Data:", skyblockData); // Log the skyblock data to the console

      if (!UUID || !skyblockData) {
        console.error('UUID or Skyblock Data is undefined or null:', data); // Log full response for debugging
        alert('Failed to fetch UUID or Skyblock Data.');
        return;
      }

      // Save the UUID and the username to localStorage
      localStorage.setItem("uuid", UUID);
      localStorage.setItem("username", username); // Save the username too

      // Update the DOM with the UUID, username, and Skyblock data
      document.getElementById("message").innerText = `UUID: ${UUID}`;
      document.getElementById("usernameDisplay").innerText = `Username: ${username}`;
      document.getElementById("skyblockDataDisplay").innerText = `Skyblock Data: ${JSON.stringify(skyblockData, null, 2)}`;
    })
    .catch(error => console.error('Error fetching data:', error));
}

// Run the UUID fetch function on page load if data is available in local storage
document.addEventListener("DOMContentLoaded", function () {
  let UUID = localStorage.getItem("uuid");
  let cachedUsername = localStorage.getItem("username");

  console.log("UUID from local storage:", UUID);
  console.log("Cached Username from local storage:", cachedUsername);

  if (UUID && cachedUsername) {
    console.log("Both UUID and cachedUsername found in local storage");
    document.getElementById("message").innerText = `UUID: ${UUID}`;
    document.getElementById("usernameDisplay").innerText = `Username: ${cachedUsername}`;
    // Optionally fetch and display Skyblock data again based on cached UUID
  } else {
    console.log("No UUID or username locally stored");
  }
});

// Automatically fetch UUID and Skyblock data every 10 seconds (for testing purposes)
setInterval(function () {
  let cachedUsername = localStorage.getItem("username");

  if (cachedUsername) {
    console.log("Fetching UUID for stored username:", cachedUsername);
    fetch(`/.netlify/functions/hello?username=${cachedUsername}`)
      .then(response => response.json())
      .then(data => {
        const UUID = data.userId; // Store the userId in a variable called UUID
        const skyblockData = data.skyblockData; // Store the Skyblock data

        console.log("Fetched UUID:", UUID); // Log the UUID to the console
        console.log("Fetched Skyblock Data:", skyblockData); // Log the Skyblock data

        if (!UUID || !skyblockData) {
          console.error('UUID or Skyblock Data is undefined or null:', data); // Log full response for debugging
          return;
        }

        // Save the new UUID to localStorage
        localStorage.setItem("uuid", UUID);

        // Update the DOM with the UUID and Skyblock data
        document.getElementById("message").innerText = `UUID: ${UUID}`;
        document.getElementById("skyblockDataDisplay").innerText = `Skyblock Data: ${JSON.stringify(skyblockData, null, 2)}`;
      })
      .catch(error => console.error('Error fetching data:', error));
  } else {
    console.log("No username found in local storage for automatic fetching");
  }
}, 900000); // 10 seconds for testing
