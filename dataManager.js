function fetchData(username) {
    const url = `/api/dataRequest?username=${username}`;
  
    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        // Step 1: Store the received data locally
        localStorage.setItem("playerLevel", data.playerLevel);
        localStorage.setItem("playerUUID", data.playerUUID);
  
        // Step 2: Log the data to the console for testing
        console.log("Player Level:", data.playerLevel);
        console.log("Player UUID:", data.playerUUID);
      })
      .catch((error) => console.error("Error fetching data:", error));
  }
  
  module.exports = { fetchData };
  