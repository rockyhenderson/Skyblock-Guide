// Function to generate the profile dropdown and handle profile change
function generateProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  const { skyblockData, selectedProfile: defaultProfile, username } = dataManager.loadData() || {}; // Now includes username

  // Display the logged-in username in the modal
  if (username) {
    document.getElementById("usernameDisplay").innerText = `Logged in as: ${username}`;
  } else {
    document.getElementById("usernameDisplay").innerText = "Unlinked";
  }

  if (!skyblockData || !skyblockData.profiles) {
    console.log("No skyblock data found, requesting username...");
    return; // Stop if no data is available
  }

  const profiles = skyblockData.profiles || [];

  // Populate dropdown with profiles
  dropdown.innerHTML = "";
  profiles.forEach(profile => {
    const option = document.createElement("option");
    option.value = profile.cute_name;
    option.textContent = profile.cute_name;
    dropdown.appendChild(option);
  });

  // Check if a selected profile is in local storage or default profile
  const storedProfile = localStorage.getItem("selectedProfile");
  if (storedProfile) {
    dropdown.value = storedProfile;
  } else if (defaultProfile) {
    dropdown.value = defaultProfile;
  } else if (profiles.length > 0) {
    dropdown.value = profiles[0].cute_name; // Set to the first profile if no selection exists
  }

  // Update the profile display and page data when a profile is selected
  const selectedProfile = dropdown.value;
  document.getElementById("cuteProfile").innerText = ` ${selectedProfile}`;
  localStorage.setItem("selectedProfile", selectedProfile);
  updatePageData();

  // Add event listener to store the selected profile and update the page
  dropdown.addEventListener("change", function () {
    const selectedProfile = dropdown.value;
    localStorage.setItem("selectedProfile", selectedProfile);
    document.getElementById("cuteProfile").innerText = ` ${selectedProfile}`;
    updatePageData();
  });
}

// Function to update the page based on the selected profile
function updatePageData() {
  const selectedProfile = localStorage.getItem("selectedProfile");
  const selectedProfileData = dataManager.getSelectedProfileData(selectedProfile);

  if (!selectedProfileData) {
    console.log("No profile data found. Attempting to fetch new data...");
    document.getElementById("cuteProfile").innerText = `None`;
    return;
  }
  console.log("Profile data is available, updating the page...");
  // Add logic to update other page elements based on selectedProfileData
}

// Ensure page updates correctly when navigating back
window.addEventListener('pageshow', function(event) {
  generateProfileDropdown();
});

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  generateProfileDropdown();
});
