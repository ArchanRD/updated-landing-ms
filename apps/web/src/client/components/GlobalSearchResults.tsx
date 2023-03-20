import React, { useCallback } from "react";
import { useMemo } from "react";
import { getGQLClient } from "../../utils/gqlClient";
import {
  GetSearchResultsStrapiQuery,
  useGetSearchResultsStrapiQuery,
} from "../graphql-strapi/client/getSearchResources.generated";
import { ProcessedResource } from "../hooks/context/FilterContext";
import AllResourceList from "./CategoriesPage/AllResourceList";
import { SelectOption } from "./Filters/MultiSelectFilter";
import Skeleton from "./Skeleton";

export default function SearchResults({
  searchText,
  selectedTags,
  selectedCountries,
}: {
  searchText: string;
  selectedTags: SelectOption[];
  selectedCountries: SelectOption[];
}) {
  const formattedTags = useMemo(
    () => selectedTags.map((tag) => tag.name),
    [selectedTags]
  );
  const formattedCountries = useMemo(
    () => selectedCountries.map((country) => country.name),
    [selectedCountries]
  );
  const client = useMemo(() => getGQLClient(), []);
  const queryVariables = useMemo(() => {
    let variables: {
      resourceSlug?: Record<string, string>;
      tagName?: Record<string, Record<string, string[]>>;
      countryName?: string[];
    } = {};
    if (searchText !== "") {
      variables.resourceSlug = { contains: searchText };
    }
    if (selectedTags.length > 0) {
      variables.tagName = {
        name: {
          in: formattedTags,
        },
      };
    }
    if (selectedCountries.length > 0) {
      variables.countryName = formattedCountries;
    }
    return variables;
  }, [
    formattedTags,
    formattedCountries,
    searchText,
    selectedTags,
    selectedCountries,
  ]);
  const { data, isLoading, isError } = useGetSearchResultsStrapiQuery<
    GetSearchResultsStrapiQuery,
    Error
  >(client, queryVariables);

  const renderSearchResults = useCallback(() => {
    if (isLoading) {
      return (
        <>
          <Skeleton />
          <Skeleton />
          <Skeleton />
          <Skeleton />
        </>
      );
    }

    if (isError) {
      return (
        <>
          <main className="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
            <div className="text-center">
              <p className="text-base font-semibold text-indigo-600">404</p>
              <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
                Resources not found
              </h1>
              <p className="mt-6 text-base leading-7 text-gray-600">
                Sorry, we couldn’t find the resources you’re looking for.
              </p>
            </div>
          </main>
        </>
      );
    }
    const resources = data?.resources?.data?.map((res) => {
      return { id: res.id, ...res.attributes };
    });

    if (!resources?.length) {
      return (
        <main className="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
          <div className="text-center">
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              {searchText !== ""
                ? `no resources found matching "${searchText}"`
                : "Resources not found"}
            </h1>
            <p className="mt-6 text-base leading-7 text-gray-600">
              Sorry, we couldn’t find the resources you’re looking for.
            </p>
          </div>
        </main>
      );
    }
    return (
      <>
        <AllResourceList
          fileteredResources={resources as ProcessedResource[]}
        ></AllResourceList>
      </>
    );
  }, [isLoading, isError, data, selectedCountries, selectedCountries]);

  return <>{renderSearchResults()}</>;
}
