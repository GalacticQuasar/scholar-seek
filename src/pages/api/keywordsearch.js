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
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        data = await response.json();

        // for(let i = 0; i < data.results.length; i++) {
        //     console.log("Download URL: " + data.results[i].downloadUrl);
        //     extractTextFromPdf(data.results[i].downloadUrl, i + "output.txt");
        // }
    } catch (error) {
        console.error("Error fetching data:", error);
    }

    //console.log(data);

    res.status(200).json(data)
}