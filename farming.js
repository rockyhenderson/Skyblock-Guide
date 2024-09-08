import prismarineNbt from 'https://cdn.jsdelivr.net/npm/prismarine-nbt@2.5.0/+esm';
import pako from 'https://cdn.jsdelivr.net/npm/pako@1.0.10/+esm';
// Function to calculate farming level from experience
function calculateFarmingLevel(experience) {
  const thresholds = [
    0, 50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425,
    32425, 47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425,
    1722425, 2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425,
    9322425, 10722425, 12222425, 13822425, 15522425, 17322425, 19222425,
    21222425, 23322425, 25522425, 27822425, 30222425, 32722425, 35322425,
    38072425, 40972425, 44072425, 47472425, 51172425, 55172425, 59472425,
    64072425, 68972425, 74172425, 79672425, 85472425, 91572425, 97972425,
    104672425, 111672425,
  ];

  let level = 0;
  for (let i = 0; i < thresholds.length; i++) {
    if (experience >= thresholds[i]) {
      level = i;
    } else {
      // Calculate fractional progress between this and previous threshold
      const previousThreshold = thresholds[i - 1];
      const nextThreshold = thresholds[i];
      const progress =
        (experience - previousThreshold) / (nextThreshold - previousThreshold);
      level = i - 1 + progress;
      break;
    }
  }

  console.log(
    `Calculated farming level: ${level.toFixed(
      2
    )} for experience: ${experience}`
  );
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
    return null;
  }

  const skyblockData = JSON.parse(cachedSkyblockData);
  const selectedProfileName = localStorage.getItem("selectedProfile");

  console.log("Selected Profile Name:", selectedProfileName);

  // Find the correct profile based on cute_name
  const profile = skyblockData.profiles.find(
    (p) => p.cute_name === selectedProfileName
  );
  if (!profile) {
    console.log("Profile not found.");
    return null;
  }

  console.log("Found profile:", profile);

  // Find the correct player data using the uuid
  const memberData = profile.members[uuid];
  if (!memberData) {
    console.log("Player data not found in profile.");
    return null;
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
    farmingLevelElement.textContent = `${farmingLevel}`;
  }

  return farmingLevel; // Returning the farming level for progress bar
}

// Function to initialize the appropriate progress bar based on screen size
function initializeProgressBar(progressValue, farmingLevel, maxFarmingLevel, farmingCap) {
  // Adjust farming level based on the farming cap
  const maxLevelWithCap = 50 + farmingCap; // Cap ranges from 51 to 60 depending on perks level
  let adjustedFarmingLevel = farmingLevel;

  if (farmingLevel > maxLevelWithCap) {
    adjustedFarmingLevel = maxLevelWithCap;
    console.log(
      `Farming level capped to ${adjustedFarmingLevel} based on cap of ${farmingCap}.`
    );
  }

  // Calculate the progress based on the adjusted farming level
  let adjustedProgressValue = progressValue;
  if (farmingLevel > maxLevelWithCap) {
    adjustedProgressValue = 1.0; // Full progress if level is capped
  }

  // Destroy any existing progress bar
  if (bar) {
    bar.destroy();
  }

  const container = document.getElementById("progress-bar");
  const circularContainer = document.getElementById("circular-progress-bar");

  // Check if the screen is mobile (less than 768px width)
  if (window.matchMedia("(max-width: 768px)").matches) {
    // Hide linear progress bar
    container.style.display = "none";
    circularContainer.style.display = "block"; // Show circular progress bar

    // Create a circular progress bar for mobile screens
    bar = new ProgressBar.Circle(circularContainer, {
      strokeWidth: 6,
      easing: "easeInOut",
      duration: 1400,
      color: "#FFEA82",
      trailColor: "#eee",
      trailWidth: 1,
      svgStyle: null,
    });
  } else {
    // Hide circular progress bar
    circularContainer.style.display = "none";
    container.style.display = "block"; // Show linear progress bar

    // Create a linear progress bar for larger screens
    bar = new ProgressBar.Line(container, {
      strokeWidth: 4,
      easing: "easeInOut",
      duration: 1400,
      color: "#FFEA82",
      trailColor: "#eee",
      trailWidth: 1,
      svgStyle: { width: "100%", height: "100%" },
      step: function (state, bar) {
        bar.path.setAttribute("stroke-linecap", "round");
      },
    });
  }

  // Animate the progress bar with the adjusted progress value
  bar.animate(adjustedProgressValue);
}


// Function to handle the farming level update when profile changes
let bar = null; // Declare the progress bar variable outside so it can be reused
function handleProfileChange() {
  const selectedProfile = localStorage.getItem("selectedProfile");
  document.getElementById("cuteProfile").innerText = ` ${selectedProfile}`;
  // Find the farming level and set it for the progress bar
  const farmingLevel = findAndLogFarmingLevel();
  console.log("Farming level:", farmingLevel);
  
  displayFarmingMedals()
  displayFarmingItems()
  

  // If the farming level is null or undefined, handle it
  if (farmingLevel === null || farmingLevel === undefined) {
    console.error("Farming level is not valid. Defaulting progress to 0.");
    initializeProgressBar(0); // Set progress to 0 for invalid farming level
    return;
  }

  // Extract only the decimal part of the farming level (ignore the integer part)
  const decimalPart = farmingLevel - Math.floor(farmingLevel);
  console.log("Decimal part extracted:", decimalPart);

  let progressValue = 0;
  if (farmingLevel == 60) {
    progressValue = 1.0; // Max farming level, set progress to 100%
  } else {
    progressValue = decimalPart ? decimalPart : 0; // If there is no decimal part, default to 0
  }

  // Initialize the appropriate progress bar based on screen size
  initializeProgressBar(progressValue);
}

// DO NOT CHANGE THIS
function generateProfileDropdown() {
  const username = localStorage.getItem("username");
  document.getElementById("usernameDisplay").innerText = ` ${username}`;

  const cachedSkyblockData = localStorage.getItem("skyblockData");
  const skyblockData = cachedSkyblockData
    ? JSON.parse(cachedSkyblockData)
    : null;

  if (!skyblockData || !skyblockData.profiles) {
    console.log("No profiles found in cached data.");
    return;
  }

  const profileDropdown = document.getElementById("profileDropdown");
  profileDropdown.innerHTML = ""; // Clear existing options

  skyblockData.profiles.forEach((profile) => {
    const option = document.createElement("option");
    option.value = profile.cute_name;
    option.textContent = profile.cute_name;
    profileDropdown.appendChild(option);
  });

  // Set the selected profile if not already set
  const selectedProfile = localStorage.getItem("selectedProfile");
  if (!selectedProfile) {
    localStorage.setItem("selectedProfile", skyblockData.profiles[0].cute_name);
  }

  // Update the dropdown selection
  profileDropdown.value = selectedProfile || skyblockData.profiles[0].cute_name;
}
function displayFarmingMedals() {
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  const uuid = localStorage.getItem("uuid");
  const selectedProfileName = localStorage.getItem("selectedProfile");

  console.log("Selected Profile Name:", selectedProfileName);
  console.log("UUID:", uuid);

  if (!cachedSkyblockData || !uuid || !selectedProfileName) {
    console.error("Missing data: skyblock data, uuid, or selected profile.");
    return;
  }

  const skyblockData = JSON.parse(cachedSkyblockData);

  // Find the correct profile using the cute_name
  const profile = skyblockData.profiles.find(
    (p) => p.cute_name === selectedProfileName
  );
  if (!profile) {
    console.error("Profile not found.");
    return;
  }

  // Find the correct member data using uuid
  const memberData = profile.members[uuid];
  if (!memberData) {
    console.error("Member data not found in profile.");
    return;
  }

  // Check if unique_brackets exist, otherwise set it to an empty object to handle no medals case
  const uniqueBrackets = memberData.jacob2?.unique_brackets || {};
  const personalBests = memberData.jacob2?.personal_bests || {};

  // List of crops we are interested in
  const crops = [
    "WHEAT",
    "CARROT_ITEM",
    "POTATO_ITEM",
    "PUMPKIN",
    "MELON",
    "MUSHROOM_COLLECTION",
    "CACTUS",
    "SUGAR_CANE",
    "NETHER_STALK",
    "INK_SACK:3", // Represents Cocoa Beans
  ];

  // Medals in order: Bronze, Silver, Gold, Platinum, Diamond
  const medalTypes = ["bronze", "silver", "gold", "platinum", "diamond"];

  // Get the container to display farming medals
  const medalsContainer = document.getElementById("farming-medals-container");
  medalsContainer.innerHTML = ""; // Clear previous content

  // Function to generate medal circles
  function generateMedalCircles(crop, earnedMedals) {
    const medalWrapper = document.createElement("div");
    medalWrapper.className = "medal-wrapper";

    // For each medal type, create a circle and fill it if earned
    medalTypes.forEach((medal) => {
      const circle = document.createElement("div");
      circle.className = "medal-circle";
      // If they have the medal or a higher one, fill the circle, else keep it empty
      if (earnedMedals.includes(medal)) {
        circle.classList.add("medal-earned");
      }
      medalWrapper.appendChild(circle);
    });

    return medalWrapper;
  }

  // Iterate through each crop
  crops.forEach((crop) => {
    const cropDiv = document.createElement("div");
    cropDiv.className = "crop-medal";

    // Add crop name
    const cropName = document.createElement("div");
    cropName.className = "crop-name";
    cropName.textContent = crop;
    cropDiv.appendChild(cropName);

    // Determine which medals the player has for this crop, default to empty if unique_brackets doesn't exist
    const earnedMedals = [];
    if (uniqueBrackets.diamond && uniqueBrackets.diamond.includes(crop)) {
      earnedMedals.push("bronze", "silver", "gold", "platinum", "diamond");
    } else if (uniqueBrackets.platinum && uniqueBrackets.platinum.includes(crop)) {
      earnedMedals.push("bronze", "silver", "gold", "platinum");
    } else if (uniqueBrackets.gold && uniqueBrackets.gold.includes(crop)) {
      earnedMedals.push("bronze", "silver", "gold");
    } else if (uniqueBrackets.silver && uniqueBrackets.silver.includes(crop)) {
      earnedMedals.push("bronze", "silver");
    } else if (uniqueBrackets.bronze && uniqueBrackets.bronze.includes(crop)) {
      earnedMedals.push("bronze");
    }

    // Log message if no medals, and generate empty slots
    if (earnedMedals.length === 0) {
      console.log(`${crop} has no medals, generating empty slots.`);
    } else {
      console.log(`${crop} has ${earnedMedals.join(", ")}`);
    }

    // Format the personal best with commas and "items"
    const personalBest = personalBests[crop]
      ? `${personalBests[crop].toLocaleString()} items`
      : "No data";

    // Set personal best as the title attribute for hover tooltip
    cropDiv.title = `Personal Best: ${personalBest}`; // Tooltip on hover

    // Generate and add the medal circles (empty if no medals)
    const medalCircles = generateMedalCircles(crop, earnedMedals);
    cropDiv.appendChild(medalCircles);

    // Add the crop's div to the container
    medalsContainer.appendChild(cropDiv);
  });

  console.log("Medals display completed.");
}


// Function to display armor from "wardrobe_contents"
function displayFarmingItems() {
  const cachedSkyblockData = localStorage.getItem("skyblockData");
  const uuid = localStorage.getItem("uuid");
  const selectedProfileName = localStorage.getItem("selectedProfile");

  console.log("Selected Profile Name:", selectedProfileName);
  console.log("UUID:", uuid);

  if (!cachedSkyblockData || !uuid || !selectedProfileName) {
    console.error("Missing data: skyblock data, uuid, or selected profile.");
    return;
  }

  const skyblockData = JSON.parse(cachedSkyblockData);

  // Find the correct profile using the cute_name
  const profile = skyblockData.profiles.find(
    (p) => p.cute_name === selectedProfileName
  );
  if (!profile) {
    console.error("Profile not found.");
    return;
  }

  // Find the correct member data using uuid
  const memberData = profile.members[uuid];
  if (!memberData || !memberData.wardrobe_contents || !memberData.wardrobe_contents.data) {
    console.error("Wardrobe contents not found in member data.");
    return;
  }

  // Get the base64 encoded string from "wardrobe_contents.data"
  const encodedData = memberData.wardrobe_contents.data;

  try {
    // Step 1: Decode the base64 string into binary data
    const decodedData = atob(encodedData);

    // Step 2: Convert the decoded string into a Uint8Array
    const byteArray = new Uint8Array(decodedData.split('').map(char => char.charCodeAt(0)));

    // Step 3: Decompress the decoded string using gzip
    const decompressedData = pako.inflate(byteArray);

    // Step 4: Parse the decompressed NBT data using prismarine-nbt
    prismarineNbt.parse(decompressedData, function(error, data) {
      if (error) {
        console.error("Error parsing NBT data:", error);
        return;
      }

      // Log the parsed NBT result
      console.log("Parsed wardrobe contents (NBT):", data);
    });

  } catch (error) {
    console.error("Error decoding, decompressing, or parsing NBT data:", error);
  }
}









// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  generateProfileDropdown(); // Initialize the dropdown

  // Trigger farming level calculation and progress bar update initially
  handleProfileChange();

  // Add event listener to trigger when the profile is changed
  document
    .getElementById("profileDropdown")
    .addEventListener("change", function () {
      const selectedProfile = document.getElementById("profileDropdown").value;
      localStorage.setItem("selectedProfile", selectedProfile);
      handleProfileChange(); // Update the farming level and progress bar when profile changes
    });

  // Add event listener for window resize to switch between progress bar types dynamically
  window.addEventListener("resize", function () {
    handleProfileChange(); // Recalculate and reinitialize the progress bar on resize
  });
});
