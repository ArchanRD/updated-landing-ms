import {
  PageObjectResponse,
  RichTextItemResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";
import { ValueOf } from "type-fest";

const annotateText = (node: TextRichTextItemResponse, tag = "span") => {
  const { annotations } = node;
  let nodeJsx: React.ReactNode = node.text.content.replace(
    /(?:\r\n|\r|\n)/g,
    "<br>"
  );
  if (annotations.bold) {
    nodeJsx = `<strong>${nodeJsx}</strong>`;
  }
  if (annotations.italic) {
    nodeJsx = `<i>${nodeJsx}</i>`;
  }
  if (annotations.code) {
    nodeJsx = `<code>${nodeJsx}</code>`;
  }

  if (nodeJsx === node.text.content) {
    nodeJsx = `<${tag}>${nodeJsx}</${tag}>`;
  }

  if (node.text.link?.url) {
    nodeJsx = `<a target="_blank" href="${node.text.link.url}">${nodeJsx}</a>`;
  }
  return nodeJsx;
};

const renderRichText = (richText: RichTextItemResponse[], tag = "span") => {
  return richText
    .map((richTextNode) => {
      switch (richTextNode.type) {
        case "text":
          return annotateText(richTextNode, tag);

        default:
          return `<></>`;
      }
    })
    .join("");
};

function refineProperty(
  propertyItem: ValueOf<PageObjectResponse["properties"]>
) {
  switch (propertyItem.type) {
    case "title":
      return propertyItem.title.map((t) => t.plain_text).join(" ");
    case "checkbox":
      return propertyItem.checkbox;
    case "number":
      return propertyItem.number;
    case "rich_text":
      return {
        plainText: propertyItem.rich_text.map((rt) => rt.plain_text).join(""),
        richText: renderRichText(propertyItem.rich_text),
      };
    case "created_time":
      return new Date(propertyItem.created_time);
    case "date":
      return propertyItem.date;
    case "email":
      return propertyItem.email;
    case "files": {
      const file = propertyItem.files[0];
      if (file?.type === "file") {
        return file.file.url;
      } else if (
        file?.type === "external" &&
        file.external.url?.startsWith("http")
      ) {
        return file.external.url;
      }
      return null;
    }
    case "url":
      return propertyItem.url;
    case "select": {
      return {
        options: propertyItem.select,
        type: propertyItem.type,
      };
    }
    case "multi_select": {
      return {
        options: propertyItem.multi_select,
        type: propertyItem.type,
      };
    }
    case "phone_number":
      return propertyItem.phone_number;
    case "formula": {
      switch (propertyItem.formula.type) {
        case "boolean":
          return propertyItem.formula.boolean;
        case "date":
          return propertyItem.formula.date;
        case "number":
          return propertyItem.formula.number;
        case "string":
          return propertyItem.formula.string;
      }
    }
    case "relation": {
      return {
        type: "relation",
        options: propertyItem.relation,
      };
    }
    default:
      return propertyItem;
  }
}

export default function processProperties(
  properties: PageObjectResponse["properties"]
) {
  const processedProperties: Record<
    string,
    ReturnType<typeof refineProperty>
  > = {};
  return Object.entries(properties).reduce(
    (prevValue, [propertyKey, propertyValue]) => {
      prevValue[propertyKey] = refineProperty(propertyValue);
      return prevValue;
    },
    processedProperties
  );
}
