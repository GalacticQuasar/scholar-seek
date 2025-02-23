import fetch from 'node-fetch';

export default async function handler(req, res) {
    const query = req.body.keywordString;
    console.log("KEYWORD STRING:", query);
    const limit = 5;
    const sort = 'relevance';

    const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&limit=${limit}&sort=${sort}`;

    let data;

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${process.env.CORE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            res.status(500).send('CORE Fetch Error')
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        data = await response.json();

    } catch (error) {
        console.error("Error fetching data:", error);
    }
    
    res.status(200).json(data)
}