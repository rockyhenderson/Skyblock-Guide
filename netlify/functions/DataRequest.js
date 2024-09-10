const dotenv = require("dotenv");
const Hypixel = require("hypixel-api-reborn");

dotenv.config();

exports.handler = async function (event, context) {
  const username = event.queryStringParameters.username;

  // Step 1: Validate the username
  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "Username is required" }),
    };
  }

  // Step 2: Fetch the Hypixel API key from the environment variable
  const apiKey = process.env.HYPIXEL_API_KEY;

  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "API key is missing" }),
    };
  }

  try {
    const hypixel = new Hypixel.Client(apiKey);

    // Step 3: Fetch player data
    const player = await hypixel.getPlayer(username);

    // Step 4: Return player level and uuid to frontend
    return {
      statusCode: 200,
      body: JSON.stringify({
        playerLevel: player.level, // Hypixel level
        playerUUID: player.uuid,
        playerFarmingSkill: player.skills.farming.xp,
      }),
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
