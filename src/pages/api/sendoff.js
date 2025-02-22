import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = 
        req.body.inputText + 
        "\n Given this research paper draft, give me a list of around 5 specific, space seperated keywords that would best describe the paper";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.status(200).json(result.response.text());
}