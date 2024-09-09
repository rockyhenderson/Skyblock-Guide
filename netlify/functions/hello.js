const fetch = require('node-fetch');
const dotenv = require('dotenv');
const nbt = require('nbt');
const pako = require('pako');

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

    // Step 5: Extract the wardrobe contents for a given profile (assuming you want the first profile)
    const profile = hypixelData.profiles[0];  // You can customize this as needed
    const memberData = profile.members[playerUUID];

    if (!memberData || !memberData.wardrobe_contents || !memberData.wardrobe_contents.data) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'No wardrobe data found for this user.' }),
      };
    }

    const encodedWardrobeData = memberData.wardrobe_contents.data;

    // Step 6: Decode, decompress, and parse the NBT data
    try {
      const decodedData = Buffer.from(encodedWardrobeData, 'base64');
      const decompressedData = pako.inflate(decodedData);
      
      // Parse the NBT data
      const wardrobeData = await new Promise((resolve, reject) => {
        nbt.parse(decompressedData.buffer, (err, nbtData) => {
          if (err) {
            reject(err);
          } else {
            resolve(nbtData);
          }
        });
      });

      // Step 7: Return both UUID, Skyblock data, and the processed wardrobe data
      return {
        statusCode: 200,
        body: JSON.stringify({
          userId: playerUUID,
          skyblockData: hypixelData,  // Send the entire Skyblock data as before
          wardrobeData: wardrobeData, // Send the processed wardrobe data separately
        }),
      };

    } catch (error) {
      console.error('Error processing wardrobe data:', error);
      return {
        statusCode: 500,
        body: JSON.stringify({ message: 'Failed to process wardrobe data.' }),
      };
    }

  } catch (error) {
    // Step 6: Catch any errors during the process and return a 500 status code
    console.error('Error fetching data:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Internal Server Error' }),
    };
  }
};
