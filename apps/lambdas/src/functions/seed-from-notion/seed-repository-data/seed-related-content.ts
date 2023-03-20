import { db, Prisma } from "@ms/clients";
import { getNotionClient } from "../../../common/notion-helpers/client";
import getDatabaseProperties from "../../../common/notion-helpers/get-database-properties";
import {
  getPropertyValue,
  getPrismaValues,
  PrismaValueMapper,
  generateConnectClause,
  downloadAndUploadFile,
} from "../../../common/helper/get-prisma-object";
import getDatabasePages from "../../../common/notion-helpers/get-database-pages";
import Joi from "joi";
import chalk from "chalk";
import sendSlackMessage from "../../../common/slack/send-slack-message";
import { NOTION_RELATED_CONTENT_DATABASE_ID } from "../../../common/utils/consts";
import {
  generateJoiErrorMessageBody,
  generatePrismaErrorMessageBody,
} from "../../../common/slack/generate-message-body";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import pMap from "p-map";
import { isFullPage } from "@notionhq/client";
import getPropertiesByNotionId from "../../../common/helper/get-properties-by-id";
import { seedSelectOptionsForRelatedContent } from "../../../common/helper/seed-multiselect-options";
import { RelatedContentCreateInputSchemaObject } from "@ms/clients/build/joi-types/schemas/objects/RelatedContentCreateInput.schema";
import {
  fetchPaginatedData,
  uploadFileToStrapi,
} from "../../../common/strapi/api";
import { strapiConnectClause } from "../../../common/helper/strapi";
import strapi from "./../../../common/strapi/client";

const progressBar = new cliProgress.SingleBar({
  format:
    "Inserting Related content Data: " +
    colors.yellow("{bar}") +
    "| {percentage}% || {value}/{total} || ETA: {eta}s || Elapsed: {duration}s",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

type RelatedContentNotionToPrismaPropertyMap = PrismaValueMapper<
  Prisma.RelatedContentUpsertArgs["create"]
>;

const relatedContentToPrismaMap: RelatedContentNotionToPrismaPropertyMap = {
  title: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "title"),
  description: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "QYbt", true),
  Category: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "Zk%60F"),
  RelatedContentType: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "dzzj"),
  archive: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "s%7D%3AF"),
  notionLastUpdatedAt: (page) =>
    isFullPage(page) ? new Date(page.last_edited_time) : null,
  notionItemId: (page) => page.id,
  media: (page, propertiesByNotionId) =>
    downloadAndUploadFile(page, propertiesByNotionId, "nG%5D%3D"),
  videoUrl: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "YiX%3F"),
};

const relatedContentToPrismaMapForStrapi: RelatedContentNotionToPrismaPropertyMap =
  {
    ...relatedContentToPrismaMap,
    media: (page, propertiesByNotionId) =>
      downloadAndUploadFile(page, propertiesByNotionId, "nG%5D%3D", "STRAPI"),
    RelatedContentType: (page, propertiesByNotionId) =>
      getPropertyValue(page, propertiesByNotionId, "dzzj"),
  };

const getNotionItemIdToCategoryId = async (): Promise<
  Record<string, number>
> => {
  const categoriesData = await fetchPaginatedData<{
    id: number;
    attributes: { notionItemId: string };
  }>("/categories", ["notionItemId"]);

  const notionItemIdToCategoryId: Record<string, number> = {};

  for (const category of categoriesData) {
    notionItemIdToCategoryId[category.attributes.notionItemId] = category.id;
  }

  console.log(
    "Total Category data found:",
    Object.keys(notionItemIdToCategoryId).length
  );

  return notionItemIdToCategoryId;
};

async function processAndSeedRelatedContentPagesToStrapi(
  pageItems: Awaited<ReturnType<typeof getDatabasePages>>,
  databaseName: string,
  properties: GetDatabaseResponse["properties"]
) {
  const notionItemIdToCategoryId = await getNotionItemIdToCategoryId();
  // pageItems = pageItems.slice(0, 1);

  await pMap(pageItems, async (pageItem) => {
    const relatedContent = await getPrismaValues<
      Prisma.CategoryUpsertArgs["create"]
    >(properties, pageItem, relatedContentToPrismaMapForStrapi);

    if (!relatedContent || relatedContent.archive || !relatedContent.title) {
      return;
    }

    const categoryConnectClause = strapiConnectClause(
      "notionItemId",
      relatedContent.Category as {
        connect?: { notionItemId: string } | Array<{ notionItemId: string }>;
      },
      (id) => notionItemIdToCategoryId[id]
    );

    try {
      const reqBody = {
        data: {
          title: relatedContent.title,
          description: relatedContent.description,
          notionItemId: relatedContent.notionItemId,
          archive: relatedContent.archive,
          media: relatedContent.media,
          RelatedContentType: relatedContent.RelatedContentType.options.name,
          Category: categoryConnectClause,
          videoUrl: relatedContent.videoUrl,
        },
      };

      const response = await strapi.post("/related-contents", reqBody);
      return response.data;
    } catch (e) {
      if (e.response) {
        console.log(
          chalk.red(
            "Response error: ",
            JSON.stringify(e.response.data),
            JSON.stringify(pageItem)
          )
        );
      } else if (e.request) {
        console.log(chalk.red("Request error: ", JSON.stringify(e.request)));
      } else {
        console.log(chalk.red("err", e));
      }
    }
  });
}

async function processAndSeedCategoryPages(
  pageItems: Awaited<ReturnType<typeof getDatabasePages>>,
  databaseName: string,
  properties: GetDatabaseResponse["properties"]
) {
  const fecthedPages = new Set();
  progressBar.start(pageItems.length, 0);

  const pages = await pMap(pageItems, async (page) => {
    if (fecthedPages.has(page.id)) {
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
    >(properties, page, relatedContentToPrismaMap);

    const relatedContentSchema = Joi.object().keys(
      RelatedContentCreateInputSchemaObject
    );

    const { error, value: validValues } = relatedContentSchema.validate(
      prismaValues,
      {
        abortEarly: false,
        allowUnknown: true,
      }
    );
    if (error) {
      console.log(
        chalk.bgYellow(
          "RelatedContent name: ",
          prismaValues?.name,
          " URL: ",
          pageItem.notionPageUrl
        ),
        chalk.bgBlue(error)
      );
      if (prismaValues?.name && !prismaValues?.archive) {
        sendSlackMessage(
          generateJoiErrorMessageBody(
            pageItem.notionPageUrl!,
            prismaValues.name as string,
            error
          ),
          false
        );
      }
      return;
    }

    if (validValues) {
      await db.relatedContent
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
    fecthedPages.add(page.id);
    progressBar.update(fecthedPages.size);
  });

  progressBar.stop();

  return pages;
}

export default async function seedRelatedContent({
  seedDataToStrapi,
}: {
  seedDataToStrapi: boolean;
}) {
  try {
    console.log("Started the seeding related content data");
    const notionClient = await getNotionClient();

    const { properties } = await getDatabaseProperties(
      notionClient,
      NOTION_RELATED_CONTENT_DATABASE_ID
    );

    const pageItems = await getDatabasePages(
      notionClient,
      NOTION_RELATED_CONTENT_DATABASE_ID,
      undefined,
      [],
      false
    );

    if (seedDataToStrapi) {
      await processAndSeedRelatedContentPagesToStrapi(
        pageItems,
        "Categories",
        properties
      );
    } else {
      const propertiesByNotionId = getPropertiesByNotionId(properties);

      await seedSelectOptionsForRelatedContent(propertiesByNotionId);

      await processAndSeedCategoryPages(pageItems, "Categories", properties);
    }

    console.log("Completed the seeding related content data");
    return;
  } catch (e) {
    console.log("Some unexpected exception occured => ", e);
  }
}
