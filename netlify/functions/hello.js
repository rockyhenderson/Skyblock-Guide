const fetch = require('node-fetch');
const dotenv = require('dotenv');

// Load environment variables from the .env file
dotenv.config();

exports.handler = async function(event, context) {
  const username = event.queryStringParameters.username;
  
  // Step 1: Validate the username
  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Username is required' }),
    };
  }

  // Step 2: Fetch the Hypixel API key from the environment variable
  const apiKey = process.env.HYPIXEL_API_KEY;
  
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'API key is missing' }),
    };
  }

  try {
    // Step 3: Fetch UUID from Mojang API
    const mojangResponse = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    
    if (!mojangResponse.ok) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: `Failed to find UUID for username: ${username}` }),
      };
    }

    const mojangData = await mojangResponse.json();
    const playerUUID = mojangData.id;

    // Step 4: Fetch Skyblock profile data from Hypixel API using the API key
    const hypixelResponse = await fetch(`https://api.hypixel.net/skyblock/profiles?key=${apiKey}&uuid=${playerUUID}`);
    
    if (!hypixelResponse.ok) {
      return {
        statusCode: 502,
        body: JSON.stringify({ message: 'Failed to fetch Skyblock data from Hypixel API' }),
      };
    }

    const hypixelData = await hypixelResponse.json();

    // Step 5: Return both UUID and Skyblock data to the frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        playerUUID,
        skyblockData: hypixelData,
      }),
    };

  } catch (error) {
    // Step 6: Catch any errors during the process and return a 500 status code
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
