import * as Types from '../types.generated';

import { GraphQLClient } from 'graphql-request';
import { RequestInit } from 'graphql-request/dist/types.dom';
import { useQuery, UseQueryOptions } from '@tanstack/react-query';

function fetcher<TData, TVariables extends { [key: string]: any }>(client: GraphQLClient, query: string, variables?: TVariables, requestHeaders?: RequestInit['headers']) {
  return async (): Promise<TData> => client.request({
    document: query,
    variables,
    requestHeaders
  });
}
export type GetSearchResultsStrapiQueryVariables = Types.Exact<{
  resourceSlug?: Types.InputMaybe<Types.StringFilterInput>;
  tagName?: Types.InputMaybe<Types.TagFiltersInput>;
  countryName?: Types.InputMaybe<Array<Types.InputMaybe<Types.Scalars['String']>> | Types.InputMaybe<Types.Scalars['String']>>;
}>;


export type GetSearchResultsStrapiQuery = { __typename?: 'Query', resources?: { __typename?: 'ResourceEntityResponseCollection', data: Array<{ __typename?: 'ResourceEntity', id?: string | null, attributes?: { __typename?: 'Resource', notionItemId?: string | null, name: string, slug?: string | null, shortDescription?: string | null, description?: string | null, archive: boolean, analyticsURL?: string | null, url?: string | null, type?: Types.Enum_Resource_Type | null, logo?: { __typename?: 'UploadFileEntityResponse', data?: { __typename?: 'UploadFileEntity', attributes?: { __typename?: 'UploadFile', url: string, previewUrl?: string | null } | null } | null } | null, tags?: { __typename?: 'TagRelationResponseCollection', data: Array<{ __typename?: 'TagEntity', attributes?: { __typename?: 'Tag', notionItemId?: string | null, name?: string | null } | null }> } | null, address?: Array<{ __typename?: 'ComponentAddressAddress', id: string, cityInfo?: any | null } | { __typename?: 'Error' } | null> | null, category?: { __typename?: 'CategoryRelationResponseCollection', data: Array<{ __typename?: 'CategoryEntity', attributes?: { __typename?: 'Category', notionItemId?: string | null, name: string } | null }> } | null } | null }> } | null };


export const GetSearchResultsStrapiDocument = `
    query GetSearchResultsStrapi($resourceSlug: StringFilterInput, $tagName: TagFiltersInput, $countryName: [String]) {
  resources(
    filters: {and: [{tags: $tagName}, {or: [{slug: $resourceSlug}, {description: $resourceSlug}]}]}
    dynamicZoneFilter: $countryName
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
export const useGetSearchResultsStrapiQuery = <
      TData = GetSearchResultsStrapiQuery,
      TError = unknown
    >(
      client: GraphQLClient,
      variables?: GetSearchResultsStrapiQueryVariables,
      options?: UseQueryOptions<GetSearchResultsStrapiQuery, TError, TData>,
      headers?: RequestInit['headers']
    ) =>
    useQuery<GetSearchResultsStrapiQuery, TError, TData>(
      variables === undefined ? ['GetSearchResultsStrapi'] : ['GetSearchResultsStrapi', variables],
      fetcher<GetSearchResultsStrapiQuery, GetSearchResultsStrapiQueryVariables>(client, GetSearchResultsStrapiDocument, variables, headers),
      options
    );
useGetSearchResultsStrapiQuery.fetcher = (client: GraphQLClient, variables?: GetSearchResultsStrapiQueryVariables, headers?: RequestInit['headers']) => fetcher<GetSearchResultsStrapiQuery, GetSearchResultsStrapiQueryVariables>(client, GetSearchResultsStrapiDocument, variables, headers);