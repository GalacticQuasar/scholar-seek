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

    //const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const model = genAI.getGenerativeModel({
        model: "gemini-1.5-pro",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

    const prompt = 
        req.body.inputText + 
        "\n Given this research paper draft, give me a list of specific keywords that would best describe the paper.\n" + 
        "If input is not a research paper, RETURN AN EMPTY LIST: [].";

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.status(200).json(result.response.text());
}