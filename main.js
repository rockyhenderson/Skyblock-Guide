// loadData.js

// Function to display the data in the DOM
function displayData(UUID, username, skyblockData) {
  document.getElementById("usernameDisplay").innerText = `${username}`;
  // Other DOM elements can be updated here as needed
  // document.getElementById("skyblockDataDisplay").innerText = `Skyblock Data: ${JSON.stringify(skyblockData, null, 2)}`;
}

// Function to load data from cache or prompt the user to enter a username
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
