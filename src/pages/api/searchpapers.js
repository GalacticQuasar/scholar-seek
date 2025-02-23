import { GoogleGenerativeAI } from "@google/generative-ai";
import { PdfReader } from 'pdfreader';
import axios from 'axios';

export default async function handler(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let url = req.body.downloadUrl;

    // Check arXiv case
    if (url.startsWith("http://arxiv.org/abs/")) {
        url = url.replace("/abs/", "/pdf/");
    }

    console.log("PARSING PDF:", url);

    try {
        // Fetch PDF
        const response = await axios.get(url, { responseType: 'arraybuffer' });
        const pdfBuffer = Buffer.from(response.data);

        console.log("FETCHED PDF:", url)

        // Extract text from PDF
        const pdfText = await extractTextFromPDF(pdfBuffer);

        console.log("EXTRACTED TEXT FROM PDF");

        if (!pdfText.trim()) {
            throw new Error("Failed to extract text from PDF.");
        }

        // Generate summary
        const prompt = pdfText + "\n\nSummarize the above article:";
        const result = await model.generateContent(prompt);

        //console.log("SUMMARY OF ARTICLE:", result.response.text());
        console.log("DONE");

        res.status(200).json(result.response.text());
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: error.message });
    }
}

// Helper function to extract text from PDF
function extractTextFromPDF(pdfBuffer) {
    return new Promise((resolve, reject) => {
        const reader = new PdfReader();
        let pdfText = '';

        reader.parseBuffer(pdfBuffer, (err, item) => {
            if (err) {
                reject(err);
            } else if (!item) {
                resolve(pdfText); // End of document
            } else if (item.text) {
                pdfText += item.text + ' ';
            }
        });
    });
}
