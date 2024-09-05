// Function to fetch UUID and Skyblock data from the backend using the entered username
function fetchUUIDAndData(username) {
  return fetch(`/.netlify/functions/hello?username=${username}`)
    .then(response => response.json())
    .then(data => {
      const UUID = data.userId; // Store the userId in a variable called UUID
      const skyblockData = data.skyblockData; // Store skyblockData
      
      if (!UUID || !skyblockData) {
        console.error('UUID or Skyblock Data is undefined or null:', data); // Log full response for debugging
        alert('Failed to fetch UUID or Skyblock Data.');
        return null;
      }

      // Print the UUID and Skyblock data to the console
      console.log("UUID:", UUID);
      console.log("Skyblock Data:", skyblockData);

      // Store both the UUID and Skyblock data in localStorage
      localStorage.setItem("uuid", UUID);
      localStorage.setItem("username", username);
      localStorage.setItem("skyblockData", JSON.stringify(skyblockData)); // Store skyblockData as a string

      return { UUID, skyblockData };
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return null;
    });
}

// Function to display the data in the DOM
function displayData(UUID, username, skyblockData) {
  // document.getElementById("message").innerText = `UUID: ${UUID}`;
  // document.getElementById("usernameDisplay").innerText = `Username: ${username}`;
  // document.getElementById("skyblockDataDisplay").innerText = `Skyblock Data: ${JSON.stringify(skyblockData, null, 2)}`;
  //TESTING DOCUMENTS
}

// Function to load data from cache or fetch new data
function loadData() {
  const UUID = localStorage.getItem("uuid");
  const cachedUsername = localStorage.getItem("username");
  const cachedSkyblockData = localStorage.getItem("skyblockData");

  if (UUID && cachedUsername && cachedSkyblockData) {
    console.log("Loaded data from cache");
    console.log("UUID:", UUID);
    console.log("Skyblock Data:", JSON.parse(cachedSkyblockData));

    displayData(UUID, cachedUsername, JSON.parse(cachedSkyblockData));
  } else {
    console.log("No data in cache, please enter a username to fetch.");
  }
}

// Event listener for page load to check if data exists in localStorage
document.addEventListener("DOMContentLoaded", function () {
  loadData();
});

// Function to fetch data when a new username is provided
function getuuid() {
  const username = document.getElementById('usernameInput').value;

  if (!username) {
    alert("Please enter a username.");
    return; // Stop the function if the input is empty
  }

  // Fetch new data from the backend
  fetchUUIDAndData(username).then((data) => {
    if (data) {
      displayData(data.UUID, username, data.skyblockData);
    }
  });
}

// Automatically refresh the data every 15 minutes (900000ms)
setInterval(function () {
  const cachedUsername = localStorage.getItem("username");

  if (cachedUsername) {
    console.log("Refreshing data for cached username:", cachedUsername);
    
    fetchUUIDAndData(cachedUsername).then((data) => {
      if (data) {
        displayData(data.UUID, cachedUsername, data.skyblockData);
      }
    });
  } else {
    console.log("No username found in local storage for automatic fetching");
  }
}, 900000); // 15 minutes
