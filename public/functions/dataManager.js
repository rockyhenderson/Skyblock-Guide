const thresholds = [
  0, 50, 175, 375, 675, 1175, 1925, 2925, 4425, 6425, 9925, 14925, 22425, 32425,
  47425, 67425, 97425, 147425, 222425, 322425, 522425, 822425, 1222425, 1722425,
  2322425, 3022425, 3822425, 4722425, 5722425, 6822425, 8022425, 9322425,
  10722425, 12222425, 13822425, 15522425, 17322425, 19222425, 21222425,
  23322425, 25522425, 27822425, 30222425, 32722425, 35322425, 38072425,
  40972425, 44072425, 47472425, 51172425, 55172425, 59472425, 64072425,
  68972425, 74172425, 79672425, 85472425, 91572425, 97972425, 104672425,
  111672425,
];
const farmingArmorPriority = [
  "Fermento Helmet",
  "Fermento Chestplate",
  "Fermento Leggings",
  "Rancher's Boots",
  "Fermento Boots",
  "Squash Helmet",
  "Squash Chestplate",
  "Squash Leggings",
  "Squash Boots",
  "Melon Helmet",
  "Melon Chestplate",
  "Melon Leggings",
  "Melon Boots",
  "Cropie Helmet",
  "Cropie Chestplate",
  "Cropie Leggings",
  "Cropie Boots",
  "Farm Armour Helmet",
  "Farm Armour Chestplate",
  "Farm Armour Leggings",
  "Farm Armour Boots",
  "Farm Suit Helmet",
  "Farm Suit Chestplate",
  "Farm Suit Leggings",
  "Farm Suit Boots"
];

let progressChart;

function generatePage(profiles) {
  console.log("page generating");
  // Username generation
  updateUsernameDisplay();
  // Profiles dropdown generation
  generateProfileDropdown(profiles);
  updatePageContent();
}

function updateUsernameDisplay() {
  const storedUsername = localStorage.getItem("playerUsername");
  if (storedUsername) {
    document.getElementById("usernameDisplay").innerText = ` ${storedUsername}`;
  } else {
    document.getElementById("usernameDisplay").innerText = "Unlinked";
  }
}

function generateProfileDropdown(profiles) {
  const dropdown = document.getElementById("profileDropdown");
  dropdown.innerHTML = ""; // Clear existing options

  let selectedProfileId = localStorage.getItem("selectedProfile");

  if (Array.isArray(profiles)) {
    profiles.forEach((profile, index) => {
      const option = document.createElement("option");
      option.value = profile.profileId;
      option.textContent = profile.profileName;

      // Set the default selected profile if none is found in local storage
      if (!selectedProfileId && index === 0) {
        selectedProfileId = profile.profileId;
      }

      if (selectedProfileId === profile.profileId) {
        option.selected = true;
      }

      dropdown.appendChild(option);
    });
  }

  dropdown.value = selectedProfileId;
  localStorage.setItem("selectedProfile", selectedProfileId);

  dropdown.addEventListener("change", function () {
    const selectedProfileId = dropdown.value;
    localStorage.setItem("selectedProfile", selectedProfileId);
    updateSelectedProfileData(profiles, selectedProfileId);
    clearData()
    updatePageContent();
  });
}

function updateSelectedProfileData(profiles, selectedProfileId) {
  const selectedProfileData = profiles.find(
    (profile) => profile.profileId === selectedProfileId
  );
  if (selectedProfileData) {
    localStorage.setItem(
      "SelectedProfileData",
      JSON.stringify(selectedProfileData)
    );
    console.log("Selected Profile Data:", selectedProfileData);
  }
}

function updatePageContent() {
  const selectedProfileData = JSON.parse(
    localStorage.getItem("SelectedProfileData")
  );
  if (selectedProfileData) {
    document.getElementById(
      "cuteProfile"
    ).innerText = ` ${selectedProfileData.profileName}`;
    updateFarmingGraph();
    updateGearWidget();
  }
}

function updateFarmingGraph() {
  const selectedProfileData = JSON.parse(
    localStorage.getItem("SelectedProfileData")
  );
  if (selectedProfileData) {
    const farmingXP = selectedProfileData.farmingXP;
    let farmingLevel = 0;
    let progressToNextLevel = 0;

    // Determine the farming level and progress to the next level
    for (let i = 0; i < thresholds.length - 1; i++) {
      if (farmingXP >= thresholds[i] && farmingXP < thresholds[i + 1]) {
        farmingLevel = i;
        progressToNextLevel =
          ((farmingXP - thresholds[i]) / (thresholds[i + 1] - thresholds[i])) *
          100;
        break;
      }
    }

    // Console log the farming level and XP
    console.log("Farming Skill Level:", farmingLevel);
    console.log("Farming XP:", farmingXP);
    console.log("Progress to Next Level:", progressToNextLevel);

    // Update the progress number and percentage
    document.getElementById("progressNumber").textContent = farmingLevel;
    document.getElementById(
      "progressPercentage"
    ).textContent = `${progressToNextLevel.toFixed(2)}%`;

    const progressChartElement = document.getElementById("progressChart");
    if (progressChartElement) {
      const progressChartContext = progressChartElement.getContext("2d");

      // Destroy existing chart instance if it exists
      if (progressChart) {
        progressChart.destroy();
      }

      // Create new chart instance
      progressChart = new Chart(progressChartContext, {
        type: "doughnut",
        data: {
          labels: ["Progress", "Remaining"],
          datasets: [
            {
              data: [progressToNextLevel, 100 - progressToNextLevel],
              backgroundColor: ["#D5A33A", "#3e3e3e"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          cutout: "70%",
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            tooltip: {
              enabled: false,
            },
          },
        },
      });
    }
  }
}
function updateGearWidget() {
  console.log("update gear widget");
  
  // Get selected profile data from local storage
  const selectedProfileData = JSON.parse(localStorage.getItem("SelectedProfileData"));

  if (selectedProfileData && Array.isArray(selectedProfileData.wardrobe)) {
    const bestArmor = {
      helmet: null,
      chestplate: null,
      leggings: null,
      boots: null
    };

    // Iterate through the farming armor priority list and find the best pieces
    farmingArmorPriority.forEach(armorName => {
      selectedProfileData.wardrobe.forEach(item => {
        // Remove known prefixes (e.g., "Mossy", "Bountiful") to match base armor name if they exist
        const baseName = item.name.replace(/^(Mossy|Bustling|Ancient|Golden|\w+)\s+/i, '').toLowerCase();
        if (baseName.includes(armorName.toLowerCase())) {
          if (armorName.includes("Helmet") && !bestArmor.helmet) {
            bestArmor.helmet = item;
          } else if (armorName.includes("Chestplate") && !bestArmor.chestplate) {
            bestArmor.chestplate = item;
          } else if (armorName.includes("Leggings") && !bestArmor.leggings) {
            bestArmor.leggings = item;
          } else if (armorName.includes("Boots") && !bestArmor.boots) {
            bestArmor.boots = item;
          }
        }
      });
    });

    // Helper function to extract Farming Fortune from item description
    function extractFarmingFortune(description) {
      const farmingFortuneRegex = /\u00a77Farming Fortune: \u00a7a\+(\d+)/;
      const match = description.match(farmingFortuneRegex);
      return match ? parseInt(match[1]) : 0;
    }

    // Helper function to set armor image, rarity class, and extract Farming Fortune
    function updateArmorDOM(elementId, armorPiece) {
      const element = document.getElementById(elementId);
      let farmingFortune = 0;

      if (armorPiece) {
        // Set the image source
        element.src = `src/armour/farming/${armorPiece.name.replace(/^(Mossy|Bountiful|Ancient|Golden|\w+)\s+/i, '').replace(/\s+/g, '').toLowerCase()}.png`;
        
        // Set the class based on rarity
        if (armorPiece.rarity) {
          element.classList.remove("common", "uncommon", "rare", "epic", "legendary", "mythic");
          element.classList.add(armorPiece.rarity.toLowerCase());
        }

        // Extract Farming Fortune from item description
        farmingFortune = extractFarmingFortune(armorPiece.description);
      }

      return farmingFortune;
    }

    // Update the DOM with the best armor images, rarity classes, and extract Farming Fortune
    const helmetFF = updateArmorDOM("helmet", bestArmor.helmet);
    const chestplateFF = updateArmorDOM("chestplate", bestArmor.chestplate);
    const leggingsFF = updateArmorDOM("leggings", bestArmor.leggings);
    const bootsFF = updateArmorDOM("boots", bestArmor.boots);

    // Extract Speed from item description (assuming it's available in one of the armor pieces)
    let speed = 0;
    const speedRegex = /\u00a77Speed: \u00a7a\+(\d+)/;
    [bestArmor.helmet, bestArmor.chestplate, bestArmor.leggings, bestArmor.boots].forEach(armorPiece => {
      if (armorPiece && armorPiece.description) {
        const match = armorPiece.description.match(speedRegex);
        if (match) {
          speed += parseInt(match[1]);
        }
      }
    });

    // Calculate total Farming Fortune
    const totalFF = helmetFF + chestplateFF + leggingsFF + bootsFF;

    // Update the HTML elements with the extracted values
    document.getElementById("totalFF").textContent = totalFF;
    document.getElementById("helmetFF").textContent = helmetFF;
    document.getElementById("chestplateFF").textContent = chestplateFF;
    document.getElementById("leggingsFF").textContent = leggingsFF;
    document.getElementById("bootsFF").textContent = bootsFF;
    document.getElementById("speed").textContent = speed;

    // Console log all extracted values
    console.log("Helmet Farming Fortune:", helmetFF);
    console.log("Chestplate Farming Fortune:", chestplateFF);
    console.log("Leggings Farming Fortune:", leggingsFF);
    console.log("Boots Farming Fortune:", bootsFF);
    console.log("Total Farming Fortune:", totalFF);
    console.log("Total Speed:", speed);
  } else {
    console.log("No wardrobe data found in the selected profile.");
  }
}
function updateFarmingFortuneWidget() {
  console.log("update farming fortune widget");
}
function fetchData(username) { 
  const url = `/api/DataRequest?username=${username}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      // Store the received data locally
      localStorage.setItem("playerUsername", username);
      localStorage.setItem("playerLevel", data.playerLevel);
      localStorage.setItem("playerUUID", data.playerUUID);
      localStorage.setItem("profiles", JSON.stringify(data.profiles));

      // Create a selected profile data object that includes the wardrobe
      const selectedProfile = data.profiles[0]; // Assuming the first profile as selected, or replace as needed
      const selectedProfileData = {
        ...selectedProfile,
        wardrobe: selectedProfile.wardrobeItems, // Add the wardrobe data to the "wardrobe" subsection
      };

      // Store the selected profile data with wardrobe included
      localStorage.setItem("SelectedProfileData", JSON.stringify(selectedProfileData));

      // Log the player data to the console for testing
      console.log("SelectedProfileData:", selectedProfileData);

      // Update the page with fetched data
      generatePage(data.profiles);
    })
    .catch((error) => console.error("Error fetching data:", error));
}
function clearData(){
  document.getElementById("helmet").src = "src/armour/farming/blank.png";
  document.getElementById("chestplate").src = "src/armour/farming/blank.png";
  document.getElementById("leggings").src = "src/armour/farming/blank.png";
  document.getElementById("boots").src = "src/armour/farming/blank.png";
}


document.addEventListener("DOMContentLoaded", function () {
  console.log("running");

  const storedUsername = localStorage.getItem("playerUsername");
  const storedProfilesJson = localStorage.getItem("profiles");
  // Check if necessary data is available
  if (storedUsername && storedProfilesJson) {
    console.log("Using Locally stored data.");
    const storedProfiles = JSON.parse(storedProfilesJson); // Parse JSON string into an object
    generatePage(storedProfiles);
    // Load the page with stored profiles
  } else {
    // Prompt for username if data is missing
    const username = prompt("Please enter your username:");
    if (username) {
      fetchData(username);
    } else {
      console.log("No username provided.");
    }
  }
});
