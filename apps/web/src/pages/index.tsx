import { InferGetServerSidePropsType } from "next";
import { H1 } from "@untitledui/core";
import Head from "next/head";
import CategoryCard from "../client/components/CategoriesPage/CategoryCard";
import Layout from "../client/components/Layout";
import { getGQLClient } from "../utils/gqlClient";
import { getSdk as allCatSdk } from "../client/graphql-strapi/getAllCategoriesStrapi.generated";
import { Category } from "../client/graphql-strapi/types.generated";
import { SelectOption } from "../client/hooks/context/FilterContext";
import Search from "../client/components/Filters/Search";
import { useState } from "react";
import MultiSelectFilter from "../client/components/Filters/MultiSelectFilter";
import SearchResults from "../client/components/GlobalSearchResults";

export const getStaticProps = async () => {
  const graphQlClient = getGQLClient();
  const sdk = allCatSdk(graphQlClient);

  try {
    const theCatagoriesDataObj = await sdk.GetAllCategoriesStrapi();
    const categories = theCatagoriesDataObj.categories?.data;
    const tagsObj = theCatagoriesDataObj.tags?.data;
    const tags = tagsObj?.map((tag) => {
      return { id: tag.id, name: tag.attributes?.name };
    });
    const citiesObj = theCatagoriesDataObj.cities?.data;
    let cities = citiesObj?.map((city, index) => {
      return { id: index.toString(), name: city.attributes?.country };
    });

    return { props: { categories, tags, cities }, revalidate: 10 };
  } catch (e) {
    console.error(e);
    return {
      props: {
        categories: [],
      },
      revalidate: 10,
    };
  }
};

export default function Web({
  categories,
  tags,
  cities,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const [searchText, setSearchText] = useState("");
  const [selectedTags, setSelectedTags] = useState<SelectOption[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<SelectOption[]>(
    []
  );
  return (
    <Layout>
      <Head>
        <title>Mission Sustainability</title>
      </Head>
      {/*the all resource search 
       <H1 className="mb-3 mt-16 text-center">Resources</H1>
      <SortAndFilterProvider resources={resources as Resource[]}>
          <div className="md:flex max-w-4xl md:space-x-2 mb-6">
            <ResourceFilter tags={tags as SelectedOptions} countries={countries as SelectedOptions} />
          </div>
          <AllResourceList/> 
      </SortAndFilterProvider> */}
      <H1 className="mb-3 mt-16 text-center">Sustainability Verticals</H1>
      <div className="text-gray-400 text-center">
        We have organised all eco-friendly business & services into following
        categories
      </div>
      <div className="flex pt-12 flex-wrap sm:flex-nowrap">
        <Search searchText={searchText} setSearchText={setSearchText}></Search>
        <div className="flex w-full mt-1 sm:mt-0 space-x-1">
          <MultiSelectFilter
            options={tags as SelectOption[]}
            label="Tags"
            selectedOptions={selectedTags}
            setSelectedOptions={setSelectedTags}
          />
          <MultiSelectFilter
            options={cities as SelectOption[]}
            label="Countries"
            selectedOptions={selectedCountries}
            setSelectedOptions={setSelectedCountries}
          />
        </div>
      </div>

      {(searchText != "" && searchText.length > 2) ||
      selectedCountries.length > 0 ||
      selectedTags.length > 0 ? (
        <SearchResults
          searchText={searchText}
          selectedTags={selectedTags}
          selectedCountries={selectedCountries}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-20">
          {categories?.map((cat) => (
            <CategoryCard
              {...(cat.attributes as Category)}
              key={cat.attributes?.notionItemId as string}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
