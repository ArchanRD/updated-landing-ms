import { db, Prisma } from "@ms/clients";
import { getNotionClient } from "../../../common/notion-helpers/client";
import getDatabaseProperties from "../../../common/notion-helpers/get-database-properties";
import slugify from "slugify";
import {
  getPropertyValue,
  getPrismaValues,
  PrismaValueMapper,
  generateConnectClause,
} from "../../../common/helper/get-prisma-object";
import getDatabasePages from "../../../common/notion-helpers/get-database-pages";
import { CategoryCreateWithoutResourcesInputSchemaObject } from "@ms/clients/build/joi-types/schemas/objects/CategoryCreateWithoutResourcesInput.schema";
import Joi from "joi";
import chalk from "chalk";
import sendSlackMessage from "../../../common/slack/send-slack-message";
import { NOTION_CATAGORIES_DATABASE_ID } from "../../../common/utils/consts";
import {
  generateJoiErrorMessageBody,
  generatePrismaErrorMessageBody,
} from "../../../common/slack/generate-message-body";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import pMap from "p-map";
import { isFullPage } from "@notionhq/client";
import { Simplify } from "type-fest";
import getPropertiesByNotionId from "../../../common/helper/get-properties-by-id";
import strapi from "../../../common/strapi/client";

const progressBar = new cliProgress.SingleBar({
  format:
    "Inserting Categories Data: " +
    colors.yellow("{bar}") +
    "| {percentage}% || {value}/{total} || ETA: {eta}s || Elapsed: {duration}s",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

type CategoryNotionToPrismaPropertyMap = PrismaValueMapper<
  Prisma.CategoryUpsertArgs["create"]
>;

const categoryToPrismaMap: CategoryNotionToPrismaPropertyMap = {
  name: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "title"),
  description: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "%7D%40%7BD"),
  shortDescription: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "h%3F%5C%3A"),
  archive: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "uS%5B%40"),
  emoji: (page) =>
    isFullPage(page) && page?.icon?.type === "emoji" ? page.icon.emoji : null,
  // TODO: Fix URL Icons
  icon: (page) =>
    isFullPage(page) && page.icon?.type === "emoji" ? page.icon.emoji : null,
  notionLastUpdatedAt: (page) =>
    isFullPage(page) ? new Date(page.last_edited_time) : null,
  notionItemId: (page) => page.id,
  seoDescription: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "O%3FT%5D"),
  seoTitle: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "RljP"),
  seoKeywords: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "uinz"),
  bgColor: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "z%3AH%3E"),
  slug: (page, propertiesByNotionId) =>
    page.processedProperties?.[propertiesByNotionId.title.name] &&
    slugify(
      page.processedProperties[propertiesByNotionId.title.name] as string,
      { strict: true }
    )?.toLowerCase(),
  order: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "%5EnhL"),
  relatedCategories: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "%7B%3FSa", "id"),
};

async function linkRelatedCategories(
  pageItems: Awaited<ReturnType<typeof getDatabasePages>>,
  properties: GetDatabaseResponse["properties"],
  notionItemIdToDbIdMap: Record<string, number>
) {
  console.log("Linking related categories");
  await pMap(pageItems, async (page) => {
    const prismaValues = await getPrismaValues<
      Prisma.CategoryUpsertArgs["create"]
    >(properties, page, categoryToPrismaMap);

    if (
      prismaValues &&
      !prismaValues.archive &&
      prismaValues.relatedCategories
    ) {
      const notionItemId = prismaValues.notionItemId;

      if (!notionItemId || typeof notionItemId !== "string") {
        console.error(`Invalid notionItemId found: ${notionItemId}`);
        return;
      }

      // Get DB Id from the itemIdToDbId map for making strapi API call
      const dbId = notionItemIdToDbIdMap[notionItemId];
      if (!dbId) {
        console.error(
          `No dbId found for notionItemId: ${notionItemId}, itemData: ${JSON.stringify(
            page
          )}`
        );
        return;
      }

      const relatedCategories = prismaValues.relatedCategories as {
        connect?: { id: string } | Array<{ id: string }>;
      };
      if (!relatedCategories.connect) {
        return;
      }

      // Generate connect data which contains the id as notionItemId
      let connectData: Array<{ id: string }> = [];
      if (!Array.isArray(relatedCategories.connect)) {
        connectData.push(relatedCategories.connect);
      } else {
        connectData = relatedCategories.connect;
      }

      // Replace notionItemId with DB Id
      const mappedConnectData = connectData
        .map((s) => {
          const id = notionItemIdToDbIdMap[s.id];
          if (!id) {
            console.log(
              `No dbId found for notionItemId: ${s.id} while linking the related categories`
            );
            return;
          }

          return { id: id };
        })
        .filter((s) => s);

      // alert if mismatch found in size
      if (mappedConnectData.length !== connectData.length) {
        console.error(
          `Length mismatch found. mappedConnectData: ${JSON.stringify(
            mappedConnectData
          )}, connectData: ${JSON.stringify(
            connectData
          )}, notionItemIdToDbIdMap: ${notionItemIdToDbIdMap}`
        );
      }

      // update data in DB by making strapi api call
      if (mappedConnectData.length > 0) {
        const updateBody = {
          data: {
            relatedCategories: {
              connect: mappedConnectData,
            },
          },
        };

        try {
          await strapi.put("/categories/" + dbId, updateBody);
          console.log(
            `Successfully linked the related category for notionItemId: ${notionItemId}`
          );
        } catch (e) {
          if (e.response) {
            console.log(
              "Response error while linking the category: ",
              JSON.stringify(e.response.data)
            );
          } else if (e.request) {
            console.log(
              "Request error while linking the category: ",
              JSON.stringify(updateBody),
              JSON.stringify(e.request)
            );
          } else {
            console.log("err", e);
          }
        }
      }
    }
  });
}

const generateNotionItemIdToDbIdMap = (
  categories: Array<{
    data: { id: number; attributes: { notionItemId: string } };
  }>
): Record<string, number> => {
  const notionItemIdToDbIdMap: Record<string, number> = {};

  for (const cat of categories) {
    notionItemIdToDbIdMap[cat.data.attributes.notionItemId] = cat.data.id;
  }

  return notionItemIdToDbIdMap;
};

async function processAndSeedCategoryPagesToStrapi(
  pageItems: Awaited<ReturnType<typeof getDatabasePages>>,
  databaseName: string,
  properties: GetDatabaseResponse["properties"]
) {
  const categories = (
    await pMap(pageItems, async (page) => {
      const prismaValues = await getPrismaValues<
        Prisma.CategoryUpsertArgs["create"]
      >(properties, page, categoryToPrismaMap);
      const category = prismaValues;

      if (category && !category.archive) {
        try {
          const response = await strapi.post("/categories", {
            data: {
              name: category.name,
              description: category.description,
              shortDescription: category.shortDescription,
              slug: category.slug,
              archive: category.archive,
              seoDescription: category.seoDescription,
              seoTitle: category.seoTitle,
              seoKeywords: category.seoKeywords,
              bgColor: category.bgColor,
              order: category.order,
              notionItemId: category.notionItemId,
            },
          });
          return response.data;
        } catch (e) {
          if (e.response) {
            console.log("Response error: ", JSON.stringify(e.response.data));
          } else if (e.request) {
            console.log("Request error: ", JSON.stringify(e.request));
          } else {
            console.log("err", e);
          }
        }
      }
    })
  ).filter((s) => s !== null && s !== undefined);

  await linkRelatedCategories(
    pageItems,
    properties,
    generateNotionItemIdToDbIdMap(categories)
  );
}

async function processAndSeedCategoryPages(
  pageItems: Awaited<ReturnType<typeof getDatabasePages>>,
  databaseName: string,
  properties: GetDatabaseResponse["properties"]
) {
  const fetchedPages = new Set();
  progressBar.start(pageItems.length, 0);

  const categories = (
    await pMap(pageItems, async (page) => {
      if (fetchedPages.has(page.id)) {
        throw new Error(`[${databaseName}]: Page has already been processed!`);
      }

      const isFullPageResponse = isFullPage(page);

      const pageMetadata = {
        icon: isFullPageResponse ? page.icon : null,
        lastUpdatedAt: isFullPageResponse
          ? new Date(page.last_edited_time)
          : null,
        notionItemId: page.id,
        notionPageUrl: isFullPageResponse ? page.url : null,
      };

      const pageItem = {
        pagePropertyValues: page.processedProperties,
        ...pageMetadata,
      };

      const prismaValues = await getPrismaValues<
        Prisma.CategoryUpsertArgs["create"]
      >(properties, page, categoryToPrismaMap);

      const categorySchema = Joi.object().keys(
        CategoryCreateWithoutResourcesInputSchemaObject
      );

      const { error, value: validValues } = categorySchema.validate(
        prismaValues,
        {
          abortEarly: false,
          allowUnknown: true,
        }
      );
      if (error) {
        if (prismaValues?.name && !prismaValues?.archive) {
          const messageBody = generateJoiErrorMessageBody(
            pageItem.notionPageUrl!,
            prismaValues.name as string,
            error
          );
          console.log(
            chalk.bgYellow(
              "Category name: ",
              prismaValues?.name,
              " URL: ",
              pageItem.notionPageUrl
            ),
            chalk.bgBlue(JSON.stringify(messageBody, null, 2))
          );
          sendSlackMessage(messageBody, false);
        }
        return;
      }

      if (validValues) {
        await db.category
          .upsert({
            create: validValues,
            update: validValues,
            where: {
              notionItemId: validValues.notionItemId,
            },
          })
          .catch((error) => {
            if (!validValues.archive) {
              console.log(error);
              const { messageBody, isUnknownError } =
                generatePrismaErrorMessageBody(
                  pageItem.notionPageUrl!,
                  validValues.name,
                  error
                );
              sendSlackMessage(messageBody, isUnknownError);
            }
          });
      }
      fetchedPages.add(page.id);
      progressBar.update(fetchedPages.size);
    })
  ).filter((s) => s !== null && s !== undefined);

  progressBar.stop();

  return categories;
}

export default async function seedCategoriesData({
  seedDataToStrapi,
}: {
  seedDataToStrapi: boolean;
}) {
  try {
    console.log("Started the seeding category data");
    const notionClient = await getNotionClient();

    const { properties } = await getDatabaseProperties(
      notionClient,
      NOTION_CATAGORIES_DATABASE_ID
    );

    const pageItems = await getDatabasePages(
      notionClient,
      NOTION_CATAGORIES_DATABASE_ID,
      undefined,
      [],
      false
    );

    if (seedDataToStrapi) {
      await processAndSeedCategoryPagesToStrapi(
        pageItems,
        "Categories",
        properties
      );
    } else {
      await processAndSeedCategoryPages(pageItems, "Categories", properties);
    }

    console.log("Completed the seeding category data");

    return;
  } catch (e) {
    console.log("Some unexpected exception occured => ", e);
  }
}
