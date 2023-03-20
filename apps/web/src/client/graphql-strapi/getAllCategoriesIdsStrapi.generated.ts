import * as Types from './types.generated';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type GetAllCategoriesIdsStrapiQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllCategoriesIdsStrapiQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryEntityResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', notionItemId?: string | null, slug: string } | null }> } };


export const GetAllCategoriesIdsStrapiDocument = gql`
    query GetAllCategoriesIdsStrapi {
  categories(filters: {archive: {eq: false}}) {
    data {
      attributes {
        notionItemId
        slug
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetAllCategoriesIdsStrapi(variables?: GetAllCategoriesIdsStrapiQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllCategoriesIdsStrapiQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllCategoriesIdsStrapiQuery>(GetAllCategoriesIdsStrapiDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAllCategoriesIdsStrapi', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;