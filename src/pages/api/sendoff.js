import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = "Explain the concept of artificial intelligence.";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.status(200).json(result.response.text());
}