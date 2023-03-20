import {
  GetDatabaseResponse,
  SelectPropertyItemObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";
import slugify from "slugify";
import getDatabasePages from "../notion-helpers/get-database-pages";
import getEnvVar from "../utils/get-env-var";
import { downloadFileFromURLAndUploadToS3 } from "../utils/upload-notion-media-to-s3";
import getPropertiesByNotionId from "./get-properties-by-id";
import { uploadFileToStrapi } from "./../strapi/api";

const S3_BUCKET_MS_IMAGES = getEnvVar("S3_BUCKET_MS_IMAGES", true);

export type PrismaValueMapperFn = (
  page: Awaited<ReturnType<typeof getDatabasePages>>[0],
  propertiesByNotionId: ReturnType<typeof getPropertiesByNotionId>
) =>
  | ReturnType<typeof getPropertyValue>
  | ReturnType<typeof downloadAndUploadFile>
  | ReturnType<typeof generateConnectClause>;

export type PrismaValueMapper<T extends Record<string, unknown>> = Partial<
  Record<keyof T, PrismaValueMapperFn>
>;

export async function getPrismaValues<T extends Record<string, unknown>>(
  properties: GetDatabaseResponse["properties"],
  page: Awaited<ReturnType<typeof getDatabasePages>>[0],
  notionToPrismaMap: PrismaValueMapper<T>
) {
  try {
    const propertiesByNotionId = getPropertiesByNotionId(properties);

    const keys = Object.keys(notionToPrismaMap);

    const prismaValues: {
      [key: string]: Awaited<ReturnType<PrismaValueMapperFn>>;
    } = {};

    for await (const key of keys) {
      const valueAccessor = notionToPrismaMap[key];
      const value = await valueAccessor?.(page, propertiesByNotionId);

      if (value) {
        prismaValues[key] = value;
      }
    }

    return prismaValues;
  } catch (error) {
    console.log(error);
  }
}

export function getPropertyValue(
  page: Awaited<ReturnType<typeof getDatabasePages>>[0],
  propertiesByNotionId: ReturnType<typeof getPropertiesByNotionId>,
  propertyId: string,
  renderRichText: boolean = false
) {
  const value =
    page.processedProperties?.[propertiesByNotionId?.[propertyId]?.name];
  if (
    value &&
    propertiesByNotionId?.[propertyId].type === "rich_text" &&
    typeof value === "object" &&
    "richText" in value &&
    "plainText" in value
  ) {
    return renderRichText ? value?.richText : value?.plainText;
  }
  return value;
}

export async function downloadAndUploadFile(
  page: Awaited<ReturnType<typeof getDatabasePages>>[0],
  propertiesByNotionId: ReturnType<typeof getPropertiesByNotionId>,
  propertyId: string,
  destination: "STRAPI" | "S3" = "S3",
  filePath = "resources/logos/"
) {
  const url = page.processedProperties?.[
    propertiesByNotionId?.[propertyId].name
  ] as string;
  const resourceName = page.processedProperties?.[
    propertiesByNotionId.title.name
  ] as string;

  if (url) {
    switch (destination) {
      case "S3":
        return downloadFileFromURLAndUploadToS3({
          bucket: S3_BUCKET_MS_IMAGES,
          url: url,
          filePath,
          fileName: slugify(resourceName, { strict: true }) + "-" + page.id,
        });

      case "STRAPI":
        return uploadFileToStrapi(
          url,
          slugify(resourceName, { strict: true }) + "-" + page.id
        );
    }
  }
  return null;
}

export function generateConnectClause(
  page: Awaited<ReturnType<typeof getDatabasePages>>[0],
  propertiesByNotionId: ReturnType<typeof getPropertiesByNotionId>,
  propertyId: string,
  connectIdKey: string = "notionItemId"
) {
  const propertyItem =
    page.processedProperties?.[propertiesByNotionId?.[propertyId]?.name];

  if (
    propertyItem &&
    typeof propertyItem === "object" &&
    "type" in propertyItem
  ) {
    if (propertyItem && propertyItem.type === "select") {
      const item =
        propertyItem.options as SelectPropertyItemObjectResponse["select"];
      if (!item?.id) {
        return null;
      }
      return {
        connect: {
          [connectIdKey]: item.id,
        },
      };
    }

    if (propertyItem.type === "relation") {
      const propertyConfig = propertiesByNotionId[propertyId];

      if (propertyConfig.type === "relation") {
        if (propertyConfig.relation.type === "single_property") {
          return {
            connect: propertyItem.options.map((opt) => {
              return {
                [connectIdKey]: opt.id,
              };
            })[0],
          };
        } else {
          return {
            connect: propertyItem.options.map((opt) => {
              return {
                [connectIdKey]: opt.id,
              };
            }),
          };
        }
      }
    }
    if (propertyItem.type === "multi_select") {
      return {
        connect: propertyItem.options.map((opt) => {
          return {
            [connectIdKey]: opt.id,
          };
        }),
      };
    }
  }
}
