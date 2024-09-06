// Function to generate the profile dropdown and handle profile change

//Handle Profile Change Events Across Pages



function generateProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  const { skyblockData, selectedProfile } = dataManager.loadData();
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

// Function to update the farming level and other dynamic data
function updatePageData() {
  const selectedProfileData = dataManager.getSelectedProfileData();
  
  if (selectedProfileData) {
    // Example of updating farming level
    const farmingLevel = selectedProfileData?.farming?.level || "N/A"; // Ensure this path matches your data structure
    document.getElementById("farmingLevelDisplay").innerText = `Farming Level: ${farmingLevel}`;

    // Add more updates for other stats, e.g. mining level, combat level, etc.
    // const miningLevel = selectedProfileData?.mining?.level || "N/A";
    // document.getElementById("miningLevelDisplay").innerText = `Mining Level: ${miningLevel}`;
  } else {
    console.error("No profile data available for the selected profile.");
  }
}

// Initialize the page
document.addEventListener("DOMContentLoaded", function () {
  generateProfileDropdown();
  updatePageData(); // Initial load of the page data
});
