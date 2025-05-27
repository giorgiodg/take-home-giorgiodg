import dotenv from "dotenv";
import path from "path";

// Explicitly load `.env.local` (or fallback to `.env`)
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

// Utility: require a value or throw
function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Export validated env variables
export const config = {
  openAi: {
    apiKey: requireEnv("OPENAI_API_KEY"),
    model: requireEnv("OPENAI_MODEL") || "gpt-4",
    temperature: parseFloat(requireEnv("OPENAI_TEMPERATURE") || "0.7"),
  },
  prismic: {
    repoName: requireEnv("PRISMIC_REPO_NAME"),
    writeApiToken: requireEnv("PRISMIC_WRITE_API_TOKEN"),
    migrationApiKey: requireEnv("PRISMIC_MIGRATION_API_KEY"),
  },
  firecrawl: {
    apiKey: requireEnv("FIRECRAWL_API_KEY"),
  },
};
