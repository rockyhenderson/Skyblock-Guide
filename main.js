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

// Run the UUID fetch function on page load if data is available in local storage
document.addEventListener("DOMContentLoaded", function () {
  let UUID = localStorage.getItem("uuid");
  let cachedUsername = localStorage.getItem("username");

  console.log("UUID from local storage:", UUID);
  console.log("Cached Username from local storage:", cachedUsername);

  if (UUID && cachedUsername) {
    console.log("Both UUID and cachedUsername found in local storage");
    document.getElementById("message").innerText = `${UUID}`;
    document.getElementById("usernameDisplay").innerText = `${cachedUsername}`;
  } else {
    console.log("No UUID or username locally stored");
  }
});

// Automatically fetch UUID every 10 seconds (for testing purposes)
setInterval(function () {
  let cachedUsername = localStorage.getItem("username");

  if (cachedUsername) {
    console.log("Fetching UUID for stored username:", cachedUsername);
    fetch(`/.netlify/functions/hello?username=${cachedUsername}`)
      .then(response => response.json())
      .then(data => {
        const UUID = data.userId; // Store the userId in a variable called UUID
        console.log("Fetched UUID:", UUID); // Log the UUID to the console

        // Save the new UUID to localStorage
        localStorage.setItem("uuid", UUID);

        // Update the DOM with the UUID
        document.getElementById("message").innerText = `${UUID}`;
      })
      .catch(error => console.error('Error fetching data:', error));
  } else {
    console.log("No username found in local storage for automatic fetching");
  }
}, 10000); // 10 seconds for testing
