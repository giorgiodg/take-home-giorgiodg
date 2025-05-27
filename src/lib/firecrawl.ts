import FirecrawlApp from "@mendable/firecrawl-js";
import { config } from "../config";

const firecrawl = new FirecrawlApp({
  apiKey: config.firecrawl.apiKey,
});

type PageResult = {
  // html?: string;
  markdown?: string;
  text?: string;
  metadata: {
    title: string;
    author: string;
    date: string;
    url: string;
  };
};

/**
 * Crawls the specified URL and retrieves up to the given limit of pages, extracting their content in HTML format along with metadata.
 *
 * @param url - The URL to crawl.
 * @param limit - The maximum number of pages to crawl.
 * @returns A promise that resolves to an array of `PageResult` objects, each containing the page's HTML and Markdown content and metadata.
 * @throws Will throw an error if the crawl operation fails.
 */
export async function crawlUrl(
  url: string,
  limit: number
): Promise<PageResult[]> {
  const result = await firecrawl.crawlUrl(url, {
    limit,
    scrapeOptions: {
      // formats: ["markdown", "html"],
      formats: ["markdown"],
    },
  });

  if (!result.success) {
    throw new Error(`Failed to crawl URL: ${result.error}`);
  } else {
    return result.data.map((page: any) => ({
      // html: page.html,
      markdown: page.markdown,
      metadata: {
        title:
          page.metadata.title && page.metadata.title.trim() !== ""
            ? page.metadata.title
            : "Untitled",
        author: page.metadata.author,
        date: page.metadata.date,
        url:
          page.metadata.url && page.metadata.url.trim() !== ""
            ? page.metadata.url
            : page.url,
      },
    }));
  }
}
