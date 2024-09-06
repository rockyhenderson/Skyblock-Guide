// Function to calculate farming level from experience
function calculateFarmingLevel(experience) {
  const thresholds = [
    0, 50, 125, 200, 300, 500, 750, 1000, 1500, 2000, 3500, 5000, 7500, 10000, 15000, 
    20000, 30000, 50000, 75000, 100000, 200000, 300000, 400000, 500000, 600000, 
    700000, 800000, 900000, 1000000, 1100000, 1200000, 1300000, 1400000, 1500000, 
    1600000, 1700000, 1800000, 1900000, 2000000, 2100000, 2200000, 2300000, 
    2400000, 2500000, 2600000, 2750000, 2900000, 3100000, 3400000, 3700000, 
    4000000, 4300000, 4600000, 4900000, 5200000, 5500000, 5800000, 6100000, 
    6400000, 6700000, 7000000
  ];

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

  // Update the farming-level div with the new level
  const farmingLevelElement = document.getElementById("farming-level");
  if (farmingLevelElement) {
    farmingLevelElement.textContent = `Farming Level: ${farmingLevel}`;
  }

  return farmingLevel; // Returning the farming level for progress bar
}

// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  // Read the data from localStorage
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  if (cachedSkyblockData) {
    const skyblockData = JSON.parse(cachedSkyblockData);
    console.log("Skyblock Data:", skyblockData);
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
