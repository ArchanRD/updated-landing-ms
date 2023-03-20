import { db, Prisma } from "@ms/clients";
import {
  getNotionClient,
  NotionClient,
} from "../../../common/notion-helpers/client";
import getDatabaseProperties from "../../../common/notion-helpers/get-database-properties";
import slugify from "slugify";
import {
  downloadAndUploadFile,
  generateConnectClause,
  getPrismaValues,
  getPropertyValue,
  PrismaValueMapper,
} from "../../../common/helper/get-prisma-object";
import chalk from "chalk";
import getPropertiesByNotionId from "../../../common/helper/get-properties-by-id";
import { seedSelectOptionsForResources } from "../../../common/helper/seed-multiselect-options";
import { ResourceCreateInputSchemaObject } from "@ms/clients/build/joi-types/schemas/objects/ResourceCreateInput.schema";
import Joi from "joi";
import getDatabasePages from "../../../common/notion-helpers/get-database-pages";
import {
  PageObjectResponse,
  PartialPageObjectResponse,
  GetDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";
import groupBy from "lodash.groupby";
import { isFullPage } from "@notionhq/client";
import pMap from "p-map";
import colors from "ansi-colors";
import cliProgress from "cli-progress";
import sendSlackMessage from "../../../common/slack/send-slack-message";
import {
  generateJoiErrorMessageBody,
  generatePrismaErrorMessageBody,
} from "../../../common/slack/generate-message-body";
import { NOTION_REPOSITORY_DATABASE_ID } from "../../../common/utils/consts";
import { fetchPaginatedData } from "../../../common/strapi/api";
import strapi from "../../../common/strapi/client";
import { strapiConnectClause } from "./../../../common/helper/strapi";

// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar({
  format:
    "Inserting Reources Data: " +
    colors.yellow("{bar}") +
    "| {percentage}% || {value}/{total} || ETA: {eta}s || Elapsed: {duration}s",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

type ResourcesNotionToPrismaPropertyMap = PrismaValueMapper<
  Prisma.ResourceUpsertArgs["create"]
>;
const resourcesToPrismaMap: ResourcesNotionToPrismaPropertyMap = {
  name: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "title"),
  slug: (page, propertiesByNotionId) => {
    const name = page.processedProperties?.[propertiesByNotionId.title.name];
    return name && typeof name === "string"
      ? slugify(name, { strict: true })?.toLowerCase()
      : null;
  },
  address: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "%3CPce"),
  email: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "DP%3Bo"),
  description: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "%3AjjV"),
  shortDescription: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "iWEt"),
  url: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "aFDC"),
  mobileNumber: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "FY%3Cp"),
  analyticsURL: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "%3EeM%40"),
  notionLastUpdatedAt: (page) =>
    isFullPage(page) ? new Date(page.last_edited_time) : null,
  notionItemId: (page) => page.id,
  logo: (page, propertiesByNotionId) =>
    downloadAndUploadFile(page, propertiesByNotionId, "yXMH"),
  tags: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "NZnb"),
  state: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "Yh%3E%7D"),
  city: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "S%3CV%60"),
  type: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "mWb%40"),
  country: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "Cx%3Cr"),
  category: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "bT%3Af"),
  archive: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "JShC"),
};

const resourcesToPrismaMapForStrapi: ResourcesNotionToPrismaPropertyMap = {
  ...resourcesToPrismaMap,
  logo: (page, propertiesByNotionId) =>
    downloadAndUploadFile(page, propertiesByNotionId, "yXMH", "STRAPI"),
  state: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "Yh%3E%7D"),
  city: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "S%3CV%60"),
  country: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "Cx%3Cr"),
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

  console.log(notionItemIdToCategoryId);

  return notionItemIdToCategoryId;
};

const getNotionItemIdToTagId = async (): Promise<Record<string, number>> => {
  const existingTagsDetailsFromStrapi = await fetchPaginatedData<{
    id: number;
    attributes: { notionItemId: string; name: string };
  }>("/tags", ["notionItemId", "name"]);

  const notionItemIdToStrapiId: Record<string, number> = {};

  for (const tagInfo of existingTagsDetailsFromStrapi) {
    notionItemIdToStrapiId[tagInfo.attributes.notionItemId] = tagInfo.id;
  }

  console.log(`Found ${Object.keys(notionItemIdToStrapiId).length} tags`);

  return notionItemIdToStrapiId;
};

async function processAndSeedResourcePagesToStrapi(
  notionResourceItems: Awaited<ReturnType<typeof getDatabasePages>>,
  databaseName: string,
  properties: GetDatabaseResponse["properties"]
) {
  console.log("Starting");
  const fetchedItems = new Set();

  const notionItemIdToCategoryId = await getNotionItemIdToCategoryId();

  const notionItemIdToTagId = await getNotionItemIdToTagId();

  // notionResourceItems = notionResourceItems.slice(0, 10);
  const existingResources = await strapi.get("/resources");
  const existingResourcesMap = new Map();

  if (existingResources.data.data) {
    const resources = existingResources.data.data;
    resources.forEach((resource) => {
      existingResourcesMap.set(resource.attributes.name, resource);
    });
  }

  const resources = await pMap(
    notionResourceItems,
    async (notionResourceItem) => {
      if (fetchedItems.has(notionResourceItem.id)) {
        throw new Error(`[${databaseName}]: Page has already been processed!`);
      }

      const resource = await getPrismaValues<
        Prisma.ResourceUpsertArgs["create"]
      >(properties, notionResourceItem, resourcesToPrismaMapForStrapi);

      if (!resource || resource.archive || !resource.name) {
        return;
      }

      const categoryConnectClause = strapiConnectClause(
        "notionItemId",
        resource.category as {
          connect?: { notionItemId: string } | Array<{ notionItemId: string }>;
        },
        (id) => notionItemIdToCategoryId[id]
      );

      const tagConnectClause = strapiConnectClause(
        "notionItemId",
        resource.tags as {
          connect?: { notionItemId: string } | Array<{ notionItemId: string }>;
        },
        (id) => notionItemIdToTagId[id]
      );

      try {
        const reqBody = {
          data: {
            shortDescription: resource.shortDescription,
            description: resource.description,
            notionItemId: resource.notionItemId,
            name: resource.name,
            slug: resource.slug,
            url: resource.url,
            analyticsURL: resource.analyticsURL,
            email: resource.email,
            mobileNumber: resource.mobileNumber,
            address: [
              {
                __component: "address.address",
                address: resource.address,
                cityInfo: {
                  country: resource.country?.options?.name,
                  state: resource.state?.options?.name,
                  city: resource.city?.options?.name,
                },
              },
            ],
            logo: resource.logo,
            archive: resource.archive,
            category: categoryConnectClause,
            tags: tagConnectClause,
          },
        };

        if (existingResourcesMap.has(resource.name)) {
          const existingResource = existingResourcesMap.get(resource.name);
          delete reqBody.data.name;
          console.log("doing put");
          const response = await strapi.put(
            `/resources/${existingResource.id}`,
            reqBody
          );
          return response.data;
        }
        console.log("doing post");

        const response = await strapi.post("/resources", reqBody);
        return response.data;
      } catch (e) {
        if (e.response) {
          console.log(
            chalk.red(
              "Response error: ",
              JSON.stringify(e.response.data, null, 2)
              // JSON.stringify(notionResourceItem)
            )
          );
        }
        // else if (e.request) {
        //   console.log(chalk.red("Request error: ", JSON.stringify(e.request)));
        // } else {
        //   console.log(chalk.red("err", e));
        // }
        // console.log(JSON.stringify({ e }, null, 2));
      }
    },
    { concurrency: 1 }
  );

  console.log(resources.length);
}

async function findResourcesToCreateOrUpdate(
  pageItems: Awaited<ReturnType<typeof getDatabasePages>>,
  propertiesByNotionId: ReturnType<typeof getPropertiesByNotionId>
) {
  const existingResources = await db.resource.findMany({
    select: {
      id: true,
      notionItemId: true,
      notionLastUpdatedAt: true,
    },
  });

  const existingResourcesSet = new Set(
    existingResources.map((er) => er.notionItemId!)
  );
  const notionResourcesSet = new Set(pageItems.map((p) => p.id));
  const archivedPageItems = new Set(
    pageItems
      .filter((p) => {
        const archive = getPropertyValue(p, propertiesByNotionId, "JShC");
        return archive;
      })
      .map((p) => p.id)
  );

  const itemsToDelete = Array.from(existingResourcesSet).filter(
    (id) => !notionResourcesSet.has(id) || archivedPageItems.has(id)
  );

  console.log("Deleting items", ...itemsToDelete);

  await db.resource
    .deleteMany({
      where: {
        notionItemId: {
          in: itemsToDelete,
        },
      },
    })
    .catch((e) => console.log(chalk.red("Error deleting items", e)));

  const existingResourcesByNotionItemId = groupBy(
    existingResources,
    "notionItemId"
  );

  const invalidItems: (PageObjectResponse | PartialPageObjectResponse)[] = [];
  const archivedItems: (PageObjectResponse | PartialPageObjectResponse)[] = [];

  const notionPagesToUpsert = pageItems.filter((pageItem) => {
    const pageId = pageItem.id;
    const titleObj = isFullPage(pageItem)
      ? pageItem.properties[propertiesByNotionId.title.name]
      : null;

    const title =
      titleObj?.type === "title"
        ? titleObj.title.map((t) => t.plain_text).join(" ")
        : null;
    if (!title) {
      invalidItems.push(pageItem);
      return false;
    }

    const archiveObj = isFullPage(pageItem)
      ? pageItem.properties[propertiesByNotionId["JShC"].name]
      : null;
    const archived =
      archiveObj?.type === "checkbox" ? archiveObj.checkbox : null;
    if (archived) {
      archivedItems.push(pageItem);
    }

    const resourceFromDB = existingResourcesByNotionItemId?.[pageId]?.[0];
    const notionPageLastUpdatedAt = isFullPage(pageItem)
      ? new Date(pageItem.last_edited_time)
      : "";
    if (resourceFromDB && notionPageLastUpdatedAt) {
      if (resourceFromDB?.notionLastUpdatedAt < notionPageLastUpdatedAt) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  });

  console.log(
    "Total Resources: ",
    chalk.bgGreen(pageItems.length),
    " Resources Already created: ",
    chalk.bgGreen(
      pageItems.length -
        notionPagesToUpsert.length -
        invalidItems.length -
        archivedItems.length
    ),
    "Invalid items: ",
    chalk.bgRed(invalidItems.length),
    "Archived Items: ",
    chalk.bgRed(archivedItems.length)
  );

  return notionPagesToUpsert;
}

async function processAndSeedResourcePages(
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
      Prisma.ResourceUpsertArgs["create"]
    >(properties, page, resourcesToPrismaMap);

    const resourceSchema = Joi.object().keys(ResourceCreateInputSchemaObject);

    const { error, value: validValues } = resourceSchema.validate(
      prismaValues,
      {
        abortEarly: false,
        allowUnknown: true,
      }
    );
    if (error) {
      console.log(
        chalk.bgYellow(
          "\nReource name: ",
          prismaValues?.name,
          " URL: ",
          pageItem.notionPageUrl
        )
      );
      console.log(chalk.bgBlue(error));
      if (prismaValues?.name && !prismaValues.archive) {
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
      console.log(
        validValues.archive ? chalk.bgGreen("Archiving") + validValues.name : ""
      );
      if (validValues.archive) {
        await db.resource
          .delete({
            where: {
              notionItemId: validValues.notionItemId,
            },
          })
          .catch((error) =>
            console.log(chalk.red("Failed to delete resource", error))
          );
        return;
      }
      await db.resource
        .upsert({
          create: validValues,
          update: validValues,
          where: {
            notionItemId: validValues.notionItemId,
          },
        })
        .catch((error) => {
          if (!validValues.archive) {
            const { messageBody, isUnknownError } =
              generatePrismaErrorMessageBody(
                pageItem.notionPageUrl!,
                validValues.name,
                error
              );
            console.log(
              JSON.stringify({ messageBody, isUnknownError }, null, 2)
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

export default async function seedResourcesData({
  seedDataToStrapi,
}: {
  seedDataToStrapi: boolean;
}) {
  try {
    console.log("Started the seeding resource data");
    const notionClient = await getNotionClient();

    const { properties } = await getDatabaseProperties(
      notionClient,
      NOTION_REPOSITORY_DATABASE_ID
    );

    // const properties: any = {
    //   "Logo/Image": {
    //     id: "yXMH",
    //     name: "Logo/Image",
    //     type: "files",
    //     files: {},
    //   },
    //   "Resource Name": {
    //     id: "title",
    //     name: "Resource Name",
    //     type: "title",
    //     title: {},
    //   },
    // };

    const propertiesByNotionId = getPropertiesByNotionId(properties);
    // await seedSelectOptionsForResources(propertiesByNotionId, seedDataToStrapi);

    const pageItems = await getDatabasePages(
      notionClient,
      NOTION_REPOSITORY_DATABASE_ID,
      undefined,
      [],
      false
    );

    if (seedDataToStrapi) {
      await processAndSeedResourcePagesToStrapi(
        pageItems,
        "ResourcesDatabase",
        properties
      );
    } else {
      const filteredPageItems = await findResourcesToCreateOrUpdate(
        pageItems,
        propertiesByNotionId
      );

      await processAndSeedResourcePages(
        filteredPageItems,
        "ResourcesDatabase",
        properties
      );
    }

    console.log("Completed the seeding resource data");

    return;
  } catch (e) {
    console.log("Some unexpected exception occured => ", e);
  }
}
