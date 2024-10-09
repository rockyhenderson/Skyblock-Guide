function generatePage(profiles) {
  console.log("page generating")
  // Username generation
  const storedUsername = localStorage.getItem("playerUsername");
  if (storedUsername) {
    document.getElementById("usernameDisplay").innerText = ` ${storedUsername}`;
  } else {
    document.getElementById("usernameDisplay").innerText = "Unlinked";
  }
  console.log(selectedProfileId.farmingSkillLevel)
  // Profiles dropdown generation
  const dropdown = document.getElementById("profileDropdown");
  dropdown.innerHTML = ""; // Clear existing options

  let selectedProfileId = localStorage.getItem("selectedProfile");

  if (Array.isArray(profiles)) {
    profiles.forEach((profile, index) => {
      const option = document.createElement("option");
      option.value = profile.profileId;
      option.textContent = profile.profileName;

      // Set the default selected profile if none is found in local storage
      if (!selectedProfileId && index === 0) {
        selectedProfileId = profile.profileId;
      }

      if (selectedProfileId === profile.profileId) {
        option.selected = true;
      }

      dropdown.appendChild(option);
    });
  }

  dropdown.value = selectedProfileId;
  localStorage.setItem("selectedProfile", selectedProfileId);
  updateSelectedProfileData(profiles, selectedProfileId);
  document.getElementById("cuteProfile").innerText = ` ${dropdown.options[dropdown.selectedIndex].text}`;

  // Updated profile when switched
  dropdown.addEventListener("change", function () {
    const selectedProfileId = dropdown.value;
    localStorage.setItem("selectedProfile", selectedProfileId);
    updateSelectedProfileData(profiles, selectedProfileId);
    document.getElementById("cuteProfile").innerText = ` ${dropdown.options[dropdown.selectedIndex].text}`;
  });
}

function updateSelectedProfileData(profiles, selectedProfileId) {
  const selectedProfileData = profiles.find(
    (profile) => profile.profileId === selectedProfileId
  );
  if (selectedProfileData) {
    localStorage.setItem("SelectedProfileData", JSON.stringify(selectedProfileData));
    console.log("Selected Profile Data:", selectedProfileData);
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