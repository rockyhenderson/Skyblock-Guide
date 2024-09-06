// Function to fetch UUID and Skyblock data from the backend using the entered username
function fetchUUIDAndData(username) {
  return fetch(`/.netlify/functions/hello?username=${username}`)
    .then(response => response.json())
    .then(data => {
      const UUID = data.userId; // Store the userId in a variable called UUID
      const skyblockData = data.skyblockData; // Store skyblockData
      
      if (!UUID || !skyblockData || !skyblockData.profiles) {
        console.error('UUID or Skyblock Data is undefined or null:', data); // Log full response for debugging
        alert('Failed to fetch UUID or Skyblock Data.');
        return null;
      }

      // Print the UUID and Skyblock data to the console
      console.log("UUID:", UUID);
      console.log("Skyblock Data:", skyblockData);

      // Store the UUID and username in localStorage (general info)
      localStorage.setItem("uuid", UUID);
      localStorage.setItem("username", username);

      // Iterate over profiles and store each profile individually in localStorage
      skyblockData.profiles.forEach(profile => {
        const cuteName = profile.cute_name;
        const profileData = {
          UUID: UUID,
          profile_id: profile.profile_id,
          created_at: profile.created_at,
          cute_name: cuteName,
          members: profile.members,
          game_mode: profile.game_mode,
          community_upgrades: profile.community_upgrades
        };

        // Store the profile data under the cute name in localStorage
        localStorage.setItem(cuteName, JSON.stringify(profileData));
      });

      // After storing all profiles, update the dropdown
      generateProfileDropdown();

      return { UUID, skyblockData };
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      return null;
    });
}

// Function to display the data in the DOM for a specific profile
function displayData(UUID, profileData) {
  document.getElementById("usernameDisplay").innerText = `UUID: ${UUID}`;
  document.getElementById("profileDataDisplay").innerText = `Profile: ${profileData.cute_name} - Game Mode: ${profileData.game_mode}`;
}

// Function to generate a dropdown dynamically based on stored profiles
function generateProfileDropdown() {
  const dropdown = document.getElementById('profileDropdown');
  dropdown.innerHTML = ''; // Clear previous options

  // Add a default option
  const defaultOption = document.createElement('option');
  defaultOption.text = 'Select a Profile';
  dropdown.add(defaultOption);

  // Iterate over localStorage and add profiles to the dropdown
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    
    if (key !== 'uuid' && key !== 'username' && localStorage.getItem(key)) {
      const profileData = JSON.parse(localStorage.getItem(key));

      // Create an option for each profile
      const option = document.createElement('option');
      option.value = key;
      option.text = profileData.cute_name;
      dropdown.add(option);
    }
  }
}

// Function to load data for a selected profile from the dropdown
function loadSelectedProfile() {
  const selectedProfile = document.getElementById('profileDropdown').value;
  if (selectedProfile) {
    const profileData = JSON.parse(localStorage.getItem(selectedProfile));
    if (profileData) {
      const UUID = localStorage.getItem("uuid"); // Assuming the UUID is the same for all profiles
      displayData(UUID, profileData);
    }
  }
}

// Function to load data from cache or fetch new data
function loadData() {
  const UUID = localStorage.getItem("uuid");
  const cachedUsername = localStorage.getItem("username");

  if (UUID && cachedUsername) {
    console.log("Loaded data from cache");
    generateProfileDropdown(); // Update the dropdown with existing profiles
  } else {
    console.log("No data in cache, please enter a username to fetch.");
  }
}

// Event listener for page load to check if data exists in localStorage
document.addEventListener("DOMContentLoaded", function () {
  loadData();
});

// Event listener for profile selection from the dropdown
document.getElementById('profileDropdown').addEventListener('change', loadSelectedProfile);

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
      // Use the UUID and Skyblock data
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
        // Use the UUID and Skyblock data
      }
    });
  } else {
    console.log("No username found in local storage for automatic fetching");
  }
}, 900000); // 15 minutes
