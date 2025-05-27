export const summarizePrompt = (content: string) => `
You are a content intelligence assistant. Analyze the following article and provide structured insights.

Instructions:
- Summarize it in 3-4 sentences.
- Suggest 3-5 tags or categories.
- Extract 3-5 key takeaways.

Respond in the following JSON format:

{
  "summary": "string",
  "tags": ["string", "string", ...],
  "key_takeaways": ["string", "string", ...]
}

---

CONTENT START
${content}
CONTENT END
`;
