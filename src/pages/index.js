import Image from "next/image";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [savedText, setSavedText] = useState("");
  const [responseText, setResponseText] = useState("");
  const [articles, setArticles] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);

    console.log("Calling /api/sendoff")
    let keywordString;

    try {
      const response = await fetch('/api/sendoff', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ inputText }),
      });

      if (response.ok) {
        keywordString = await response.text();
        setResponseText(keywordString);
        console.log('Success:', keywordString);
      } else {
        console.error('Failed to send text');
      }
    } catch (error) {
      console.error('Error sending text:', error);
    }

    setLoading(false);

    console.log("Calling /api/keywordsearch")
    let articles;

    try {
      const response = await fetch('/api/keywordsearch', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ keywordString }),
      });

      if (response.ok) {
        articles = await response.json();
        setArticles(articles);
        console.log('Success:', articles);
      } else {
        console.error('Failed to send keywords');
      }
    } catch (error) {
      console.error('Error sending keywords:', error);
    }

    setSavedText(inputText);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2b2f3d] to-[#1e222d] dark:text-gray-300">
      <main className="container mx-auto p-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 mr-2 text-[#9c8f6e]" />
              <h1 className="text-4xl font-serif font-bold text-[#D4B88C]">
                Scholar Seek
              </h1>
            </div>
            <p className="text-[#A8A8A8] text-lg max-w-2xl mx-auto">
              Enter your research topic or text, and I’ll find relevant academic
              papers and insights. Your scholarly journey begins here.
            </p>
          </div>

          <Card className="p-6 bg-[#2d353d] border border-[#9c8f6e] rounded-xl shadow-xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your research topic or paste text here..."
                className="min-h-[150px] text-lg bg-[#3e474f] text-white placeholder:text-[#a0a0a0] rounded-lg border-[#9c8f6e] focus:outline-none focus:ring-2 focus:ring-[#9c8f6e]"
              />
              {error && (
                <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-950/50 rounded">
                  hi
                </div>
              )}
              <div className="flex justify-end">
                <Button
                  type="submit"
                  size="lg"
                  disabled={loading || !inputText.trim()}
                  className="w-1/4 transition-all duration-200 ease-in-out bg-[#9c8f6e] hover:bg-[#D4B88C] text-black dark:text-white rounded-xl"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-0 h-5 w-5" />
                      Find Research
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>

          {/* {savedText && (
            <Card className="p-4 bg-[#3e474f] border border-[#9c8f6e] rounded-xl text-white">
              <h2 className="text-lg font-semibold text-[#D4B88C]">Saved Text:</h2>
              <p className="text-[#A8A8A8]">{savedText}</p>
            </Card>
          )} */}
          {responseText && (
            <Card className="p-4 bg-[#3e474f] border border-[#9c8f6e] rounded-xl text-white">
              <h2 className="text-lg font-semibold text-[#D4B88C]">LLM RESPONSE:</h2>
              <p className="text-[#A8A8A8]">{responseText}</p>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
