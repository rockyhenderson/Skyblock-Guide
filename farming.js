// This function generates the profile dropdown and handles profile changes
function generateProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  const { skyblockData, selectedProfile: defaultProfile, username, UUID } = dataManager.loadData() || {}; // Now includes UUID

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

// Function to find farming level and update the page
function updatePageData() {
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  const UUID = localStorage.getItem("UUID");

  if (!cachedSkyblockData || !UUID) {
    console.log("No skyblock data or UUID found.");
    document.getElementById("cuteProfile").innerText = `None`;
    return;
  }

  const skyblockData = JSON.parse(cachedSkyblockData);
  const selectedProfileName = localStorage.getItem("selectedProfile");

  // Find the correct profile based on cute_name
  const profile = skyblockData.profiles.find(p => p.cute_name === selectedProfileName);
  if (!profile) {
    console.log("Profile not found.");
    return;
  }

  // Find the correct player data using the UUID
  const memberData = profile.members[UUID];
  if (!memberData) {
    console.log("Player data not found in profile.");
    return;
  }

  // Get the farming experience
  const farmingExperience = memberData.experience_skill_farming || 0;
  const farmingLevel = calculateFarmingLevel(farmingExperience);

  // Display the farming level on the page
  document.getElementById("farmingLevelDisplay").innerText = `Farming Level: ${farmingLevel}`;

  // Progress Bar
  let x = farmingLevel / 50; // Assuming max level is 50 for scaling
  var bar = new ProgressBar.Line("#progress-bar", {
    strokeWidth: 4,
    easing: "easeInOut",
    duration: 1400,
    color: "#FFEA82",
    trailColor: "#eee",
    trailWidth: 1,
    svgStyle: { width: "100%", height: "100%" },
    step: function (state, bar) {
      bar.path.setAttribute("stroke-linecap", "round"); // Round the edges of the bar
    },
  });
  bar.animate(x); // Animate the progress bar
}

// Function to calculate farming level from experience
// Function to calculate farming level from experience
function calculateFarmingLevel(experience) {
  // Replace this with the actual experience thresholds for each level
  const thresholds = [
    0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250, 2750, 3300, 3900, 4550, 5250, 6000, 6800,
    7650, 8550, 9500, 10500, 11550, 12650, 13800, 15000, 16250, 17550, 18900, 20300, 21750,
    23250, 24800, 26400, 28050, 29750, 31500, 33300, 35150, 37050, 39000, 41000, 43050, 45150,
    47300, 49500, 51750, 54050, 56400, 58800, 61250
  ]; // Assuming max level is 50

  let level = 0;

  // Iterate through thresholds to find the correct level
  for (let i = 0; i < thresholds.length; i++) {
    if (experience >= thresholds[i]) {
      level = i;
    } else {
      break;
    }
  }

  return level;
}

// This is the combined function that runs on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  // Read the data from localStorage
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  if (cachedSkyblockData) {
    const skyblockData = JSON.parse(cachedSkyblockData);
    console.log(skyblockData); // Output: defaultProfile
  } else {
    console.log("No skyblock data found in local storage.");
  }

  let x = 0.5; // This will be updated based on farming level progress
  var bar = new ProgressBar.Line("#progress-bar", {
    strokeWidth: 4,
    easing: "easeInOut",
    duration: 1400,
    color: "#FFEA82",
    trailColor: "#eee",
    trailWidth: 1,
    svgStyle: { width: "100%", height: "100%" },
    step: function (state, bar) {
      bar.path.setAttribute("stroke-linecap", "round"); // Round the edges of the bar
    },
  });

  // Initially animate the progress bar with x as 0.5
  bar.animate(x); // Number from 0.0 to 1.0

  // Generate the profile dropdown and update the farming level based on selected profile
  generateProfileDropdown();
});

// Function to update page data with farming level based on selected profile
function updatePageData() {
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  const UUID = localStorage.getItem("UUID");

  if (!cachedSkyblockData || !UUID) {
    console.log("No skyblock data or UUID found.");
    document.getElementById("cuteProfile").innerText = `None`;
    return;
  }

  const skyblockData = JSON.parse(cachedSkyblockData);
  const selectedProfileName = localStorage.getItem("selectedProfile");

  // Find the correct profile based on cute_name
  const profile = skyblockData.profiles.find(p => p.cute_name === selectedProfileName);
  if (!profile) {
    console.log("Profile not found.");
    return;
  }

  // Find the correct player data using the UUID
  const memberData = profile.members[UUID];
  if (!memberData) {
    console.log("Player data not found in profile.");
    return;
  }

  // Get the farming experience
  const farmingExperience = memberData.experience_skill_farming || 0;
  const farmingLevel = calculateFarmingLevel(farmingExperience);

  // Display the farming level on the page
  document.getElementById("farmingLevelDisplay").innerText = `Farming Level: ${farmingLevel}`;

  // Update progress bar based on farming level
  let x = farmingLevel / 50; // Assuming max level is 50 for scaling
  var bar = new ProgressBar.Line("#progress-bar", {
    strokeWidth: 4,
    easing: "easeInOut",
    duration: 1400,
    color: "#FFEA82",
    trailColor: "#eee",
    trailWidth: 1,
    svgStyle: { width: "100%", height: "100%" },
    step: function (state, bar) {
      bar.path.setAttribute("stroke-linecap", "round"); // Round the edges of the bar
    },
  });
  
  bar.animate(x); // Animate the progress bar with the current farming level
}

// Function to generate the profile dropdown and handle profile change
function generateProfileDropdown() {
  const dropdown = document.getElementById("profileDropdown");
  const { skyblockData, selectedProfile: defaultProfile, username, UUID } = dataManager.loadData() || {}; // Now includes UUID

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
