import * as Types from './types.generated';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type GetResourceBySlugStrapiQueryVariables = Types.Exact<{
  resourceSlug: Types.StringFilterInput;
}>;


export type GetResourceBySlugStrapiQuery = { __typename?: 'Query', resources?: { __typename?: 'ResourceEntityResponseCollection', data: Array<{ __typename?: 'ResourceEntity', id?: string | null, attributes?: { __typename?: 'Resource', notionItemId?: string | null, name: string, archive: boolean, slug?: string | null, shortDescription?: string | null, description?: string | null, url?: string | null, analyticsURL?: string | null, mobileNumber?: string | null, email?: string | null, type?: Types.Enum_Resource_Type | null, logo?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string } | null } | null } | null, address?: Array<{ __typename: 'ComponentAddressAddress', cityInfo?: any | null, id: string, address?: string | null } | { __typename?: 'Error' } | null> | null, Products?: { __typename?: 'ProductRelationResponseCollection', data: Array<{ __typename?: 'ProductEntity', attributes?: { __typename?: 'Product', name: string, archive: boolean, description?: string | null, notionItemId?: string | null, embbedCode?: string | null, currency?: Types.Enum_Product_Currency | null, productLink?: string | null, price?: number | null, slug?: string | null, updatedAt?: Date | null, productPhoto?: { __typename?: 'UploadFileRelationResponseCollection', data: Array<{ __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', name: string, alternativeText?: string | null, url: string, previewUrl?: string | null, formats?: any | null, caption?: string | null, related?: Array<{ __typename: 'Category' } | { __typename: 'City' } | { __typename: 'ComponentAddressAddress' } | { __typename: 'I18NLocale' } | { __typename: 'Product' } | { __typename: 'RelatedContent' } | { __typename: 'Resource' } | { __typename: 'Tag' } | { __typename: 'UploadFile' } | { __typename: 'UploadFolder' } | { __typename: 'UsersPermissionsPermission' } | { __typename: 'UsersPermissionsRole' } | { __typename: 'UsersPermissionsUser' } | null> | null } | null }> } | null } | null }> } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', notionItemId?: string | null, name?: string | null } | null }> } | null, category?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', name: string, notionItemId?: string | null, bgColor: string, slug: string, logo?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string, previewUrl?: string | null, caption?: string | null } | null } | null } | null } | null }> } | null } | null }> } | null };


export const GetResourceBySlugStrapiDocument = gql`
    query GetResourceBySlugStrapi($resourceSlug: StringFilterInput!) {
  resources(filters: {and: [{slug: $resourceSlug}, {archive: {eq: false}}]}) {
    data {
      id
      attributes {
        notionItemId
        name
        archive
        slug
        shortDescription
        description
        logo {
          data {
            attributes {
              url
            }
          }
        }
        url
        analyticsURL
        mobileNumber
        address {
          ... on ComponentAddressAddress {
            __typename
            cityInfo
            id
            address
          }
        }
        email
        Products {
          data {
            attributes {
              name
              archive
              description
              notionItemId
              embbedCode
              currency
              productLink
              price
              productPhoto {
                data {
                  attributes {
                    name
                    alternativeText
                    url
                    previewUrl
                    related {
                      __typename
                    }
                    formats
                    caption
                  }
                }
              }
              slug
              updatedAt
            }
          }
        }
        tags {
          data {
            attributes {
              notionItemId
              name
            }
          }
        }
        type
        category {
          data {
            attributes {
              name
              notionItemId
              bgColor
              logo {
                data {
                  attributes {
                    url
                    previewUrl
                    caption
                  }
                }
              }
              slug
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
    GetResourceBySlugStrapi(variables: GetResourceBySlugStrapiQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetResourceBySlugStrapiQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetResourceBySlugStrapiQuery>(GetResourceBySlugStrapiDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'GetResourceBySlugStrapi', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;