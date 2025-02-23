import fetch from 'node-fetch';
// import { PdfReader } from 'pdfreader';
// import axios from 'axios';
// import fs from 'fs';

// async function extractTextFromPdf(pdfUrl, outputFilePath) {
//     axios.get(pdfUrl, { responseType: 'arraybuffer' })
//         .then((response) => {
//             const pdfBuffer = Buffer.from(response.data);
//             const reader = new PdfReader();
//             let pdfText = '';

//             reader.parseBuffer(pdfBuffer, (err, item) => {
//                 if (err) {
//                     console.error('Error parsing PDF:', err);
//                 } else if (!item) {
//                     fs.writeFile(outputFilePath, pdfText, (writeErr) => {
//                         if (writeErr) {
//                             console.error('Error writing to file:', writeErr);
//                         } else {
//                             console.log(`Extracted text saved to ${outputFilePath}`);
//                         }
//                     });
//                 } else if (item.text) {
//                     pdfText += item.text + ' ';
//                 }
//             });
//         })
//         .catch((err) => {
//             console.error('Error fetching PDF:', err);
//         });
// }

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