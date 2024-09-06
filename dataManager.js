//central data management utility
const dataManager = (() => {
  // Function to fetch UUID and Skyblock data from the backend using the entered username
  const fetchUUIDAndData = (username) => {
    return fetch(`/.netlify/functions/hello?username=${username}`)
      .then(response => response.json())
      .then(data => {
        const UUID = data.userId;
        const skyblockData = data.skyblockData;

        if (!UUID || !skyblockData) {
          console.error('UUID or Skyblock Data is undefined or null:', data);
          alert('Failed to fetch UUID or Skyblock Data.');
          return null;
        }

        // Store data in localStorage for cross-page use
        localStorage.setItem("uuid", UUID);
        localStorage.setItem("username", username);
        localStorage.setItem("skyblockData", JSON.stringify(skyblockData));

        return { UUID, skyblockData };
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        return null;
      });
  };

  // Function to load data from localStorage
  const loadData = () => {
    const UUID = localStorage.getItem("uuid");
    const username = localStorage.getItem("username");
    const skyblockData = JSON.parse(localStorage.getItem("skyblockData"));
    const selectedProfile = localStorage.getItem("selectedProfile");

    return { UUID, username, skyblockData, selectedProfile };
  };

  // Function to get the selected profile data
  const getSelectedProfileData = () => {
    const data = loadData();
    const profiles = data.skyblockData.profiles || [];
    const selectedProfile = localStorage.getItem("selectedProfile");

    return profiles.find(profile => profile.cute_name === selectedProfile);
  };

  return {
    fetchUUIDAndData,
    loadData,
    getSelectedProfileData,
  };
})();
