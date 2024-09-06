// Function to generate the profile dropdown and handle profile change
function generateProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  const { skyblockData, selectedProfile, username } = dataManager.loadData() || {}; // Now includes username

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

  // Set dropdown to the selected profile
  if (selectedProfile) {
    dropdown.value = selectedProfile;
  }

  // Add event listener to store the selected profile and update the page
  dropdown.addEventListener("change", function() {
    const selectedProfile = dropdown.value;
    localStorage.setItem("selectedProfile", selectedProfile);
    document.getElementById("cuteProfile").innerText = `${selectedProfile}`; 
    updatePageData();
  });
}

// Function to update the page based on the selected profile
function updatePageData() {
  const selectedProfileData = dataManager.getSelectedProfileData();

  if (!selectedProfileData) {
    console.log("No profile data found. Attempting to fetch new data...");
    return;
  }

  console.log("Profile data is available, updating the page...");
  // Add your logic for updating the page with profile data here.
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  generateProfileDropdown();
  updatePageData();
});
