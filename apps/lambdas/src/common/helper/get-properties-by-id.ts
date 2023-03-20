import { GetDatabaseResponse } from "@notionhq/client/build/src/api-endpoints";
import { ValueOf } from "type-fest";

export default function getPropertiesByNotionId(
  properties: GetDatabaseResponse["properties"]
) {
  const propertiesByNotionId = {} as Record<
    string,
    ValueOf<GetDatabaseResponse["properties"]>
  >;
  Object.values(properties).map(
    (value) => (propertiesByNotionId[value.id] = value)
  );
  return propertiesByNotionId;
}
