import Image from "next/image";
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
// import ResultsDisplay from "@/components/ResultsDisplay"
// {results && <ResultsDisplay results={results} />}

export default function Home() {
  const [inputText, setInputText] = useState("")
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(false)

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Research Assistant</h1>
      <form className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Enter your text here..."
          className="w-full"
        />
        <Button type="submit" disabled={loading}>
          {loading ? "Processing..." : "Find Related Research"}
        </Button>
      </form>
    </main>
  )
}
