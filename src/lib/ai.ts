import { OpenAI } from "openai";
import { config } from "../config";
import { summarizePrompt } from "../prompts/summarize";
import { encoding_for_model } from "tiktoken";

const openai = new OpenAI({ apiKey: config.openAi.apiKey });

/**
 * Analyzes the provided text content using an OpenAI GPT-4 model and returns the parsed JSON result.
 *
 * This function generates a prompt using `summarizePrompt`, sends it to the OpenAI API,
 * and attempts to parse the response as JSON. If the response cannot be parsed, an error is thrown.
 *
 * @param text - The input text to be analyzed.
 * @returns A promise that resolves to the parsed JSON object returned by the OpenAI API.
 * @throws Will throw an error if the OpenAI response cannot be parsed as JSON.
 */
export async function analyzeContent(text: string) {
  const safeLimit = 7500; // Adjust based on messages overhead
  const truncatedText = truncateToTokenLimit(text, safeLimit);
  const prompt = summarizePrompt(truncatedText);

  const res = await openai.chat.completions.create({
    model: config.openAi.model,
    messages: [{ role: "user", content: prompt }],
    temperature: config.openAi.temperature,
  });

  const content = res.choices[0].message.content ?? "";

  try {
    return JSON.parse(content);
  } catch (err) {
    console.error("OpenAI returned unparseable content:", content);
    throw err;
  }
}

/**
 * Truncates the input text to ensure it does not exceed the specified token limit.
 * Uses the encoding for the configured OpenAI model to count tokens.
 *
 * @param text - The input string to be truncated.
 * @param limit - The maximum number of tokens allowed.
 * @returns The truncated string that fits within the token limit.
 */
export function truncateToTokenLimit(text: string, limit: number): string {
  const enc = encoding_for_model(config.openAi.model as any);
  const encoded = enc.encode(text);
  if (encoded.length <= limit) return text;

  const truncated = encoded.slice(0, limit);
  return Buffer.from(enc.decode(truncated)).toString();
}
