import { H1 } from "@untitledui/core";
import { ArrowNarrowLeftIcon } from "@untitledui/icons/outline";
import { InferGetServerSidePropsType, GetStaticPropsContext } from "next";
import Layout from "../client/components/Layout";
import Image from "next/image";
import {
  getCountriesForResourceList,
  getTagsForResourceList,
} from "../utils/getFilterOptionsForResourceList";
import Link from "next/link";
import Head from "next/head";
import {
  ProcessedResource,
  SelectedOptions,
  SortAndFilterProvider,
} from "../client/hooks/context/FilterContext";
import ResourceFilter from "../client/components/CategoriesPage/ResourceFilter";
import ResourceList from "../client/components/CategoriesPage/ResourceList";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { getGraphQLClient } from "../client/graphql/client";
import { useCurrentUserQuery } from "../client/graphql/getCurrentUser.generated";
import { getGQLClient } from "../utils/gqlClient";
import { getSdk as allCatIdSdk } from "../client/graphql-strapi/getAllCategoriesIdsStrapi.generated";
import { getSdk as resInCatSdk } from "../client/graphql-strapi/getResourcesInCategoryStrapi.generated";
import {
  Category,
  Resource,
  Tag,
} from "../client/graphql-strapi/types.generated";

export async function getStaticPaths() {
  const graphQlClient = getGQLClient();
  const sdk = allCatIdSdk(graphQlClient);
  try {
    const categoriesObj = await sdk.GetAllCategoriesIdsStrapi();
    const categories = categoriesObj.categories?.data.map((cat) => {
      return cat.attributes;
    });

    return {
      paths: categories?.map((c) => {
        return {
          params: { categorySlug: c?.slug },
        };
      }),
      fallback: true,
    };
  } catch (e) {
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const categorySlug = context.params?.categorySlug as string;

  const graphQlClient = getGQLClient();
  const sdk = resInCatSdk(graphQlClient);
  try {
    const categoryAndResource = await sdk.GetResourcesInCategoryStrapi({
      categorySlug: { eq: categorySlug },
    });
    const category = categoryAndResource.categories?.data.map((cat) => {
      return cat.attributes;
    })?.[0];
    const resources = categoryAndResource.resources?.data.map((res) => {
      return { id: res.id, ...res.attributes };
    });

    if (!resources || !category) {
      return {
        props: {},
        notFound: true,
      };
    }

    const tagsSet = new Set();
    const tags: { name: string; id: string }[] = [];

    resources?.forEach((resource) => {
      resource?.tags?.data?.forEach((tag) => {
        if (!tagsSet.has(tag.attributes?.notionItemId)) {
          tags.push({
            name: tag.attributes?.name as string,
            id: tag.attributes?.notionItemId as string,
          });
          tagsSet.add(tag.attributes?.notionItemId);
        }
      });
    });

    return {
      props: {
        resources,
        category,
        tags: getTagsForResourceList(resources as ProcessedResource[]),
        countries: getCountriesForResourceList(
          resources as ProcessedResource[]
        ),
      },
      revalidate: 10,
    };
  } catch (e) {
    return {
      props: {},
      notFound: true,
    };
  }
}

export default function ResoucesInCategory({
  resources,
  category,
  tags,
  countries,
}: InferGetServerSidePropsType<typeof getStaticProps>) {
  const { status } = useSession();
  const [savedReources, setSavedReources] = useState<{
    [id in string]: boolean;
  }>({} as { id: boolean });
  const client = getGraphQLClient();
  const { data } = useCurrentUserQuery(client, undefined, {
    enabled: status === "authenticated",
  });

  useEffect(() => {
    if (status === "authenticated") {
      if (data?.currentUser?.savedResources) {
        setSavedReources(
          data.currentUser.savedResources.reduce((prev, curr) => {
            prev[curr.resourceId] = true;
            return prev;
          }, {} as { [id in string]: boolean })
        );
      }
    }
  }, [data?.currentUser?.savedResources, status]);

  if (!resources) {
    return <></>;
  }
  return (
    <Layout>
      <Head>
        <title>{category?.name} | Mission Sustainability</title>
        <meta name="description" content={category?.description!} />
        <meta
          property="og:url"
          content="https://resources.missionsustainability.org/water-conservation"
        />
        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content={category?.name + "| Mission Sustainability"}
        />
        <meta property="og:description" content={category?.description!} />
        {/* <meta property="og:image" content="" /> */}

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:domain"
          content="resources.missionsustainability.org"
        />
        <meta
          property="twitter:url"
          content="https://resources.missionsustainability.org/water-conservation"
        />
        <meta
          name="twitter:title"
          content={category?.name + "| Mission Sustainability"}
        />
        <meta name="twitter:description" content={category?.description!} />
        {/* <meta name="twitter:image" content="" /> */}
      </Head>
      <Link href="/">
        <a
          href="/"
          className="flex items-center space-x-2 mb-6 text-gray-600 font-medium group leading-7"
        >
          <ArrowNarrowLeftIcon
            height={20}
            width={20}
            className="translate-x-0 group-hover:-translate-x-1 transition-all"
          />
          <span>All Categories</span>
          <span>/</span>
        </a>
      </Link>
      <SortAndFilterProvider resources={resources as ProcessedResource[]}>
        <div className="border-b border-gray-200 pb-10">
          <div
            className="p-6 sm:py-12 sm:px-10 rounded-lg mb-8"
            style={{
              backgroundColor: category?.bgColor || "#e4faf1",
            }}
          >
            <div className="flex items-center space-x-4 mb-4">
              <Image
                src={(category.logo?.data?.attributes?.url as string) ?? ""}
                height={40}
                width={40}
                alt="category logo"
              />
              <H1 className="text-2xl sm:text-4xl font-bold text-gray-800 ">{category?.name}</H1>
            </div>
            <div className="text-gray-600 max-w-4xl">
              {category?.description}
            </div>
          </div>
          <div className="md:flex mb-6">
            <ResourceFilter
              tags={tags as SelectedOptions}
              countries={countries}
            />
          </div>
        </div>
        <ResourceList
          category={category as Category}
          savedReources={savedReources}
        />
      </SortAndFilterProvider>
    </Layout>
  );
}
