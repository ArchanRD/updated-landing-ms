import { GetPagePropertyResponse } from "@notionhq/client/build/src/api-endpoints";
import chalk from "chalk";
import { downloadFileFromURLAndUploadToS3 } from "../utils/upload-notion-media-to-s3";

export const refinePageProperties = (propertyItem: GetPagePropertyResponse) => {
  if (propertyItem.object === "property_item") {
    // // If Select
    if (propertyItem.type === "select") {
      return {
        options: propertyItem.select,
        type: "select",
      };
    }

    if (propertyItem.type === "title") {
      return propertyItem.title.plain_text;
    }

    // `If Multi_select
    if (propertyItem.type === "multi_select") {
      return {
        options: propertyItem.multi_select,
        type: "multi_select",
      };
    }

    if (propertyItem.type === "formula") {
      return propertyItem.formula.type === "string"
        ? propertyItem.formula.string
        : null;
    }

    if (propertyItem.type === "email") {
      return propertyItem.email;
    }

    if (propertyItem.type === "checkbox") {
      return propertyItem.checkbox;
    }

    if (propertyItem.type === "created_time") {
      return propertyItem.created_time;
    }
    if (propertyItem.type === "created_by") {
      return propertyItem.created_by === null ? null : propertyItem.created_by;
    }
    // If url
    if (propertyItem.type === "phone_number") return propertyItem.phone_number;

    if (propertyItem.type === "url") return propertyItem.url;

    if (propertyItem.type === "files") {
      const file = propertyItem.files?.[0];
      if (file?.type === "file") {
        return file.file.url;
      }
      return null;
    }

    return propertyItem;
  } else if (propertyItem.object === "list") {
    const results = propertyItem.results;

    if (propertyItem.property_item.type === "relation") {
      const relationItems = results.map((res) => {
        if (res.type === "relation") {
          return res.relation;
        }
      });
      return {
        type: "relation",
        options: relationItems,
      };
    }
    if (propertyItem.property_item.type === "rich_text") {
      return results
        .map((res) => {
          if (res.type === "rich_text") return res["rich_text"]["plain_text"];
        })
        .join("");
    }
    if (propertyItem.property_item.type === "title") {
      return results
        .map((res) => {
          if (res.type === "title") return res["title"]["plain_text"];
        })
        .join("");
    }
  }

  return "";
};
// NUMBER_OF_DAYS;
