import getEnvVar from "./getEnvVars";

export const REPOSITORY_DATABASE_ID = getEnvVar(
  "NOTION_REPOSITORY_DATABASE_ID",
  true
) as string;

export const propertyIds = {
  name: getEnvVar("NOTION_RESOURCE_TITLE_ID", true) as string,
  country: getEnvVar("NOTION_COUNTRY_ID", true) as string,
  tags: getEnvVar("NOTION_TAGS_ID", true) as string,
  city: getEnvVar("NOTION_CITY_ID", true) as string,
  credebility: getEnvVar("NOTION_CREDEBILITY_ID", true) as string,
  category: getEnvVar("NOTION_CATEGORY_ID", true) as string,
  state: getEnvVar("NOTION_STATE_ID", true) as string,
  description: getEnvVar("NOTION_DESC_ID", true) as string,
  link: getEnvVar("NOTION_RESOURCE_LINK_ID", true) as string,
};

export const NOTION_API_SECRET = getEnvVar("NOTION_API_SECRET", true) as string;
