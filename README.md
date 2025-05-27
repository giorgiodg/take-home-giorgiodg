# Take-Home Task: Content Intelligence

#### Pipeline for content crawling, summarization & publishing

## Setup & Installation

1.  **Clone the repository:**

    ```sh
    git clone git@github.com:giorgiodg/take-home-giorgiodg.git
    cd take-home-giorgiodg
    ```

2.  **Install dependencies:**

    ```sh
    npm install
    ```

3.  **Configure environment variables:**

    - Copy `.env.local.example` to `.env.local` and fill in your API keys and configuration.

4.  **Run the application:**

    The following command will crawl 5 pages starting from https://prismic.io/blog/.

    ```sh
    npm run start
    ```

    The application has a basic CLI params handling for URL and number of pages to crawl.
    So to override the default values execute:

    ```sh
    npm run start https://prismic.io/blog/category/tech-stack 4
    ```

---

## Tech Stack Choices & Reasoning

- **TypeScript**  
  Ensures type safety and maintainability, reducing runtime errors and improving developer experience.

- **OpenAI**  
  Used for content analysis and summarization due to its state-of-the-art language models and flexible API.

- **Prismic**  
  Selected as the headless CMS for its flexible content modeling, API-driven approach, and ease of integration.

- **Firecrawl**  
  Utilized for crawling and extracting content from URLs, streamlining ingestion from external sources.

---

## Architecture Decisions

- **Content Ingestion:**  
  The system ingests content from URLs using Firecrawl, extracting both markdown and metadata for further processing.

- **Content Analysis:**  
  OpenAI's API is used to summarize and extract key takeaways from the ingested content, enabling automated content intelligence.

- **CMS Integration:**  
  Summarized and analyzed content is pushed to Prismic, leveraging its API for structured content storage and retrieval.

- **Prompt Engineering:**  
  One-shot prompts are used for summarization to keep the process simple and efficient, but the architecture allows for easy extension to multi-shot or more complex prompt strategies.

- **Separation of Concerns:**  
  The codebase is organized into clear modules:

  - `src/lib/ai.ts`: OpenAI logic
  - `src/lib/prismic.ts`: Prismic API logic
  - `src/lib/firecrawl.ts`: Content ingestion logic
  - `src/prompts/`: LLM prompt templates
  - `src/services/`: Orchestration and business logic

- **Environment Management:**  
  Sensitive configuration is managed via environment variables, with an example file provided for onboarding.

---

## Project Structure

```plaintext
├── src/
│   ├── index.ts                    # Entry point
│   ├── lib/
│   │   ├── ai.ts                   # OpenAI logic
│   │   ├── prismic.ts              # Prismic API logic
│   │   └── firecrawl.ts            # Content ingestion
│   ├── prompts/
│   |   └── summarize.ts            # LLM prompt
│   └── services/
│       └── orchestrationService.ts # Orchestration and business logic
├── .env.local.example              # Example env vars
├── README.md
├── jest.config.js
├── package.json
├── tsconfig.json
```
