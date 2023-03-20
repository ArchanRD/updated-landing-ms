import { isFullPage } from "@notionhq/client";
import {
  QueryDatabaseResponse,
  QueryDatabaseParameters,
} from "@notionhq/client/build/src/api-endpoints";
import { GetDataMadeOrUpdatedAfter, NotionClient } from "./client";
import processProperties from "./process-properties";

export default async function getDatabasePages(
  notionClient: NotionClient,
  databaseId: string,
  start_cursor?: string | undefined,
  results?: QueryDatabaseResponse["results"],
  applyFilter?: boolean
) {
  const PAGE_SIZE = 100; //MAX

  if (!results) {
    results = [];
  }

  const filters: QueryDatabaseParameters["filter"] = applyFilter
    ? {
        or: [
          {
            timestamp: "created_time",
            created_time: {
              after: GetDataMadeOrUpdatedAfter as any,
            },
          },
          {
            timestamp: "last_edited_time",
            last_edited_time: {
              after: GetDataMadeOrUpdatedAfter as any, // throws error as date type invalid but string isnt working
            },
          },
        ],
      }
    : undefined;

  const notionPageItems = await notionClient.queryDatabase({
    database_id: databaseId,
    page_size: PAGE_SIZE,
    start_cursor,
    filter: filters,
  });

  // notionPageItems.results.map((item) => {
  //   if (isFullPage(item)) {
  //     item.properties;
  //   }
  // });

  results.push(...notionPageItems.results);

  if (notionPageItems.has_more && notionPageItems.next_cursor) {
    await getDatabasePages(
      notionClient,
      databaseId,
      notionPageItems.next_cursor,
      results,
      applyFilter
    );
  }

  return (
    results?.map((r) => {
      return {
        ...r,
        processedProperties: isFullPage(r)
          ? processProperties(r.properties)
          : null,
      };
    }) || []
  );
}
