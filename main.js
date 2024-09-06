// Function to generate the profile dropdown and handle profile change
function generateProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  const { skyblockData, selectedProfile } = dataManager.loadData() || {}; // Handle case when loadData returns null

  if (!skyblockData || !skyblockData.profiles) {
    console.log("No skyblock data found, requesting username...");
    document.getElementById("usernameModal").style.display = "block";
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
    localStorage.setItem("selectedProfile", selectedProfile); // Store selected profile in localStorage

    // Call updatePageData to reflect the change
    updatePageData();
  });
}

// Function to update the page based on the selected profile
function updatePageData() {
  const selectedProfileData = dataManager.getSelectedProfileData();

  // If no profile data is available, trigger the API call to fetch data
  if (!selectedProfileData) {
    console.log("No profile data found. Attempting to fetch new data...");
    document.getElementById("usernameModal").style.display = "block"; // Open modal to request username
    return; // Stop further execution since we have no data
  }

  // Additional logic to update the page with selected profile data can go here...
  console.log("Profile data is available and page can be updated.");
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  generateProfileDropdown();
  updatePageData(); // Initial load of the page data
});
