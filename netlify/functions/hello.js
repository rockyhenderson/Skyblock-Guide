exports.handler = async function(event, context) {
  const username = event.queryStringParameters.username;

  if (!username) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: 'Username is required' })
    };
  }

  try {
    const response = await fetch(`https://api.mojang.com/users/profiles/minecraft/${username}`); // Use the provided username
    if (!response.ok) {
      throw new Error('Failed to fetch UUID');
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
