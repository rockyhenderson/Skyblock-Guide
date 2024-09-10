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
async function displayFarmingItems() {
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
    // Step 1: Decode the base64 string
    const decodedData = atob(encodedData);

    // Step 2: Decompress the decoded string using gzip
    const byteArray = new Uint8Array(decodedData.split('').map(char => char.charCodeAt(0)));
    const decompressedData = pako.inflate(byteArray, { to: 'string' });

    // Step 3: Parse the decompressed NBT data using nbt.js
    const nbtData = await nbt.parse(decompressedData);

    // Step 4: Log the parsed NBT result
    console.log("Parsed wardrobe contents (NBT):", nbtData);

  } catch (error) {
    console.error("Error decoding, decompressing, or parsing NBT data:", error);
  }
}










// DOMContentLoaded event listener
document.addEventListener("DOMContentLoaded", function () {
  console.log('nbt:', nbt);
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
