function generatePage(profiles) {
  // Username generation
  const storedUsername = localStorage.getItem("playerUsername");
  if (storedUsername) {
    document.getElementById("usernameDisplay").innerText = ` ${storedUsername}`;
  } else {
    document.getElementById("usernameDisplay").innerText = "Unlinked";
  }

  // Profiles dropdown generation
  const dropdown = document.getElementById("profileDropdown");
  dropdown.innerHTML = ""; // Clear existing options

  if (Array.isArray(profiles)) {
    profiles.forEach((profile) => {
      const option = document.createElement("option");
      option.value = profile.profileName;
      option.textContent = profile.profileName;

      const selectedProfileId = localStorage.getItem("selectedProfile");
      if (selectedProfileId === profile.profileId) {
        option.selected = true;
      }

      dropdown.appendChild(option);
    });
  }

  const selectedProfileId = dropdown.value;
  localStorage.setItem("selectedProfile", selectedProfileId);
  console.log("Selected profile ID updated:", selectedProfileId);
  document.getElementById("cuteProfile").innerText = ` ${selectedProfileId}`;

  
  //updated profile when switched
  dropdown.addEventListener("change", function () {
    const selectedProfileId = dropdown.value;
    localStorage.setItem("selectedProfile", selectedProfileId);
    console.log("Selected profile ID updated:", selectedProfileId);
    document.getElementById("cuteProfile").innerText = ` ${selectedProfileId}`;
  });
  const profiles = JSON.parse(localStorage.getItem("profiles"));

  // Iterate over the profiles and find the one matching the cute name
  const selectedProfile = profiles.find(profile => profile.profileName === cuteName);

  if (selectedProfile) {
      // Log the relevant farming skill levels and XP to the console
      console.log("Farming Level:", selectedProfile.farmingSkillLevel);
      console.log("Farming XP:", selectedProfile.farmingXP);
  } else {
      console.error("Profile not found");
  }

}

function fetchData(username) {
  const url = `/api/DataRequest?username=${username}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Store the received data locally
      localStorage.setItem("playerUsername", username);
      localStorage.setItem("playerLevel", data.playerLevel);
      localStorage.setItem("playerUUID", data.playerUUID);
      localStorage.setItem("profiles", JSON.stringify(data.profiles));

      // Log the player data to the console for testing
      console.log("profiles:", data.profiles);

      // Update the page with fetched data
      generatePage(data.profiles);
    })
    .catch((error) => console.error("Error fetching data:", error));
}

document.addEventListener("DOMContentLoaded", function () {
  console.log("running");

  const storedUsername = localStorage.getItem("playerUsername");
  const storedProfilesJson = localStorage.getItem("profiles");

  // Check if necessary data is available
  if (storedUsername && storedProfilesJson) {
    console.log("Using Locally stored data.");
    const storedProfiles = JSON.parse(storedProfilesJson); // Parse JSON string into an object
    generatePage(storedProfiles); // Load the page with stored profiles
  } else {
    // Prompt for username if data is missing
    const username = prompt("Please enter your username:");
    if (username) {
      fetchData(username);
    } else {
      console.log("No username provided.");
    }
  }
});
