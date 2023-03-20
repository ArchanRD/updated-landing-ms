import { GraphQLClient } from "graphql-request";

export const getGQLClient = () => {
  const endpoint = "https://strapi.missionsustainability.org/graphql";
  const graphQlClient = new GraphQLClient(endpoint);
  graphQlClient.setHeader(
    "Authorization",
    "Bearer 5e5ca73941ec0371cd10887646a9d0c406da4f54172b72f0e3c82413a95e28dfe7bd93d5593ac8bb4ec251954fbaf6c4c032962304cb0e5db9f74bcd8da88a72b2491163d8b506e7832b12546177dc97673e309bf6356800aeceec5f759e352c163701bc63c8189a990844182e067414c02df7c494c3401d272302c177c9ad8e"
  );

  return graphQlClient;
};
