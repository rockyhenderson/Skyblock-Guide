exports.handler = async function(event, context) {
  try {
    // Parse the incoming request body to get the username
    const { username } = JSON.parse(event.body);

    if (!username) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Username is required'
        })
      };
    }

    // Make the API call to Mojang using the received username
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`);
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ 
          message: `Failed to fetch data for username: ${username}`
        })
      };
    }

    const apiData = await response.json(); // Parse the response as JSON

    // Extract only the "id" from the API response
    const { id } = apiData;

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        userId: id  // Return only the user ID
      })
    };
  } catch (error) {
    console.error('Error making request to Mojang API:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: 'Error fetching data from Mojang API'
      })
    };
  }
};
