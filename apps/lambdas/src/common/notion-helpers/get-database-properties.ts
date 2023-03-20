import invariant from "tiny-invariant";
import type { NotionClient } from "./client";

export default async function getDatabaseProperties(
  notionClient: NotionClient,
  databaseId: string
) {
  const notionDatabaseObject = await notionClient.retrieveDatabase({
    database_id: databaseId,
  });

  invariant(
    "properties" in notionDatabaseObject,
    `Properties not found in database with id: ${databaseId}`
  );

  return notionDatabaseObject;
}
