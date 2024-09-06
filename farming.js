// Function to calculate farming level from experience
function calculateFarmingLevel(experience) {
  const thresholds = [0, 50, 150, 300, 500, 750, 1050, 1400, 1800, 2250, 2750, 3300, 3900, 4550, 5250, 6000];
  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (experience >= thresholds[i]) {
      level = i;
    } else {
      break;
    }
  }
  console.log(`Calculated farming level: ${level} for experience: ${experience}`);
  return level;
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

  return farmingLevel; // Returning the farming level for progress bar
}

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  // Read the data from localStorage
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  if (cachedSkyblockData) {
    const skyblockData = JSON.parse(cachedSkyblockData);
    console.log("Skyblock Data:", skyblockData); // Output: defaultProfile
  } else {
    console.log("No skyblock data found in local storage.");
  }

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
});
