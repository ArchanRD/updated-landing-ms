import {
  BlockObjectResponse,
  PartialBlockObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import pMap from "p-map";
import type { NotionClient } from "./client";

type BlockChildrenResponse = PartialBlockObjectResponse | BlockObjectResponse;

type BlockChildrenResponseFull = Array<
  BlockChildrenResponse & {
    children?: Array<BlockChildrenResponse>;
  }
>;

export default async function getPageContentBlocks(
  notionClient: NotionClient,
  pageId: string,
  start_cursor?: string | undefined,
  results?: BlockChildrenResponseFull
) {
  if (!results) {
    results = [];
  }
  const blockChildren = await notionClient.retrieveBlockChildren({
    block_id: pageId,
    page_size: 100,
    start_cursor,
  });
  results.push(...blockChildren.results);

  if (!blockChildren.has_more) {
    results = await pMap(results, async (blockItem) => {
      if (blockItem && "has_children" in blockItem && blockItem.has_children) {
        console.log("some block has children");
        blockItem.children = await getPageContentBlocks(
          notionClient,
          blockItem.id
        );
      }
      return blockItem;
    });

    return results;
  }

  if (blockChildren.has_more && blockChildren.next_cursor) {
    getPageContentBlocks(
      notionClient,
      pageId,
      blockChildren.next_cursor,
      results
    );
  }
}
