exports.handler = async function (event, context) {
    try {
        const { username } = JSON.parse(event.body);

        if (!username) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Username is required' }),
            };
        }

        // Function to jumble the username letters
        const jumbleLetters = (str) => {
            return str.split('').sort(() => Math.random() - 0.5).join('');
        };

        const jumbledName = jumbleLetters(username);

        return {
            statusCode: 200,
            body: JSON.stringify({ jumbledName }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Server Error' }),
        };
    }
};
