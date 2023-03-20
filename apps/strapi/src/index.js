"use strict";
const { sanitizeArgs } = require("./utils/sanitizeArguments");
const fuzzysort = require("fuzzysort");
module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code
   */
  register({ strapi }) {
    const extensionService = strapi.service("plugin::graphql.extension");

    extensionService.use(({ strapi }) => ({
      typeDefs: `
         
        type Query { categories(
          filters: CategoryFiltersInput
          pagination: PaginationArg = {}
          sort: [String] = []
          publicationState: PublicationState = LIVE
        ): CategoryEntityResponseCollection! }
        

        type Category {
          id: String
          name: String
          description: String
          shortDescription: String
          archive: Boolean
          seoDescription: String
          seoTitle: String
          seoKeywords: String
          bgColor: String
          order: Int
          notionItemId: String
          createdAt: DateTime
          updatedAt: DateTime
          publishedAt: DateTime
          slug: String
          resourceCount: Int
        } 
      
        
      `,
      resolvers: {
        Query: {
          categories: {
            resolve: async (parent, args, context) => {
              const { toEntityResponseCollection } = strapi
                .plugin("graphql")
                .service("format").returnTypes;

              try {
                const query = sanitizeArgs(args.filters);
                const categories = await strapi.entityService.findMany(
                  "api::category.category",
                  {
                    ...args,
                    filters: query,
                  }
                );
                categories.sort((a, b) => a?.order - b?.order);
                const categoryIds = categories.map(({ id }) => id);
                const { rows } = await strapi.db.connection.raw(
                  `SELECT
                category_id,
                COUNT(resource_id) AS totalResources
              FROM
                resources_category_links
                JOIN resources ON resources_category_links.resource_id = resources.id
              WHERE
                resources.archive = FALSE
                AND resources_category_links.category_id IN (${categoryIds
                  .map((Id) => Id)
                  .join(",")})
              GROUP BY
                category_id`
                );

                const resourceMap = new Map();
                rows.map(({ category_id, totalresources }) => {
                  resourceMap.set(category_id, totalresources);
                });
                const response = await categories.map((cat) => {
                  const resourceCount = resourceMap.get(cat.id) || 0;
                  return {
                    ...cat,
                    resourceCount,
                  };
                });

                const data = await toEntityResponseCollection(response);

                return data;
              } catch (error) {
                strapi.log.error(`Error fetching categories: ${error}`);
                return [];
              }
            },
          },
        },
      },
      /**
       * An asynchronous bootstrap function that runs before
       * your application gets started.
       *
       * This gives you an opportunity to set up your data model,
       * run jobs, or perform some special logic.
       */
      bootstrap(/*{ strapi }*/) {},
    }));
    extensionService.use(({ strapi }) => ({
      typeDefs: `
        type Query { resources(
          filters: ResourceFiltersInput
          pagination: PaginationArg = {}
          sort: [String] = []
          publicationState: PublicationState = LIVE
          dynamicZoneFilter: [String]
        ): ResourceEntityResponseCollection }
    `,
      resolvers: {
        Query: {
          resources: {
            resolve: async (parent, args, context) => {
              const { toEntityResponseCollection } = strapi
                .plugin("graphql")
                .service("format").returnTypes;

              try {
                const query = sanitizeArgs(args.filters);
                let resources = await strapi.entityService.findMany(
                  "api::resource.resource",
                  {
                    ...args,
                    filters: query,
                    populate: ["address"],
                  }
                );
                const searchParams = args.filters?.or;
                if (searchParams) {
                  const nameObj = searchParams.find((element) => {
                    return "name" in element;
                  });

                  if (nameObj) {
                    const searchText = nameObj.name?.containsi;

                    if (searchText) {
                      const orderedResults = fuzzysort.go(
                        searchText.length > 0 ? searchText : "*",
                        resources,
                        {
                          keys: ["name", "description"],
                          scoreFn: (a) =>
                            Math.max(
                              a[0] ? a[0].score : -1000,
                              a[1] ? a[1].score - 100 : -1000
                            ),
                        }
                      );
                      const results = orderedResults.map((res) => res.obj);
                      resources = results;
                    }
                  }
                }
                if (args.dynamicZoneFilter) {
                  const countries = new Set(args.dynamicZoneFilter);
                  const filteredData = resources.filter((reso) => {
                    const isResourceInCountry = reso?.address?.some((addr) =>
                      countries.has(addr?.cityInfo?.country)
                    );
                    if (isResourceInCountry) return true;
                    return false;
                  });

                  const filteredResults = await toEntityResponseCollection(
                    filteredData
                  );
                  return filteredResults;
                }
                const data = await toEntityResponseCollection(resources);

                return data;
              } catch (error) {
                strapi.log.error(`Error fetching resources: ${error}`);
                return [];
              }
            },
          },
        },
      },
      bootstrap(/*{ strapi }*/) {},
    }));
    extensionService.use(({ strapi }) => ({
      typeDefs: `
        type Query { cities(
          filters: CityFiltersInput
          pagination: PaginationArg = {}
          sort: [String] = []
          publicationState: PublicationState = LIVE
          countryFilter: Boolean
          ): CityEntityResponseCollection }
      `,
      resolvers: {
        Query: {
          cities: {
            resolve: async (parent, args, context) => {
              const { toEntityResponseCollection } = strapi
                .plugin("graphql")
                .service("format").returnTypes;

              try {
                const filters = sanitizeArgs(args.filters);
                if (args.countryFilter) {
                  const { rows } = await strapi.db.connection.raw(
                    `SELECT DISTINCT cities.country
                      FROM cities
                      ORDER by cities.country`
                  );
                  const data = await toEntityResponseCollection(rows);
                  return data;
                }
                const results = await strapi.entityService.findMany(
                  "api::city.city",
                  {
                    ...args,
                    filters,
                  }
                );
                const data = await toEntityResponseCollection(results);
                return data;
              } catch (error) {
                strapi.log.error(`Error fetching resources: ${error}`);
                return [];
              }
            },
          },
        },
      },
      bootstrap(/*{ strapi }*/) {},
    }));
  },
};
