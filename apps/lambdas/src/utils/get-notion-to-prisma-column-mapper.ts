import { Prisma } from "@ms/clients";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { NotionClient } from "../common/notion-helpers/client";
import getDatabasePages from "../common/notion-helpers/get-database-pages";
import getDatabaseProperties from "../common/notion-helpers/get-database-properties";
import { getPagesWithProperties } from "../common/notion-helpers/get-pages-with-properties";

import getEnvVar from "../common/utils/get-env-var";

export const NOTION_PRISMA_COLUMN_MAPPER_CATEGORIES = getEnvVar(
  "NOTION_PRISMA_COLUMN_MAPPER_CATEGORIES",
  true
);

async function setupNotionToPrismaColumnMapperForCategories(
  notionClient: NotionClient
) {
  const prismaColumnNames = Object.keys(Prisma.CategoryScalarFieldEnum);

  const { properties } = await getDatabaseProperties(
    notionClient,
    NOTION_PRISMA_COLUMN_MAPPER_CATEGORIES
  );

  const propertiesWithValues = await getPagesWithProperties(
    notionClient,
    NOTION_PRISMA_COLUMN_MAPPER_CATEGORIES,
    "NOTION_PRISMA_COLUMN_MAPPER_CATEGORIES",
    properties
  );

  const pageTitles = propertiesWithValues.map(
    ({ pagePropertyValues }) => pagePropertyValues.Name
  );

  const entriesToCreate = prismaColumnNames.filter(
    (colName) => !pageTitles.includes(colName)
  );

  // console.log(JSON.stringify(propertiesWithValues, null, 2), entriesToCreate);
}

export default async function getNotionToPrismaColumnMapper(
  notionClient: NotionClient
) {
  return setupNotionToPrismaColumnMapperForCategories(notionClient);
}
