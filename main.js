// Function to send username to the backend and fetch the UUID
function getUUID(username) {
  fetch("/.netlify/functions/hello", {
    method: "POST", // Use POST to send data
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username: username }) // Send username to the backend
  })
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

// Function to check if input is valid and enable the button
function checkInput() {
  const input = document.getElementById("usernameInput").value;
  console.log(input);
  const button = document.getElementById("submitButton"); // Assume the button has this ID
  if (input.trim() !== "") {
    button.disabled = false;
  } else {
    button.disabled = true;
  }
}

// Check if there's a UUID already in localStorage
let UUID = localStorage.getItem("uuid");

if (UUID) {
  console.log("UUID from local storage is ", UUID);
  document.getElementById("message").innerText = `${UUID}`;
} else {
  console.log("No UUID locally stored");
}

// Function to handle form submission
function handleSubmit() {
  const username = document.getElementById("usernameInput").value;
  if (username.trim() !== "") {
    getUUID(username); // Fetch the UUID by sending the username to the backend
  } else {
    console.error("Username input is empty");
  }
}

// Attach the `handleSubmit` function to the button click event
document.getElementById("submitButton").addEventListener("click", handleSubmit);
