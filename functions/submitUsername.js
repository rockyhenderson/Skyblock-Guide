const fetch = require('node-fetch'); // Netlify supports this out of the box

exports.handler = async (event, context) => {
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: 'Method Not Allowed' }),
        };
    }

    // Parse the body of the request (username)
    const { username } = JSON.parse(event.body);
    console.log("Received username:", username);

    if (!username) {
        console.log("No username received, returning error");
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'Username is required' }),
        };
    }

    try {
        // API call to fetch user data (replace with your actual endpoint)
        const apiUrl = `https://example.com/testapi/${username}`;
        console.log(`Querying API: ${apiUrl}`);

        const apiResponse = await fetch(apiUrl);

        if (!apiResponse.ok) {
            console.log("API request failed with status:", apiResponse.status);
            throw new Error("API request failed");
        }

        const apiData = await apiResponse.json();
        console.log("Received API data:", apiData);

        // Send the API data back to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify(apiData),
        };
        
    } catch (error) {
        console.log("Error querying the API:", error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to fetch data from API' }),
        };
    }
};
