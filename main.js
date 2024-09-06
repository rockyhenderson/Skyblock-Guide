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

      // Extract and log the cute names from the profiles
      const profiles = skyblockData.profiles || [];
      const cuteNames = profiles.map(profile => profile.cuteName);
      console.log("Cute Names:", cuteNames);

      // Store both the UUID and Skyblock data in localStorage
      localStorage.setItem("uuid", UUID);
      localStorage.setItem("username", username);
      localStorage.setItem("skyblockData", JSON.stringify(skyblockData)); // Store skyblockData as a string

      // Dynamically generate the profile dropdown
      generateProfileDropdown(cuteNames);

      return { UUID, skyblockData };
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return null;
    });
}

// Function to generate the profile dropdown based on cute names
function generateProfileDropdown(cuteNames) {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.innerHTML = ""; // Clear any existing options

  cuteNames.forEach((cuteName, index) => {
    const option = document.createElement("option");
    option.value = cuteName;
    option.textContent = cuteName;
    dropdown.appendChild(option);
  });

  // Add event listener to store the selected profile in localStorage
  dropdown.addEventListener("change", function() {
    const selectedProfile = dropdown.value;
    localStorage.setItem("selectedProfile", selectedProfile);
    console.log("Selected Profile:", selectedProfile);
  });
}

// Function to display the data in the DOM
function displayData(UUID, username, skyblockData) {
  document.getElementById("usernameDisplay").innerText = `${username}`;
}

// Function to load data from cache or fetch new data
function loadData() {
  const UUID = localStorage.getItem("uuid");
  const cachedUsername = localStorage.getItem("username");
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  const selectedProfile = localStorage.getItem("selectedProfile");

  if (UUID && cachedUsername && cachedSkyblockData) {
    console.log("Loaded data from cache");
    console.log("UUID:", UUID);
    console.log("Skyblock Data:", JSON.parse(cachedSkyblockData));

    const skyblockData = JSON.parse(cachedSkyblockData);
    const profiles = skyblockData.profiles || [];
    const cuteNames = profiles.map(profile => profile.cuteName);
    
    // Generate profile dropdown and pre-select the previously selected profile if it exists
    generateProfileDropdown(cuteNames);

    if (selectedProfile) {
      document.getElementById("profileDropdown").value = selectedProfile;
      console.log("Previously selected profile:", selectedProfile);
    }

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
