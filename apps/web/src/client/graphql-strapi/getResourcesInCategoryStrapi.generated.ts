import * as Types from './types.generated';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type GetResourcesInCategoryStrapiQueryVariables = Types.Exact<{
  categorySlug: Types.StringFilterInput;
}>;


export type GetResourcesInCategoryStrapiQuery = { __typename?: 'Query', categories: { __typename?: 'CategoryEntityResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', notionItemId?: string | null, name: string, description: string, bgColor: string, logo?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, RelatedContent?: { __typename?: 'RelatedContentRelationResponseCollection', data: Array<{ __typename?: 'RelatedContentEntity', attributes?: { __typename?: 'RelatedContent', notionItemId?: string | null, title: string, description?: string | null, archive: boolean, videoUrl?: string | null, RelatedContentType?: Types.Enum_Relatedcontent_Relatedcontenttype | null, media?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string, previewUrl?: string | null, name: string, caption?: string | null } | null } | null } | null } | null }> } | null } | null }> }, resources?: { __typename?: 'ResourceEntityResponseCollection', data: Array<{ __typename?: 'ResourceEntity', id?: string | null, attributes?: { __typename?: 'Resource', notionItemId?: string | null, name: string, slug?: string | null, shortDescription?: string | null, description?: string | null, archive: boolean, analyticsURL?: string | null, url?: string | null, type?: Types.Enum_Resource_Type | null, logo?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string, previewUrl?: string | null } | null } | null } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', notionItemId?: string | null, name?: string | null } | null }> } | null, address?: Array<{ __typename?: 'ComponentAddressAddress', id: string, cityInfo?: any | null } | { __typename?: 'Error' } | null> | null, category?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', notionItemId?: string | null, name: string } | null }> } | null } | null }> } | null };


export const GetResourcesInCategoryStrapiDocument = gql`
    query GetResourcesInCategoryStrapi($categorySlug: StringFilterInput!) {
  categories(filters: {and: [{slug: $categorySlug}, {archive: {eq: false}}]}) {
    data {
      attributes {
        notionItemId
        name
        description
        logo {
          data {
            attributes {
              url
            }
          }
        }
        bgColor
        RelatedContent {
          data {
            attributes {
              notionItemId
              title
              description
              media {
                data {
                  attributes {
                    url
                    previewUrl
                    name
                    caption
                  }
                }
              }
              archive
              videoUrl
              RelatedContentType
            }
          }
        }
      }
    }
  }
  resources(
    filters: {and: [{category: {slug: $categorySlug}}, {archive: {eq: false}}]}
  ) {
    data {
      id
      attributes {
        notionItemId
        name
        slug
        shortDescription
        description
        archive
        logo {
          data {
            attributes {
              url
              previewUrl
            }
          }
        }
        analyticsURL
        tags {
          data {
            attributes {
              notionItemId
              name
            }
          }
        }
        url
        type
        address {
          ... on ComponentAddressAddress {
            id
            cityInfo
          }
        }
        category {
          data {
            attributes {
              notionItemId
              name
            }
          }
        }
      }
    }
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string, operationType?: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    GetResourcesInCategoryStrapi(variables: GetResourcesInCategoryStrapiQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetResourcesInCategoryStrapiQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetResourcesInCategoryStrapiQuery>(GetResourcesInCategoryStrapiDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetResourcesInCategoryStrapi', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;