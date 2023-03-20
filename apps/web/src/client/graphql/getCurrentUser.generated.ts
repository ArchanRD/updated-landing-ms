import * as Types from "./types.generated";

import { GraphQLClient } from "graphql-request";
import { RequestInit } from "graphql-request/dist/types.dom";
import { useQuery, UseQueryOptions } from "@tanstack/react-query";

function fetcher<TData, TVariables extends { [key: string]: any }>(
  client: GraphQLClient,
  query: string,
  variables?: TVariables,
  requestHeaders?: RequestInit["headers"]
) {
  return async (): Promise<TData> =>
    client.request({
      document: query,
      variables,
      requestHeaders,
    });
}
export type CurrentUserQueryVariables = Types.Exact<{ [key: string]: never }>;

export type CurrentUserQuery = {
  __typename?: "Query";
  currentUser?: {
    __typename?: "User";
    name: string;
    email: string;
    image?: string | null;
    savedResources: Array<{
      __typename?: "UserSavedResource";
      resourceId: string;
      savedAt?: Date | null;
    }>;
  } | null;
};

export const CurrentUserDocument = `
    query currentUser {
  currentUser {
    name
    email
    image
    savedResources {
      resourceId
      savedAt
    }
  }
}
    `;
export const useCurrentUserQuery = <TData = CurrentUserQuery, TError = unknown>(
  client: GraphQLClient,
  variables?: CurrentUserQueryVariables,
  options?: UseQueryOptions<CurrentUserQuery, TError, TData>,
  headers?: RequestInit["headers"]
) =>
  useQuery<CurrentUserQuery, TError, TData>(
    variables === undefined ? ["currentUser"] : ["currentUser", variables],
    fetcher<CurrentUserQuery, CurrentUserQueryVariables>(
      client,
      CurrentUserDocument,
      variables,
      headers
    ),
    options
  );
useCurrentUserQuery.fetcher = (
  client: GraphQLClient,
  variables?: CurrentUserQueryVariables,
  headers?: RequestInit["headers"]
) =>
  fetcher<CurrentUserQuery, CurrentUserQueryVariables>(
    client,
    CurrentUserDocument,
    variables,
    headers
  );
