import { crawlUrl } from "../src/lib/firecrawl";
import { jest, describe, expect, it } from "@jest/globals";

// Mock the FirecrawlApp class from the SDK
jest.mock("@mendable/firecrawl-js", () => {
  return jest.fn().mockImplementation(() => ({
    crawlUrl: jest.fn().mockImplementation((url: any, options: any) => {
      if (url === "https://fail.com") {
        return Promise.resolve({
          success: false,
          error: "Network error",
        });
      }
      if (url === "https://empty.com") {
        return Promise.resolve({
          success: true,
          data: [],
        });
      }
      return Promise.resolve({
        success: true,
        data: [
          {
            html: "# Page 1\n\nContent",
            metadata: {
              title: "Page One",
              author: "Author One",
              date: "2024-01-01",
              url: "https://example.com/page-1",
            },
          },
          {
            html: "# Page 2\n\nMore Content",
            metadata: {
              title: "Page Two",
              author: "Author Two",
              date: "",
              url: "https://example.com/page-2",
            },
          },
          {
            html: "# Page 3\n\nMore Content",
            metadata: {
              title: "",
              author: "Author Three",
              date: "2024-01-03",
              url: "https://example.com/page-3",
            },
          },
        ],
      });
    }),
  }));
});

describe("crawlUrl", () => {
  it("returns an array of page results with metadata", async () => {
    const results = await crawlUrl("https://example.com", 3);

    expect(results).toHaveLength(3);
    // expect(results[0].html).toContain("Page 1");
    expect(results[0].metadata.author).toBe("Author One");
    expect(results[1].metadata.title).toBe("Page Two");
    expect(results[1].metadata.date).toBe("");
    expect(results[2].metadata.title).toBe("Untitled");
  });

  it("throws an error if crawl fails", async () => {
    await expect(crawlUrl("https://fail.com", 2)).rejects.toThrow(
      "Failed to crawl URL: Network error"
    );
  });

  it("returns an empty array if no data is returned", async () => {
    const results = await crawlUrl("https://empty.com", 2);
    expect(Array.isArray(results)).toBe(true);
    expect(results).toHaveLength(0);
  });
});
