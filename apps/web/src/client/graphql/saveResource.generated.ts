import * as Types from "./types.generated";

import { GraphQLClient } from "graphql-request";
import { RequestInit } from "graphql-request/dist/types.dom";
import { useMutation, UseMutationOptions } from "@tanstack/react-query";

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
export type SaveResourceMutationVariables = Types.Exact<{
  resourceId: Types.Scalars["String"];
}>;

export type SaveResourceMutation = {
  __typename?: "Mutation";
  saveResource: {
    __typename?: "UserSavedResource";
    id: string;
    resourceId: string;
    savedAt?: Date | null;
    userId: string;
  };
};

export type RemoveSavedResourceMutationVariables = Types.Exact<{
  resourceId: Types.Scalars["String"];
}>;

export type RemoveSavedResourceMutation = {
  __typename?: "Mutation";
  removeSavedResource?: {
    __typename?: "UserSavedResource";
    id: string;
    resourceId: string;
  } | null;
};

export const SaveResourceDocument = `
    mutation saveResource($resourceId: String!) {
  saveResource(resourceId: $resourceId) {
    id
    resourceId
    savedAt
    userId
  }
}
    `;
export const useSaveResourceMutation = <TError = unknown, TContext = unknown>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    SaveResourceMutation,
    TError,
    SaveResourceMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    SaveResourceMutation,
    TError,
    SaveResourceMutationVariables,
    TContext
  >(
    ["saveResource"],
    (variables?: SaveResourceMutationVariables) =>
      fetcher<SaveResourceMutation, SaveResourceMutationVariables>(
        client,
        SaveResourceDocument,
        variables,
        headers
      )(),
    options
  );
useSaveResourceMutation.fetcher = (
  client: GraphQLClient,
  variables: SaveResourceMutationVariables,
  headers?: RequestInit["headers"]
) =>
  fetcher<SaveResourceMutation, SaveResourceMutationVariables>(
    client,
    SaveResourceDocument,
    variables,
    headers
  );
export const RemoveSavedResourceDocument = `
    mutation removeSavedResource($resourceId: String!) {
  removeSavedResource(resourceId: $resourceId) {
    id
    resourceId
  }
}
    `;
export const useRemoveSavedResourceMutation = <
  TError = unknown,
  TContext = unknown
>(
  client: GraphQLClient,
  options?: UseMutationOptions<
    RemoveSavedResourceMutation,
    TError,
    RemoveSavedResourceMutationVariables,
    TContext
  >,
  headers?: RequestInit["headers"]
) =>
  useMutation<
    RemoveSavedResourceMutation,
    TError,
    RemoveSavedResourceMutationVariables,
    TContext
  >(
    ["removeSavedResource"],
    (variables?: RemoveSavedResourceMutationVariables) =>
      fetcher<
        RemoveSavedResourceMutation,
        RemoveSavedResourceMutationVariables
      >(client, RemoveSavedResourceDocument, variables, headers)(),
    options
  );
useRemoveSavedResourceMutation.fetcher = (
  client: GraphQLClient,
  variables: RemoveSavedResourceMutationVariables,
  headers?: RequestInit["headers"]
) =>
  fetcher<RemoveSavedResourceMutation, RemoveSavedResourceMutationVariables>(
    client,
    RemoveSavedResourceDocument,
    variables,
    headers
  );
