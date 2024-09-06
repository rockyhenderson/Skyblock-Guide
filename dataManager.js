const dataManager = (() => {
    const fetchUUIDAndData = (username) => {
      console.log("Fetching data from the backend for username:", username); // Debugging
      return fetch(`/.netlify/functions/hello?username=${username}`)
        .then(response => response.json())
        .then(data => {
          console.log("Backend response:", data); // Debugging
  
          if (!data || !data.userId || !data.skyblockData) {
            console.error('UUID or Skyblock Data is undefined or null:', data); // Log the error response
            alert('Failed to fetch UUID or Skyblock Data.');
            return null;
          }
  
          // Store data in localStorage
          localStorage.setItem("uuid", data.userId);
          localStorage.setItem("username", username);
          localStorage.setItem("skyblockData", JSON.stringify(data.skyblockData));
  
          // Check if selectedProfile exists, if not set it to the first available profile
          const profiles = data.skyblockData.profiles || [];
          if (!localStorage.getItem("selectedProfile") && profiles.length > 0) {
            const firstProfileName = profiles[0].cute_name;
            console.log("No selected profile found, setting to first profile:", firstProfileName); // Debugging
            localStorage.setItem("selectedProfile", firstProfileName);
          }
  
          return { UUID: data.userId, skyblockData: data.skyblockData };
        })
        .catch(error => {
          console.error('Error fetching data:', error); // Log errors
          alert('An error occurred while fetching data.');
          return null;
        });
    };
  
    const loadData = () => {
      const UUID = localStorage.getItem("uuid");
      const username = localStorage.getItem("username");
      const skyblockData = JSON.parse(localStorage.getItem("skyblockData"));
      let selectedProfile = localStorage.getItem("selectedProfile");
  
      if (!UUID || !skyblockData) {
        console.log("No local data available, returning null.");
        return null;
      }
  
      // If no selected profile is set, set to the first available profile
      const profiles = skyblockData.profiles || [];
      if (!selectedProfile && profiles.length > 0) {
        selectedProfile = profiles[0].cute_name;
        console.log("No selected profile found, setting to first profile:", selectedProfile); // Debugging
        localStorage.setItem("selectedProfile", selectedProfile);
      }
  
      return { UUID, username, skyblockData, selectedProfile };
    };
  
    const getSelectedProfileData = () => {
      const data = loadData();
      if (!data || !data.skyblockData) {
        console.log("No local data found for selected profile.");
        return null;
      }
  
      const profiles = data.skyblockData.profiles || [];
      const selectedProfile = data.selectedProfile;
     
  
      const profileData = profiles.find(profile => profile.cute_name === selectedProfile);

  
      return profileData;
    };
  
    return {
      fetchUUIDAndData,
      loadData,
      getSelectedProfileData,
    };
  })();
  