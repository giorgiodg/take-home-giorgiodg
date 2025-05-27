import { orchestrateContent } from "./services/orchestrationService";
import { executeBatchMigration } from "./lib/prismic";

// Simple CLI argument parsing
const [, , urlArg, limitArg] = process.argv;
const url = urlArg || "https://prismic.io/blog/";
const limit = limitArg ? parseInt(limitArg, 10) : 5;

orchestrateContent(url, limit);
