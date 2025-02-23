import Image from "next/image";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { marked } from 'marked';

marked.setOptions({
  breaks: true,
});

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [articles, setArticles] = useState(null);

  useEffect(() => {
    if (responseText) {
      const words = responseText.split(" ");
      if (currentIndex < words.length) {
        const timeout = setTimeout(() => {
          setDisplayedResponse(prev => [...prev, words[currentIndex]]);
          setCurrentIndex(prev => prev + 1);
        }, 500); // Adjust word appearance speed here

        return () => clearTimeout(timeout);
      }
    }
  }, [currentIndex, responseText]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) {
      setError(true);
      return;
    }
    setError(false);
    setLoading(true);
    setHasSubmitted(true);
    setDisplayedResponse([]);
    setCurrentIndex(0);
    setResponseText("");

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
        keywordString = keywordString.substring(0, keywordString.lastIndexOf(" ")).replace(/[^A-Za-z\s]/g, '');
        setResponseText(keywordString);
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
        for(let i = 0; i < articles.results.length; i++) {
            console.log("Title: " + articles.results[i].title);
            console.log("Download URL: " + articles.results[i].downloadUrl);
            //extractTextFromPdf(data.results[i].downloadUrl, i + "output.txt");
        }
      } else {
        console.error('Failed to send keywords');
      }
    } catch (error) {
      console.error('Error sending keywords:', error);
    }
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
                  Please enter some text before submitting
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

          {hasSubmitted && (
            <Card className="p-6 bg-[#3e474f] border border-[#9c8f6e] rounded-xl text-white space-y-4">
              <div className="text-lg font-semibold text-[#D4B88C]">
                {loading ? "Finding keywords..." : "Research Insights:"}
              </div>
              <div className="text-[#A8A8A8] flex flex-wrap gap-2">
                {displayedResponse.map((word, index) => (
                  <span 
                    key={index}
                    className="animate-fade-in-up inline-block bg-[#2d353d] px-3 py-1 rounded-full"
                  >
                    {word}
                  </span>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
      <style jsx global>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(10px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}