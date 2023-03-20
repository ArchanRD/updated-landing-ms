import { GraphQLClient } from "graphql-request";
import toast from "react-hot-toast";

const isServerSide = typeof window === "undefined";

/**
 * Consistently determine the API URL for the current client even when in a deploy preview or similar
 */
const getAPIURl = (): string => {
  // In the browser we just use a relative URL and everything works perfectly
  if (!isServerSide) return `/api`;

  // Infer the deploy URL if we're in production
  // VERCEL_URL = Vercel, DEPLOY_URL = Netlify
  const PROVIDER_URL = process.env.VERCEL_URL || process.env.DEPLOY_URL;

  if (PROVIDER_URL) {
    // We replace https:// from the URL if it exists and add it ourselves always at the beginning as the above environment variables are not guaranteed to include it
    return `https://${PROVIDER_URL.replace(/^https?:\/\//, "")}/api`;
  }

  return "http://localhost:3000/api";

  // Finally, fallback to hard-coded URL in case nothing else works
  return process.env.NODE_ENV === "development"
    ? "http://localhost:3000/api"
    : "https://designbits-nextjs.vercel.app/api";
  // return "https://designbits-nextjs.vercel.app/api";

  // TODO: Replace with your production URL for the very final fallback
};

declare global {
  interface Window {
    __URQL_DATA__: any;
  }
}

function createApolloClient() {
  return new GraphQLClient(getAPIURl());
}
let client: GraphQLClient;

export function getGraphQLClient() {
  const _client = client ?? createApolloClient();

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === "undefined") return _client;
  // Create the Apollo Client once in the client
  if (!client) client = _client;

  return _client;
}
