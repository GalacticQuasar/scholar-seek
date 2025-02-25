# Scholar Seek
<img width="951" alt="scholar-seek-showcase" src="https://github.com/user-attachments/assets/a805ac71-f6d1-4f6c-b064-8edea65cfc98" />

## Try it out at [scholar-seek.vercel.app](https://scholar-seek.vercel.app/)

## Inspiration
Our inspiration for this project was to address the issue of expanding on and continuing to write research paper drafts. However, we also had ScholarSeek in mind as an educational tool. We figured that if a researcher were given a few of the most relevant papers to their paper draft, they would be able to cite these papers and thus build on the ideas of these papers. Educationally, ScholarSeek allows regular people to explore other research papers related to the one they recently read or were intrigued by. Though we recognize that there are other resources to use for this such as other LLMs, our project aims to share relevant, recent, and accurate papers.

## What it does
ScholarSeek first prompts you to enter a draft or any completed research paper. After doing this, it analyzes the writing you sent for the most relevant keywords to the paper using a Gemini LLM call. It then feeds these keywords into CoreAPI, an API that searches for research papers, adjusting to optimize both recency and relevancy. Then, after the papers are generated, another Gemini LLM call is made to summarize the research paper. Then, the title, summary, and download link are populated on the page.

## How we built it
We envisioned this project to be like a pipeline. We first drew out a flow chart outlining the process, starting with the researcher and their draft. First, we supply the draft to a Gemini 2.0 Flash using the Gemini API and ask it to generate keywords that are adjacent to the contents of the draft. Next, we take those keywords and perform an advanced search with the CORE API to find relevant research papers. With this list of papers, we scrape the PDF of each paper and use the Gemini API again to generate a summary and display it to the user. With each Gemini API call, we had to prompt engineer to ensure the output was structured, relevant, and concise. Each time a new step of the pipeline is reached, we update the client so the user knows what is happening.

## Challenges we ran into
We ran into some minor challenges with getting the Gemini API key and the CORE API key rate limits when testing Scholar Seek on various research papers. Additionally, there were issues with the speed of parsing the data from the pdf of the research papers we found, but this turned out to mostly be due to internet speeds and loading the paper as opposed to scraping it. Other than this the project ended up being pretty smooth 🙂

## Accomplishments that we're proud of
One of our core beliefs was to make sure we keep the user in the loop, and we accomplished this by giving status updates and streaming generated text output to the client. In past hackathons, we focused too much on the server functionality of the application and not enough on the frontend aesthetics and user experience. I feel that we turned it around this time, and made sure to make a dazzling UI and intuitive user experience. We are proud of making an excellently functional and easy-to-use application.

## What we learned
Through Scholar Seek, we learned about how to effectively use things like Next.js and API calls to Gemini. We also realized that extracting text from PDFs is inconsistent, requiring multiple trials to get something accurate and efficient. Additionally, handling API calls was crucial, as large PDFs sometimes exceeded token limits, requiring smarter pre-processing and not overloading our rate limits. Finally, we refined prompt engineering to get well-structured, Markdown-formatted summaries from Gemini. These challenges improved our ability to integrate AI with real-world data processing tasks.

## What's Next for Scholar Seek
One idea we have for the future is to add a chatbot to the individual research paper entries so users can prompt Scholar Seek for more details about any given paper. This addition would make the application more interactive, versatile, and user-friendly. Furthermore, we aim to deploy Scholar Seek in the future, making it accessible to the general public and anyone interested in exploring research more effectively.
