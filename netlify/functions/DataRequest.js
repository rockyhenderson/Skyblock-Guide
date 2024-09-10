// //add function to request data from api

// //data i need is
// Farming{
//     -Garden Level
//     -Farming Skill Level
//     -ItemBytes
//     -wardrobe data
//     -Jacob Medals
//     -Jacbob perks
//     -crop milestone

// }

//recive data from the backend and store releveant stuff locally
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

    hypixel
      .getPlayer(username)
      .then((player) => {
        console.log(player.level); // 141
        console.log(player.uuid);
        process.exit(0);
      })
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  } catch (error) {
    // Step 6: Catch any errors during the process and return a 500 status code
    console.error("Error fetching data:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal Server Error" }),
    };
  }
};
