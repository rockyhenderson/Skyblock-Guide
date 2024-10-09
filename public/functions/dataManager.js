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
  //get data
  //put it in
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

      // Log the player data to the console for testing
      console.log("profiles:", data.profiles);

      // Store the wardrobe data for each profile
      data.profiles.forEach((profile) => {
        localStorage.setItem(`wardrobe_${profile.profileId}`, JSON.stringify(profile.wardrobeItems));
      });

      // Update the page with fetched data
      generatePage(data.profiles);
    })
    .catch((error) => console.error("Error fetching data:", error));
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
