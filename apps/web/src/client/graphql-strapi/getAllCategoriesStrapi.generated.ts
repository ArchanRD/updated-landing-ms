import * as Types from './types.generated';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type GetAllCategoriesStrapiQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllCategoriesStrapiQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryEntityResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', notionItemId?: string | null, name: string, slug: string, bgColor: string, archive?: boolean | null, description: string, seoDescription?: string | null, seoKeywords?: string | null, seoTitle?: string | null, shortDescription?: string | null, updatedAt?: Date | null, resourceCount?: number | null, logo?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null } | null }> }, tags?: { __typename?: 'TagEntityResponseCollection', data: Array<{ __typename?: 'TagEntity', id?: string | null, attributes?: { __typename?: 'Tag', name?: string | null } | null }> } | null, cities?: { __typename?: 'CityEntityResponseCollection', data: Array<{ __typename?: 'CityEntity', attributes?: { __typename?: 'City', country?: string | null } | null }> } | null };


export const GetAllCategoriesStrapiDocument = gql`
    query GetAllCategoriesStrapi {
  categories(filters: {archive: {eq: false}}) {
    data {
      attributes {
        notionItemId
        name
        slug
        bgColor
        archive
        description
        logo {
          data {
            attributes {
              url
            }
          }
        }
        seoDescription
        seoKeywords
        seoTitle
        shortDescription
        updatedAt
        resourceCount
      }
    }
  }
  tags {
    data {
      id
      attributes {
        name
      }
    }
  }
  cities(countryFilter: true) {
    data {
      attributes {
        country
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetAllCategoriesStrapi(variables?: GetAllCategoriesStrapiQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllCategoriesStrapiQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllCategoriesStrapiQuery>(GetAllCategoriesStrapiDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetAllCategoriesStrapi', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;