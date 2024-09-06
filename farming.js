// Function to calculate farming level from experience
function calculateFarmingLevel(experience) {
  const thresholds = [
    0,50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425, 
    47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425, 
    1722425, 2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425, 
    9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 
    21222425, 23322425, 25522425, 27822425, 30222425, 32722425, 35322425, 
    38072425, 40972425, 44072425, 47472425, 51172425, 55172425, 59472425, 
    64072425, 68972425, 74172425, 79672425, 85472425, 91572425, 97972425, 
    104672425, 111672425
  ];

  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (experience >= thresholds[i]) {
      level = i;
    } else {
      // Calculate fractional progress between this and previous threshold
      const previousThreshold = thresholds[i - 1];
      const nextThreshold = thresholds[i];
      const progress = (experience - previousThreshold) / (nextThreshold - previousThreshold);
      level = (i - 1) + progress;
      break;
    }
  }

  console.log(`Calculated farming level: ${level.toFixed(2)} for experience: ${experience}`);
  return parseFloat(level.toFixed(2)); // Return level rounded to two decimal places
}

// Function to find the farming experience and log the farming level
function findAndLogFarmingLevel() {
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  const uuid = localStorage.getItem("uuid");

  console.log("uuid:", uuid);
  console.log("Cached skyblock data:", cachedSkyblockData);

  if (!cachedSkyblockData || !uuid) {
    console.log("No skyblock data or uuid found.");
    return;
  }

  const skyblockData = JSON.parse(cachedSkyblockData);
  const selectedProfileName = localStorage.getItem("selectedProfile");

  console.log("Selected Profile Name:", selectedProfileName);

  // Find the correct profile based on cute_name
  const profile = skyblockData.profiles.find(p => p.cute_name === selectedProfileName);
  if (!profile) {
    console.log("Profile not found.");
    return;
  }

  console.log("Found profile:", profile);

  // Find the correct player data using the uuid
  const memberData = profile.members[uuid];
  if (!memberData) {
    console.log("Player data not found in profile.");
    return;
  }

  console.log("Found member data:", memberData);

  // Get the farming experience and calculate the farming level
  const farmingExperience = memberData.experience_skill_farming || 0;
  console.log("Farming Experience:", farmingExperience);

  const farmingLevel = calculateFarmingLevel(farmingExperience);

  // Log the farming level
  console.log(`Farming Level: ${farmingLevel}`);

  // Update the farming-level div with the new level
  const farmingLevelElement = document.getElementById("farming-level");
  if (farmingLevelElement) {
    farmingLevelElement.textContent = `Farming Level: ${farmingLevel}`;
  }

  return farmingLevel; // Returning the farming level for progress bar
}

// Function to handle the farming level update when profile changes
function handleProfileChange() {
  // Find the farming level and set it for the progress bar
  const farmingLevel = findAndLogFarmingLevel();

  // Assume the max level is 50 to calculate the progress
  let x = farmingLevel ? farmingLevel / 50 : 0.5; // Default to 0.5 if no farming level
  console.log("Progress bar level (x):", x);

  // Progress bar setup
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

  bar.animate(x); // Number from 0.0 to 1.0 based on the farming level
}

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  generateProfileDropdown(); // Initialize the dropdown

  // Trigger farming level calculation and progress bar update initially
  handleProfileChange();

  // Add event listener to trigger when the profile is changed
  document.getElementById("profileDropdown").addEventListener("change", function () {
    handleProfileChange(); // Update the farming level and progress bar when profile changes
  });
});
