import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BookOpen, Search, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { marked } from 'marked';
import Head from "next/head"

marked.setOptions({
  breaks: true,
});

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [responseText, setResponseText] = useState("");
  const [displayedResponse, setDisplayedResponse] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [articles, setArticles] = useState(null);
  const [showArticles, setShowArticles] = useState(false); // Controls when articles start appearing
  const [displayedArticles, setDisplayedArticles] = useState([]); // Stores articles to display one by one
  const [articleIndex, setArticleIndex] = useState(0); // Tracks which article to show next
  const [keywords, setKeywords] = useState([])
  const [paperSummaries, setPaperSummaries] = useState({});


  // Effect for displaying keywords one by one
  useEffect(() => {
    if (responseText) {
      const words = responseText.split(" ");
      if (currentIndex < words.length) {
        const timeout = setTimeout(() => {
          setDisplayedResponse(prev => [...prev, words[currentIndex]]);
          setCurrentIndex(prev => prev + 1);
        }, 500); // Adjust word appearance speed here

        return () => clearTimeout(timeout);
      } else {
        // Keywords are fully loaded, start showing articles
        setShowArticles(true);
      }
    }
  }, [currentIndex, responseText]);

  // Effect for displaying articles one by one
  useEffect(() => {
    if (showArticles && articles?.results && articleIndex < articles.results.length) {
      const timeout = setTimeout(() => {
        setDisplayedArticles(prev => [...prev, articles.results[articleIndex]]);
        setArticleIndex(prev => prev + 1);
      }, 500); // Adjust article appearance speed here

      return () => clearTimeout(timeout);
    }
  }, [showArticles, articles, articleIndex]);

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
    setDisplayedArticles([]); // Reset displayed articles
    setCurrentIndex(0);
    setArticleIndex(0); // Reset article index
    setShowArticles(false); // Hide articles until keywords are done
    setResponseText("");

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
        keywordString = await response.json();
        keywordString = keywordString.substring(0, keywordString.lastIndexOf(" ")).replace(/[^A-Za-z\s]/g, '');
        setResponseText(keywordString);
      } else {
        console.error('Failed to send text');
      }
    } catch (error) {
      console.error('Error sending text:', error);
    }

    setLoading(false);

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
      } else {
        console.error('Failed to send keywords');
      }
    } catch (error) {
      console.error('Error sending keywords:', error);
    }

    try {    
      for (let i = 0; i < articles.results.length; i++) {
        const article = articles.results[i];
    
        fetch('/api/searchpapers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ downloadUrl: article.downloadUrl }),
        })
          .then(async (response) => {
            if (!response.ok) {
              throw new Error(`Failed to fetch summary for ${article.title}`);
            }
           
            const paperSummary = await response.json();
            // Split summary into words
            const words = paperSummary.split(" ");

            setPaperSummaries((prevSummaries) => ({
              ...prevSummaries,
              [article.title]: words[0], // Set the first word
            }));
            
            let index = 1;
    
            // Gradually update state word by word
            const interval = setInterval(() => {
              setPaperSummaries((prevSummaries) => ({
                ...prevSummaries,
                [article.title]: (prevSummaries[article.title] || "") + " " + words[index],
              }));
    
              index++;
              if (index >= words.length - 1) clearInterval(interval); // Stop when done
            }, 50); // Adjust speed of word appearance
          })
          .catch((error) => {
            console.error('Error fetching article:', error);
          });
      }
    } catch (error) {
      console.error('Error sending articles:', error);
    }      
  };

  function Separator({ color = "#D4B88C", height = "2px" }) {
    return (
      <hr
        style={{
          backgroundColor: color,
          height: height,
          border: "none",
          borderRadius: "5px",
          margin: "10px 0",
          transition: "all 0.3s ease",
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#2b2f3d] to-[#1e222d] dark:text-gray-300">
      <Head>
        <title>Scholar Seek</title>
      </Head>
      <main className="container mx-auto p-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 mr-2 text-[#D4B88C]" />
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
                className="min-h-[300px] text-lg bg-[#3e474f] text-white placeholder:text-[#a0a0a0] rounded-lg border-[#9c8f6e] focus:outline-none focus:ring-2 focus:ring-[#9c8f6e] resize-none"
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
                {loading ? "Finding keywords..." : "Research Keywords:"}
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

              {/* Article Titles Section */}
              {displayedArticles.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h3 className="text-lg font-semibold text-[#D4B88C]">Related Articles:</h3>
                  {displayedArticles.map((article, index) => (
                    <div
                      key={index}
                      className="animate-fade-in-up bg-[#2d353d] p-4 rounded-lg border border-[#9c8f6e] hover:border-[#D4B88C] transition-all duration-200"
                    >
                      <p className="text-xl text-[#A8A8A8] font-semibold">{article.title}</p>
                      <Separator color="#D4B88C" height="2px" />
                      {paperSummaries[article.title] && (
                        <p className="text-[#A8A8A8] mt-2" 
                            dangerouslySetInnerHTML={{ 
                              __html: marked.parse(paperSummaries[article.title] || "") 
                            }} 
                        />
                      )}
                      {article.downloadUrl && (
                        <a
                          href={article.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="mt-2 inline-block text-[#D4B88C] hover:text-[#9c8f6e] transition-colors duration-200"
                        >
                          Download PDF
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>
      </main>
      <style jsx global>{`
        * {
          font-family: 'Georgia', Times, serif;
        }
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
      <style jsx global>{`
        /* Customize scrollbar */
        ::-webkit-scrollbar {
          width: 18px;
          height: 12px;
        }

        textarea::-webkit-scrollbar-track {
          border-radius: 10px;
        }

        ::-webkit-scrollbar-corner {background-color: transparent;}

        ::-webkit-scrollbar-track {
          background: #2b2f3d; /* Dark background for the track */
        }

        ::-webkit-scrollbar-thumb {
          background: #9c8f6e; /* Gold color for the thumb */
          border-radius: 10px;
          border: 3px solid #1e222d; /* Darker border for contrast */
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #D4B88C; /* Lighter gold when hovered */
        }

        /* Add smooth scrolling to the whole page */
        html {
          scroll-behavior: smooth;
        }
      `}</style>
      <style jsx global>{`
      /* Customize bold text to be golden */
      strong, b {
        color: #D4B88C; /* Golden color */
      }

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