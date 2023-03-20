import pProps from "p-props";
import { refinePageProperties } from "../helper";
import type { NotionClient, NotionPageProperties } from "./client";

export default async function getPageProperties(
  notionClient: NotionClient,
  pageId: string,
  properties: NotionPageProperties
) {
  const propertiesValues = await pProps(
    properties,
    async ({ id }) => {
      const pageWithProps = await notionClient.retrievePageProperties({
        page_id: pageId,
        property_id: id,
      });

      return refinePageProperties(pageWithProps);
    },
    {
      stopOnError: true,
    }
  );
  return propertiesValues;
}
