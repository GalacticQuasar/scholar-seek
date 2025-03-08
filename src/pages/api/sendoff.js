import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export default async function handler(req, res) {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    const schema = {
        description: "List of specific keywords describing the article",
        type: SchemaType.ARRAY,
        items: {
          type: SchemaType.STRING,
        },
      };

    const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

    const prompt = 
        req.body.inputText + 
        "\n--------------------\n" +
        "You are a tool which helps users find relevant research papers." +
        "Given the above content or question, extract 5 to 7 specific keywords (NOT compound words) that would be suitable for a research article search. \n" + 
        "If the input is irrelevant or invalid, return an empty list: []";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.status(200).json(result.response.text());
}