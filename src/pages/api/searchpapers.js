import { GoogleGenerativeAI } from "@google/generative-ai";
import { PdfReader } from 'pdfreader';
import axios from 'axios';

export default async function handler(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    let prompt;

    let url = req.body.downloadUrl;

    // Check arxiv case
    if (url.startsWith("http://arxiv.org/abs/")) {
        url = url.replace("/abs/", "/pdf/");
    }

    console.log("PARSING PDF:", url)

    await axios.get(url, { responseType: 'arraybuffer' })
        .then((response) => {
            const pdfBuffer = Buffer.from(response.data);
            const reader = new PdfReader();
            let pdfText = '';

            reader.parseBuffer(pdfBuffer, (err, item) => {
                if (err) {
                    console.error('Error parsing PDF:', err);
                } else if (!item) {
                    prompt = pdfText + "\n\nSummarize the above article:";
                } else if (item.text) {
                    pdfText += item.text + ' ';
                }
            });
        })
        .catch((err) => {
            console.error('Error fetching PDF:', err);
        });

    const result = await model.generateContent(prompt);

    console.log("SUMMARY OF ARTICLE:", result.response.text());
   
    res.status(200).json(result.response.text())
}