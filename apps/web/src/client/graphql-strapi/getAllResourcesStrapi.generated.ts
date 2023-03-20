import * as Types from "./types.generated";

import { GraphQLClient } from "graphql-request";
import * as Dom from "graphql-request/dist/types.dom";
import gql from "graphql-tag";
export type GetAllResourcesStrapiQueryVariables = Types.Exact<{
  [key: string]: never;
}>;

export type GetAllResourcesStrapiQuery = {
  __typename?: "Query";
  resources?: {
    __typename?: "ResourceEntityResponseCollection";
    data: Array<{
      __typename?: "ResourceEntity";
      attributes?: {
        __typename?: "Resource";
        notionItemId?: string | null;
        slug?: string | null;
        updatedAt?: Date | null;
      } | null;
    }>;
  } | null;
};

export const GetAllResourcesStrapiDocument = gql`
  query getAllResourcesStrapi {
    resources(filters: { archive: { eq: false } }) {
      data {
        attributes {
          notionItemId
          slug
          updatedAt
        }
      }
    }
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (
  action,
  _operationName,
  _operationType
) => action();

export function getSdk(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  return {
    getAllResourcesStrapi(
      variables?: GetAllResourcesStrapiQueryVariables,
      requestHeaders?: Dom.RequestInit["headers"]
    ): Promise<GetAllResourcesStrapiQuery> {
      return withWrapper(
        (wrappedRequestHeaders) =>
          client.request<GetAllResourcesStrapiQuery>(
            GetAllResourcesStrapiDocument,
            variables,
            { ...requestHeaders, ...wrappedRequestHeaders }
          ),
        "getAllResourcesStrapi",
        "query"
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
