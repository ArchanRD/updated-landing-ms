import { GetServerSidePropsContext } from "next";
import { getGQLClient } from "../utils/gqlClient";
import { getSdk } from "../client/graphql-strapi/getCatResoSiteMap.generated";
import { ResourceEntityResponseCollection } from "../client/graphql-strapi/types.generated";

function generateSiteMap(resources: ResourceEntityResponseCollection) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${resources.data
       ?.map((res) => {
         return `
       <url>
        <loc>${`https://resources.missionsustainability.org/${res.attributes?.slug as string}`}</loc>
        <changefreq>weekly</changefreq>
        <lastmod>${res.attributes?.updatedAt}</lastmod>
        <priority>0.5</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }: GetServerSidePropsContext) {
  // const client = getGraphQLClient();
  // const fetcher = useGetAllResourcesQuery.fetcher(client);
  const getGraphQLClient = getGQLClient();
  const sdk = getSdk(getGraphQLClient);
  const resources = await sdk.categoryAndResourcesSiteMap();
      
      // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(resources.resources as ResourceEntityResponseCollection);

  res.setHeader("Content-Type", "text/xml");
      // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
      props: {},
  };
  
}

export default SiteMap;
