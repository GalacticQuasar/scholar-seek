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
        model: "gemini-2.0-flash",
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: schema,
        },
      });

    const prompt = 
        req.body.inputText + 
        "\nGiven this research paper draft, extract around 5 to 7 specific single words, not acronyms that best describe the paper. \n" + 
        "- Only return the keywords, separated by spaces\n"
        "- Do NOT include explanations or extra text.\n"
        "- If the input is not a research paper, return exactly this: []"

    const result = await model.generateContent(prompt);
    console.log(result.response.text());

    res.status(200).json(result.response.text());
}