import * as Types from './types.generated';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type CategoryAndResourcesSiteMapQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type CategoryAndResourcesSiteMapQuery = { __typename?: 'Query', resources?: { __typename?: 'ResourceEntityResponseCollection', data: Array<{ __typename?: 'ResourceEntity', attributes?: { __typename?: 'Resource', slug?: string | null, updatedAt?: Date | null } | null }> } | null, categories: { __typename?: 'CategoryEntityResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', slug: string, updatedAt?: Date | null } | null }> } };


export const CategoryAndResourcesSiteMapDocument = gql`
    query categoryAndResourcesSiteMap {
  resources(filters: {archive: {eq: false}}) {
    data {
      attributes {
        slug
        updatedAt
      }
    }
  }
  categories(filters: {archive: {eq: false}}) {
    data {
      attributes {
        slug
        updatedAt
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    categoryAndResourcesSiteMap(variables?: CategoryAndResourcesSiteMapQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CategoryAndResourcesSiteMapQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CategoryAndResourcesSiteMapQuery>(CategoryAndResourcesSiteMapDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'categoryAndResourcesSiteMap', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;