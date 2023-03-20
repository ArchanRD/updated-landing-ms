import { UpdateDatabaseParameters } from "@notionhq/client/build/src/api-endpoints";
import invariant from "tiny-invariant";
import type { NotionClient } from "./client";

export default async function updateDatabase(
  notionClient: NotionClient,
  databaseId: string,
  properties: Pick<UpdateDatabaseParameters, "properties">["properties"]
) {
  const notionDatabaseObject = await notionClient.updateDatabase({
    database_id: databaseId,
    properties,
  });

  return notionDatabaseObject;
}
