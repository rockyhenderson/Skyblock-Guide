document.addEventListener("DOMContentLoaded", function () {
  let previousSkyblockData = localStorage.getItem("skyblockData");

  // Function to generate the dynamic menu
  function generateProfileMenu() {
    const cachedSkyblockData = localStorage.getItem("skyblockData");
    if (cachedSkyblockData) {
      const skyblockData = JSON.parse(cachedSkyblockData);
      console.log(skyblockData); // Output: defaultProfile

      // Check if the profiles data exists
      if (skyblockData.profiles) {
        // Extract the cute_name and profile_id from each profile
        const profilesList = skyblockData.profiles.map(profile => ({
          cuteName: profile.cute_name,
          profileId: profile.profile_id
        }));

        // Get the container where you want to dynamically create the menu
        const menuContainer = document.getElementById('profilesMenu');

        // Clear the menu container if needed
        menuContainer.innerHTML = '';

        // Dynamically generate menu based on profiles
        profilesList.forEach(profile => {
          // Create a new button for each profile
          const menuItem = document.createElement('button');
          menuItem.textContent = profile.cuteName; // Set button text to the cute name

          // Optionally store the profile ID in a data attribute for later use
          menuItem.setAttribute('data-profile-id', profile.profileId);

          // Optionally add a click event to handle profile selection
          menuItem.addEventListener('click', function () {
            const profileId = this.getAttribute('data-profile-id');
            console.log("Selected Profile ID:", profileId);
            // You can add additional functionality here based on the selected profile
          });

          // Append the menu item to the container
          menuContainer.appendChild(menuItem);
        });
      }
    } else {
      console.log("No skyblock data found in local storage.");
    }
  }

  // Call the function initially
  generateProfileMenu();

  // Progress bar logic
  let x = 0.5;
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

  bar.animate(x); // Number from 0.0 to 1.0

  // Poll for changes in localStorage every second
  setInterval(function () {
    const currentSkyblockData = localStorage.getItem("skyblockData");
    if (currentSkyblockData !== previousSkyblockData) {
      previousSkyblockData = currentSkyblockData;
      generateProfileMenu(); // Refresh the profile menu when data changes
    }
  }, 1000); // Check every 1 second
});
