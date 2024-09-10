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
    console.log("Skyblock Data:", hypixelData);  // Log the entire Skyblock data

    // Step 5: Loop through all profiles to extract wardrobe contents
    const wardrobeDataByProfile = {};

    for (const profile of hypixelData.profiles) {
      const memberData = profile.members[playerUUID];

      if (memberData && memberData.wardrobe_contents && memberData.wardrobe_contents.data) {
        const encodedWardrobeData = memberData.wardrobe_contents.data;
        
        // Log the raw encoded wardrobe data for debugging
        console.log("Encoded wardrobe data:", encodedWardrobeData);

        // Step 6: Decode, decompress, and parse the NBT data for each profile
        try {
          const decodedData = Buffer.from(encodedWardrobeData, 'base64');
          
          // Log the decoded data before decompression
          console.log("Decoded wardrobe data:", decodedData);

          const decompressedData = pako.inflate(decodedData);
          
          // Log the decompressed data before parsing
          console.log("Decompressed wardrobe data:", decompressedData);

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

          // Log the parsed NBT wardrobe data
          console.log("Parsed wardrobe data:", wardrobeData);

          // Store the parsed wardrobe data for this profile
          wardrobeDataByProfile[profile.profile_id] = wardrobeData;

        } catch (error) {
          console.error(`Error processing wardrobe data for profile ${profile.profile_id}:`, error);
        }
      } else {
        wardrobeDataByProfile[profile.profile_id] = 'No wardrobe data found for this profile.';
      }
    }

    // Step 7: Return UUID, Skyblock data, and the wardrobe data for all profiles
    return {
      statusCode: 200,
      body: JSON.stringify({
        userId: playerUUID,
        skyblockData: hypixelData,  // Send the entire Skyblock data as before
        wardrobeDataByProfile: wardrobeDataByProfile, // Send the wardrobe data for all profiles
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
