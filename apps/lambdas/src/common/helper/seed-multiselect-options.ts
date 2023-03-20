import { db, Prisma } from "@ms/clients";
import chalk from "chalk";
import { fetchPaginatedData } from "./../strapi/api";
import strapi from "./../strapi/client";

const selectOptions = {
  country: "Cx%3Cr",
  state: "Yh%3E%7D",
  tags: "NZnb",
  city: "S%3CV%60",
  type: "mWb%40",
  relatedContentType: "dzzj",
};

function getOptions(
  propertiesByNotionId,
  propertyName: keyof typeof selectOptions
) {
  const propertyId = selectOptions[propertyName];
  const values = propertiesByNotionId[propertyId];

  let options: Array<{ id: string; name: string }> = [];
  if (values.type === "multi_select") {
    options = values.multi_select.options;
  } else if (values.type === "select") {
    options = values.select.options;
  }
  return options;
}

async function seedCountries(propertiesByNotionId) {
  const options = getOptions(propertiesByNotionId, "country");

  return Promise.all(
    options.map((opt) => {
      return db.country.upsert({
        create: {
          name: opt.name,
          notionItemId: opt.id,
        },
        update: {
          name: opt.name,
        },
        where: {
          notionItemId: opt.id,
        },
      });
    })
  );
}

async function seedStates(propertiesByNotionId) {
  const options = getOptions(propertiesByNotionId, "state");

  return Promise.all(
    options.map((opt) => {
      return db.state.upsert({
        create: {
          name: opt.name,
          notionItemId: opt.id,
        },
        update: {
          name: opt.name,
        },
        where: {
          notionItemId: opt.id,
        },
      });
    })
  );
}

async function seedCities(propertiesByNotionId) {
  const options = getOptions(propertiesByNotionId, "city");

  return Promise.all(
    options.map((opt) => {
      return db.city
        .upsert({
          create: {
            name: opt.name,
            notionItemId: opt.id,
          },
          update: {
            name: opt.name,
          },
          where: {
            notionItemId: opt.id,
          },
        })
        .catch((error) => {
          if (error instanceof Prisma.PrismaClientKnownRequestError) {
            console.log(chalk.bgRed(error));
          } else {
            console.log(error);
          }
        });
    })
  );
}

async function seedTags(propertiesByNotionId) {
  const options = getOptions(propertiesByNotionId, "tags");

  return Promise.all(
    options.map((opt) => {
      return db.tags.upsert({
        create: {
          name: opt.name,
          notionItemId: opt.id,
        },
        update: {
          name: opt.name,
        },
        where: {
          notionItemId: opt.id,
        },
      });
    })
  );
}

async function seedTagsToStrapi(propertiesByNotionId) {
  const notionTagsDetails = getOptions(propertiesByNotionId, "tags");

  if (notionTagsDetails.length > 0) {
    const existingTagsDetailsFromStrapi = await fetchPaginatedData<{
      id: number;
      attributes: { notionItemId: string; name: string };
    }>("/tags", ["notionItemId", "name"]);

    const notionItemIdToTagDetails: Record<
      string,
      {
        id: number;
        attributes: { notionItemId: string; name: string };
      }
    > = {};

    for (const tagInfo of existingTagsDetailsFromStrapi) {
      notionItemIdToTagDetails[tagInfo.attributes.notionItemId] = tagInfo;
    }

    for (const notionTagInfo of notionTagsDetails) {
      const existingStrapiTagInfo = notionItemIdToTagDetails[notionTagInfo.id];
      if (existingStrapiTagInfo) {
        // If change in name -> update tag
        if (existingStrapiTagInfo.attributes.name !== notionTagInfo.name) {
          console.log(
            `Updating tag because found change in tag name. Old tag name: ${existingStrapiTagInfo.attributes.name}, new tag name: ${notionTagInfo.name}`
          );
          const response = await strapi.put(`/tags/${notionTagInfo.id}`, {
            data: { name: notionTagInfo.name },
          });

          notionItemIdToTagDetails[notionTagInfo.id] = response.data.data;
        }
      } else {
        // Create tag if not exist in strapi & update cache
        console.log(
          `Creating new tag for tag name: ${notionTagInfo.name}, notionItemId: ${notionTagInfo.id}`
        );
        const response = await strapi.post("/tags", {
          data: {
            name: notionTagInfo.name,
            notionItemId: notionTagInfo.id,
          },
        });

        notionItemIdToTagDetails[notionTagInfo.id] = response.data.data;
      }
    }
  }
}

async function seedTypes(propertiesByNotionId) {
  const options = getOptions(propertiesByNotionId, "type");

  return Promise.all(
    options.map((opt) => {
      return db.resourceType.upsert({
        create: {
          name: opt.name,
          notionItemId: opt.id,
        },
        update: {
          name: opt.name,
        },
        where: {
          notionItemId: opt.id,
        },
      });
    })
  );
}
async function seedRelatedContentTypes(propertiesByNotionId) {
  const options = getOptions(propertiesByNotionId, "relatedContentType");

  return Promise.all(
    options.map((opt) => {
      return db.relatedContentType.upsert({
        create: {
          name: opt.name,
          notionItemId: opt.id,
        },
        update: {
          name: opt.name,
        },
        where: {
          notionItemId: opt.id,
        },
      });
    })
  );
}

export async function seedSelectOptionsForResources(
  propertiesByNotionId,
  seedDataToStrapi: boolean
) {
  if (seedDataToStrapi) {
    await seedTagsToStrapi(propertiesByNotionId);
  } else {
    await seedCountries(propertiesByNotionId);
    await seedStates(propertiesByNotionId);
    await seedCities(propertiesByNotionId);
    await seedTags(propertiesByNotionId);
    await seedTypes(propertiesByNotionId);
  }
}

export async function seedSelectOptionsForRelatedContent(propertiesByNotionId) {
  await seedRelatedContentTypes(propertiesByNotionId);
}
