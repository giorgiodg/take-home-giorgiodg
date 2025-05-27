import { config } from "../config";
import * as prismic from "@prismicio/client";
// import { htmlAsRichText } from "@prismicio/migrate";

type AnalyzedContent = {
  tags: string[];
  summary: string;
  key_takeaways: string[];
};

type PrismicPayload = {
  type: string;
  tags: string[];
  lang: string;
  data: {
    // full_content: prismic.RichTextField;
    full_content: Array<{ type: "paragraph"; text: string }>;
    summary: Array<{ type: "paragraph"; text: string }>;
    key_takeaways: Array<{
      takeaway: Array<{ type: "paragraph"; text: string }>;
    }>;
  };
};

/**
 * Formats an array of takeaway strings into an array of objects,
 * each containing a single takeaway structured as a paragraph.
 *
 * @param takeaways - An array of takeaway strings to be formatted.
 * @returns An array of objects, each with a `takeaway` property containing
 *          an array with a single paragraph object.
 */
function formatKeyTakeaways(takeaways: string[]) {
  return takeaways.map((text) => ({
    takeaway: [
      {
        type: "paragraph" as const,
        text,
      },
    ],
  }));
}

/**
 * Executes a batch migration of documents to Prismic.
 *
 * This function prepares and migrates an array of documents, each containing a title,
 * original content, and analyzed content, to the Prismic CMS. For each document, it
 * formats the key takeaways, constructs the payload, and adds it to a migration batch.
 * At the end, it executes the migration using the Prismic write client.
 *
 * @param documents - An array of objects representing the documents to migrate. Each object should include:
 *   - `title`: The title of the document.
 *   - `original`: The original content of the document.
 *   - `analyzed`: An object containing analyzed content, such as summary, key takeaways, and tags.
 *
 * @returns A promise that resolves when the migration is complete.
 */
export async function executeBatchMigration(
  documents: Array<{
    title: string;
    original: string;
    analyzed: AnalyzedContent;
  }>
) {
  const writeClient = prismic.createWriteClient(config.prismic.repoName, {
    writeToken: config.prismic.writeApiToken,
  });

  const migration = prismic.createMigration();

  for (const { title, original, analyzed } of documents) {
    // const formattedFullContent = htmlAsRichText(original).result;
    const formattedKeyTakeaways = formatKeyTakeaways(analyzed.key_takeaways);

    const payload: PrismicPayload = {
      type: "default",
      tags: analyzed.tags,
      lang: "en-gb",
      data: {
        full_content: [{ type: "paragraph", text: original }],
        summary: [{ type: "paragraph", text: analyzed.summary }],
        key_takeaways: formattedKeyTakeaways,
      },
    };

    migration.createDocument(payload, title);
  }

  // Execute the prepared migration at the very end of the script
  await writeClient.migrate(migration, {
    reporter: (event) => console.log(event),
  });
}
