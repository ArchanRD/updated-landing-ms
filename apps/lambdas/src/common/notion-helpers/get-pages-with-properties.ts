import chalk from "chalk";
import pMap from "p-map";
import { NotionClient } from "./client";
import getPageProperties from "./get-page-property-values";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import { isFullPage } from "@notionhq/client";
import {
  GetDatabaseResponse,
  PageObjectResponse,
  PartialPageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar({
  format:
    "Fetching Categories Data: " +
    colors.yellow("{bar}") +
    "| {percentage}% || {value}/{total} || ETA: {eta}s || Elapsed: {duration}s",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

export async function getPagesWithProperties(
  notionClient: NotionClient,
  pageItems: (PageObjectResponse | PartialPageObjectResponse)[],
  databaseName: string,
  properties: GetDatabaseResponse["properties"]
) {
  console.log(
    chalk.bgGreen(
      `Fetching Properties for ${databaseName} Pages`,
      pageItems.length
    )
  );

  const fecthedPages = new Set();
  progressBar.start(pageItems.length, 0);

  const pages = await pMap(pageItems, async (page) => {
    if (fecthedPages.has(page.id)) {
      throw new Error(`[${databaseName}]: Page has already been processed!`);
    }
    const pagePropertyValues = await getPageProperties(
      notionClient,
      page.id,
      properties
    );

    fecthedPages.add(page.id);
    progressBar.update(fecthedPages.size);

    const isFullPageResponse = isFullPage(page);

    const pageMetadata = {
      icon: isFullPageResponse ? page.icon : null,
      lastUpdatedAt: isFullPageResponse
        ? new Date(page.last_edited_time)
        : null,
      notionItemId: page.id,
      notionPageUrl: isFullPageResponse ? page.url : null,
    };

    return {
      pagePropertyValues,
      ...pageMetadata,
    };
  });

  progressBar.stop();

  return pages;
}
