import Image from "next/image";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { BookOpen, Search, FileText, Lightbulb, ExternalLink } from "lucide-react"
import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
// import ResultsDisplay from "@/components/ResultsDisplay"
// {results && <ResultsDisplay results={results} />}

export default function Home() {
  const [inputText, setInputText] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto p-4 py-8 md:py-12">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <BookOpen className="h-8 w-8 text-primary" />
              <h1 className="text-3xl md:text-4xl font-bold">Research Assistant</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Enter your research topic or text, and I'll find relevant academic papers and insights.
            </p>
          </div>

          <Card className="p-6">
            <form className="space-y-4">
              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter your research topic or paste text here..."
                className="min-h-[150px] text-lg"
              />
              {(
                <div className="text-red-500 text-sm p-2 bg-red-50 dark:bg-red-950/50 rounded">
                  hi
                </div>
              )}
              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={loading || !inputText.trim()}
                  className="transition-all duration-200 ease-in-out"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-5 w-5" />
                      Find Research
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}

