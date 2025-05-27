import { analyzeContent } from "../lib/ai";
import { crawlUrl } from "../lib/firecrawl";
import { executeBatchMigration } from "../lib/prismic";

/**
 * Orchestrates the content ingestion process by crawling a given URL up to a specified limit,
 * analyzing the content of each crawled page using AI, and creating corresponding documents in Prismic.
 *
 * @param url - The URL to crawl for content.
 * @param limit - The maximum number of pages to crawl from the given URL.
 * @returns A promise that resolves when all documents have been created in Prismic.
 */
export async function orchestrateContent(url: string, limit: number) {
  console.log(`Crawling URL: ${url} with limit: ${limit}`);
  const crawledPages = await crawlUrl(url, limit);
  console.log(`Crawled ${crawledPages.length} pages from ${url}`);

  const prismicDocuments: {
    title: string;
    original: string;
    analyzed: any;
  }[] = [];

  console.log("Analyzing content through AI...");
  for (const crawledPage of crawledPages) {
    const originalTitle = crawledPage.metadata.title || "";
    const originalContentMarkdown = crawledPage.markdown || "";
    // const originalContentHTML = crawledPage.html || "";

    const analyzedContent = await analyzeContent(originalContentMarkdown);

    prismicDocuments.push({
      title: originalTitle,
      original: originalContentMarkdown,
      analyzed: analyzedContent,
    });
  }
  console.log("Content analysis complete.");

  console.log("Creating documents in prismic...");
  await executeBatchMigration(prismicDocuments);
  console.log("Documents created in Prismic successfully.");
}
