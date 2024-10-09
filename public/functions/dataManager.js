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
    localStorage.setItem("SelectedProfileData", JSON.stringify(selectedProfileData));
    console.log("Selected Profile Data:", selectedProfileData);
  }
}

function updatePageContent() {
  const selectedProfileData = JSON.parse(localStorage.getItem("SelectedProfileData"));
  if (selectedProfileData) {
    document.getElementById("cuteProfile").innerText = ` ${selectedProfileData.profileName}`;
    updateFarmingGraph();
  }
}

function updateFarmingGraph() {
  const selectedProfileData = JSON.parse(localStorage.getItem("SelectedProfileData"));
  if (selectedProfileData) {
    const farmingLevel = selectedProfileData.farmingSkillLevel;
    const farmingXP = selectedProfileData.farmingXP;

    // Console log the farming level and XP
    console.log("Farming Skill Level:", farmingLevel);
    console.log("Farming XP:", farmingXP);

    // Update the progress number and percentage
    document.getElementById("progressNumber").textContent = farmingLevel;
    document.getElementById("progressPercentage").textContent = `${farmingXP}%`;

    const progressChartElement = document.getElementById("progressChart");
    if (progressChartElement) {
      const progressChartContext = progressChartElement.getContext("2d");
      const progressChart = new Chart(progressChartContext, {
        type: "doughnut",
        data: {
          labels: ["Progress", "Remaining"],
          datasets: [
            {
              data: [99, 1], // THESE NEED TO EQUAL 100!
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