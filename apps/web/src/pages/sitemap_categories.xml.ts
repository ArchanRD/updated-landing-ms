import { GetServerSidePropsContext } from "next";

import { getGQLClient } from "../utils/gqlClient";
import { getSdk } from "../client/graphql-strapi/getCatResoSiteMap.generated";
import { CategoryEntityResponseCollection } from "../client/graphql-strapi/types.generated";

function generateSiteMap(categories: CategoryEntityResponseCollection) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     ${categories?.data
       ?.map((cat) => {
         return `
       <url>
        <loc>${`https://resources.missionsustainability.org/${cat.attributes?.slug }`}</loc>
        <changefreq>daily</changefreq>
        <lastmod>${cat.attributes?.updatedAt }</lastmod>
        <priority>0.9</priority>
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

  const graphQLClient = getGQLClient();
  const sdk = getSdk(graphQLClient);

  const categories = await sdk.categoryAndResourcesSiteMap();
  
  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(categories.categories as CategoryEntityResponseCollection);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
