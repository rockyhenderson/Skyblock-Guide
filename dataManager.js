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
      const selectedProfile = localStorage.getItem("selectedProfile");
  
      if (!UUID || !skyblockData) {
        console.log("No local data available, returning null.");
        return null;
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
  
      return profiles.find(profile => profile.cute_name === selectedProfile);
    };
  
    return {
      fetchUUIDAndData,
      loadData,
      getSelectedProfileData,
    };
  })();
  