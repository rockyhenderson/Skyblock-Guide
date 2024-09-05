const fetch = require('node-fetch'); // Import node-fetch for making API requests

exports.handler = async function(event, context) {
  try {
    const response = await fetch('https://api.mojang.com/users/profiles/minecraft/hatnehyt?'); // Make a request to the test API
    const apiData = await response.json(); // Parse the response as JSON

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        apiResponse: apiData // Return the API response to the front-end
      })
    };
  } catch (error) {
    console.error('Error making request to testapi:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching data from testapi'
      })
    };
  }
};
