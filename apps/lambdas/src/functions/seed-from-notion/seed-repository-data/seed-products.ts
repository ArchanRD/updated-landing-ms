import { db, Prisma } from "@ms/clients";
import { getNotionClient } from "../../../common/notion-helpers/client";
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
import { ProductCreateInputSchemaObject } from "@ms/clients/build/joi-types/schemas/objects/ProductCreateInput.schema";
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
import { NOTION_PRODUCTS_DATABASE_ID } from "../../../common/utils/consts";
import { fetchPaginatedData } from "../../../common/strapi/api";
import strapi from "../../../common/strapi/client";
import { strapiConnectClause } from "../../../common/helper/strapi";
import fs from "node:fs";

// create a new progress bar instance and use shades_classic theme
const progressBar = new cliProgress.SingleBar({
  format:
    "Inserting Products Data: " +
    colors.greenBright("{bar}") +
    "| {percentage}% || {value}/{total} || ETA: {eta}s || Elapsed: {duration}s",
  barCompleteChar: "\u2588",
  barIncompleteChar: "\u2591",
  hideCursor: true,
});

type ProductsNotionToPrismaPropertyMap = PrismaValueMapper<
  Prisma.ProductUpsertArgs["create"]
>;
const productsToPrismaMap: ProductsNotionToPrismaPropertyMap = {
  name: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "title"),
  slug: (page, propertiesByNotionId) => {
    const name = page.processedProperties?.[propertiesByNotionId.title.name];
    return name && typeof name === "string"
      ? slugify(name, { strict: true })?.toLowerCase().slice(0, 250) +
          "-" +
          (Math.random() + 1).toString(36).substring(7)
      : null;
  },
  embedCode: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "NCwH"),
  price: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "BpO~"),
  description: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "sbVO"),
  productLink: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "%3D%60%7Bp"),
  Resource: (page, propertiesByNotionId) =>
    generateConnectClause(page, propertiesByNotionId, "Dffe"),
  notionLastUpdatedAt: (page) =>
    isFullPage(page) ? new Date(page.last_edited_time) : null,
  notionItemId: (page) => page.id,
  archive: (page, propertiesByNotionId) =>
    getPropertyValue(page, propertiesByNotionId, "xDEk"),
  productPhoto: (page, propertiesByNotionId) =>
    downloadAndUploadFile(
      page,
      propertiesByNotionId,
      "Bc%7Be",
      "S3",
      "products/images/"
    ),
};

const productsToPrismaMapForStrapi: ProductsNotionToPrismaPropertyMap = {
  ...productsToPrismaMap,
  productPhoto: (page, propertiesByNotionId) =>
    downloadAndUploadFile(
      page,
      propertiesByNotionId,
      "Bc%7Be",
      "STRAPI",
      "products/images/"
    ),
};

const getNotionItemIdToResourceId = async (): Promise<
  Record<string, number>
> => {
  const resourcesData = await fetchPaginatedData<{
    id: number;
    attributes: { notionItemId: string };
  }>("/resources", ["notionItemId"]);

  const notionItemIdToResourceId: Record<string, number> = {};

  for (const resource of resourcesData) {
    notionItemIdToResourceId[resource.attributes.notionItemId] = resource.id;
  }

  // console.log(notionItemIdToResourceId);

  return notionItemIdToResourceId;
};

const getNotionItemIdToProductSlug = async (): Promise<
  Record<string, number>
> => {
  const productsData = await fetchPaginatedData<{
    id: number;
    attributes: { notionItemId: string };
  }>("/products", ["notionItemId"]);

  const notionItemIdToProductSlug: Record<string, number> = {};

  for (const product of productsData) {
    notionItemIdToProductSlug[product.attributes.notionItemId] = product.id;
  }

  console.log(notionItemIdToProductSlug);

  return notionItemIdToProductSlug;
};

async function processAndSeedProductPagesToStrapi(
  notionProductItems: Awaited<ReturnType<typeof getDatabasePages>>,
  databaseName: string,
  properties: GetDatabaseResponse["properties"]
) {
  const notionItemIdToResourceId = await getNotionItemIdToResourceId();
  const notionItemIdToProductSlug = await getNotionItemIdToProductSlug();
  let processedPages = 0;
  const failed = {};
  progressBar.start(notionProductItems.length, 0);
  const products = await pMap(
    notionProductItems,
    async (notionProductItem) => {
      const product = await getPrismaValues<Prisma.ProductUpsertArgs["create"]>(
        properties,
        notionProductItem,
        productsToPrismaMapForStrapi
      );

      if (!product || product.archive || !product.name) {
        return;
      }

      const resourceConnectClause = strapiConnectClause(
        "notionItemId",
        product.Resource as {
          connect?: { notionItemId: string } | Array<{ notionItemId: string }>;
        },
        (id) => notionItemIdToResourceId[id]
      );

      try {
        const reqBody = {
          data: {
            name: product.name,
            slug: product.slug,
            embbedCode: product.embedCode,
            description: product.description,
            notionItemId: product.notionItemId,
            productLink: product.productLink,
            currency: "INR",
            price: product.price,
            archive: product.archive,
            Resource: resourceConnectClause,
            productPhoto: product.productPhoto,
          },
        };

        if (product.embedCode) {
          console.log(JSON.stringify({ reqBody }, null, 2));
        }

        if (notionItemIdToProductSlug[product.notionItemId]) {
          await strapi.put(
            `/products/${notionItemIdToProductSlug[product.notionItemId]}`,
            reqBody
          );
          console.log(
            "Updated: ",
            notionItemIdToProductSlug[product.notionItemId]
          );
        } else {
          await strapi.post("/products", reqBody);
        }
        progressBar.update(processedPages++);
        return;
      } catch (e) {
        if (e.response) {
          // console.log(
          //   chalk.red(
          //     "Response error: ",
          //     JSON.stringify(e.response.data, null, 2),
          //     JSON.stringify(notionProductItem, null, 2)
          //   )
          // );
          failed[product.name] = e.response.error;
        } else if (e.request) {
          console.log(chalk.red("Request error: ", JSON.stringify(e.request)));
        } else {
          console.log(chalk.red("err", e));
        }
      }
    },
    { concurrency: 1 }
  ).finally(() => progressBar.stop());

  fs.writeFileSync(
    "./product-error.json",
    JSON.stringify(failed, null, 2),
    "utf8"
  );

  console.log("Total products imported: ", products.length);
}

async function findProductsToCreateOrUpdate(
  pageItems: Awaited<ReturnType<typeof getDatabasePages>>,
  propertiesByNotionId: ReturnType<typeof getPropertiesByNotionId>
) {
  const existingProducts = await db.product.findMany({
    select: {
      id: true,
      notionItemId: true,
      notionLastUpdatedAt: true,
    },
  });

  const existingProductsSet = new Set(
    existingProducts.map((er) => er.notionItemId!)
  );
  const notionProductsSet = new Set(pageItems.map((p) => p.id));

  const itemsToDelete = Array.from(existingProductsSet).filter(
    (er) => !notionProductsSet.has(er)
  );

  console.log("Deleting items", ...itemsToDelete);

  await db.product.deleteMany({
    where: {
      notionItemId: {
        in: itemsToDelete,
      },
    },
  });

  const existingProductsByNotionItemId = groupBy(
    existingProducts,
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
      ? pageItem.properties[propertiesByNotionId["xDEk"].name]
      : null;
    const archived =
      archiveObj?.type === "checkbox" ? archiveObj.checkbox : null;
    if (archived) {
      archivedItems.push(pageItem);
      return false;
    }

    const productFromDB = existingProductsByNotionItemId?.[pageId]?.[0];
    const notionPageLastUpdatedAt = isFullPage(pageItem)
      ? new Date(pageItem.last_edited_time)
      : "";
    if (productFromDB && notionPageLastUpdatedAt) {
      if (productFromDB?.notionLastUpdatedAt < notionPageLastUpdatedAt) {
        return true;
      } else {
        return false;
      }
    }
    return true;
  });

  console.log(
    "Total Products: ",
    chalk.bgGreen(pageItems.length),
    " Products Already created: ",
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

async function processAndSeedProductPages(
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
      Prisma.ProductUpsertArgs["create"]
    >(properties, page, productsToPrismaMap);

    const productSchema = Joi.object().keys(ProductCreateInputSchemaObject);

    const { error, value: validValues } = productSchema.validate(prismaValues, {
      abortEarly: false,
      allowUnknown: true,
    });
    if (error) {
      // console.log({prismaValues})
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
      await db.product
        .upsert({
          create: validValues,
          update: validValues,
          where: {
            notionItemId: validValues.notionItemId,
          },
        })
        .catch((error) => {
          console.log(error);
          console.log(JSON.stringify({ validValues }, null, 2));

          if (!validValues.archive) {
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

export default async function seedProductsData({
  seedDataToStrapi,
}: {
  seedDataToStrapi: boolean;
}) {
  try {
    console.log("Started seeding the products data");
    const notionClient = await getNotionClient();

    const { properties } = await getDatabaseProperties(
      notionClient,
      NOTION_PRODUCTS_DATABASE_ID
    );
    const propertiesByNotionId = getPropertiesByNotionId(properties);

    const pageItems = await getDatabasePages(
      notionClient,
      NOTION_PRODUCTS_DATABASE_ID,
      undefined,
      [],
      false
    );

    if (seedDataToStrapi) {
      await processAndSeedProductPagesToStrapi(
        pageItems,
        "ProductsDatabase",
        properties
      );
    } else {
      const filteredPageItems = await findProductsToCreateOrUpdate(
        pageItems,
        propertiesByNotionId
      );

      await processAndSeedProductPages(
        filteredPageItems,
        "ProductsDatabase",
        properties
      );
    }

    console.log("Completed the seeding products data");

    return;
  } catch (e) {
    console.log("Some unexpected exception occured => ", e);
  }
}
