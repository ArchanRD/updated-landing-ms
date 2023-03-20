import * as Types from './types.generated';

import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type GetAllResourcesMainStrapiQueryVariables = Types.Exact<{ [key: string]: never; }>;


export type GetAllResourcesMainStrapiQuery = { __typename?: 'Query', resources?: { __typename?: 'ResourceEntityResponseCollection', data: Array<{ __typename?: 'ResourceEntity', attributes?: { __typename?: 'Resource', notionItemId?: string | null, name: string, slug?: string | null, shortDescription?: string | null, description?: string | null, archive: boolean, analyticsURL?: string | null, type?: Types.Enum_Resource_Type | null, logo?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string, previewUrl?: string | null } | null } | null } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', notionItemId?: string | null, name?: string | null } | null }> } | null, address?: Array<{ __typename?: 'ComponentAddressAddress', id: string, cityInfo?: any | null } | { __typename?: 'Error' } | null> | null, category?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', notionItemId?: string | null, name: string } | null }> } | null } | null }> } | null };


export const GetAllResourcesMainStrapiDocument = gql`
    query getAllResourcesMainStrapi {
  resources(filters: {archive: {eq: false}}) {
    data {
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
    getAllResourcesMainStrapi(variables?: GetAllResourcesMainStrapiQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GetAllResourcesMainStrapiQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GetAllResourcesMainStrapiQuery>(GetAllResourcesMainStrapiDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'getAllResourcesMainStrapi', 'query');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;