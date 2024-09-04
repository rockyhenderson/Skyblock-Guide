const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors()); // Enable CORS to allow frontend requests

// POST endpoint to handle username and fetch UUID from Mojang API
app.post('/api/username', async (req, res) => {
  const { username } = req.body;

  if (!username) {
    return res.status(400).json({ error: 'Username is required' });
  }

  try {
    // Call the Mojang API to get the UUID based on the username
    const apiUrl = `https://api.mojang.com/users/profiles/minecraft/${username}`;
    const response = await fetch(apiUrl);

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to fetch data from Mojang API' });
    }

    const data = await response.json();
    const userUUID = data.id;

    // Send the UUID back to the frontend
    res.json({ uuid: userUUID });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server on port 3000 (or another port)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
