import { Button, Emoji, H2 } from "@untitledui/core";
import {
  ArrowNarrowLeftIcon,
  Globe01Icon,
  LinkExternal02Icon,
  Mail01Icon,
  Phone01Icon,
} from "@untitledui/icons/outline";
import {
  InferGetServerSidePropsType,
  GetStaticPathsContext,
  GetStaticPropsContext,
} from "next";

import Link from "next/link";
import Head from "next/head";
import Image from "next/image";
import Layout from "../../client/components/Layout";
import ResourceCard from "../../client/components/ResourcesPage/ResourceCard";

import { getGQLClient } from "../../utils/gqlClient";
import { getSdk as getAllResourcesSdk } from "../../client/graphql-strapi/getAllResourcesStrapi.generated";
import { getSdk as getResourcesBySlugSdk } from "../../client/graphql-strapi/getResourcesBySlugStrapi.generated";
import { ProcessedResource } from "../../client/hooks/context/FilterContext";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { getGraphQLClient } from "../../client/graphql/client";
import { useCurrentUserQuery } from "../../client/graphql/getCurrentUser.generated";
import { useEffect } from "react";

export async function getStaticPaths(context: GetStaticPathsContext) {
  const graphQlClient = getGQLClient();
  const sdk = getAllResourcesSdk(graphQlClient);
  try {
    const resourcesStrapi = await sdk.getAllResourcesStrapi();

    return {
      paths: resourcesStrapi?.resources?.data
        .filter((c) => {
          return c.attributes?.slug;
        })
        .map((c) => {
          return {
            params: { resourceSlug: c?.attributes?.slug },
          };
        }),
      fallback: true,
    };
  } catch (e) {
    console.error(e);
    return {
      paths: [],
      fallback: true,
    };
  }
}

export async function getStaticProps(context: GetStaticPropsContext) {
  const resourceSlug = context.params?.resourceSlug as string;

  const graphQlClient = getGQLClient();
  const sdk = getResourcesBySlugSdk(graphQlClient);

  try {
    const resourceStrapiObj = await sdk.GetResourceBySlugStrapi({
      resourceSlug: { eq: resourceSlug },
    });
    const resourceStrapi = resourceStrapiObj.resources?.data.map((reso) => {
      return {
        ...reso.attributes,
        id: reso.id,
      };
    });
    if (!resourceStrapi?.[0]) {
      return {
        props: {
          resource: null,
        },
        notFound: true,
      };
    }
    return {
      props: {
        resource: resourceStrapi[0],
      },
      revalidate: 10,
    };
  } catch (e) {
    console.error(e);
    return {
      props: {
        resource: null,
      },
      notFound: true,
    };
  }
}

export default function ResourcePage({
  resource,
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

  if (!resource) {
    return <></>;
  }
  return (
    <Layout>
      <Head>
        <title>{resource?.name} | Mission Sustainability</title>
        <meta name="description" content={resource?.description!} />
      </Head>
      <div className="flex items-center space-x-2 mb-6 text-gray-600 font-medium group leading-7">
        <Link href="/">
          <a className="flex items-center space-x-2">
            <ArrowNarrowLeftIcon
              height={20}
              width={20}
              className="translate-x-0 group-hover:-translate-x-1 transition-all"
            />
            <span>All Categories</span>
          </a>
        </Link>
        <span>/</span>
        <Link href={"/" + resource.category?.data?.[0]?.attributes?.slug}>
          <a className="flex items-center space-x-2">
            <Image
              className="text-xl"
              src={
                resource.category?.data?.[0]?.attributes?.logo?.data?.attributes
                  ?.url ?? "/favicons/android-chrome-384x384.png"
              }
              width={25}
              height={25}
              alt="resource logo"
            />
            <span>{resource.category?.data?.[0]?.attributes?.name}</span>
          </a>
        </Link>
      </div>

      <div className="divide-y mt-12 divide-gray-200 space-y-2 max-w-7xl">
        <ResourceCard
          {...(resource as ProcessedResource)}
          bgColor={
            resource.category?.data?.[0]?.attributes?.bgColor || "#e4faf1"
          }
          showLearnMoreLink={false}
          archive={false}
          saved={savedReources?.[resource.id!] !== undefined}
        />

        {(resource.email || resource.mobileNumber || resource.analyticsURL) && (
          <div className="pt-6">
            <H2>Contact</H2>
            <div className="grid md:grid-cols-2 gap-y-2 gap-x-4 my-6 max-w-md text-gray-800">
              {resource.mobileNumber && (
                <>
                  <div className="flex space-x-2 items-center">
                    <Phone01Icon height={18} width={18} />
                    <span>Phone:</span>
                  </div>
                  <div>{resource.mobileNumber}</div>
                </>
              )}
              {resource.email && (
                <>
                  <div className="flex space-x-2 items-center mt-4 md:mt-0">
                    <Mail01Icon height={18} width={18} />
                    <span>Email:</span>
                  </div>
                  <div>{resource.email}</div>
                </>
              )}
              {resource.analyticsURL && (
                <>
                  <div className="flex space-x-2 items-center mt-4 md:mt-0">
                    <Globe01Icon height={18} width={18} />
                    <span>Website:</span>
                  </div>
                  <Link href={resource.analyticsURL}>
                    <a className="flex space-x-2 items-center">
                      <span>{resource.url}</span>
                      <LinkExternal02Icon
                        height={18}
                        width={18}
                        strokeWidth={2}
                        className="translate-x-0 translate-y-0 transition-all"
                      />
                    </a>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}

        {resource.Products && (
          <div className="pt-6">
            <H2>Product & Services</H2>
            <div className="my-6 text-gray-800 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-12">
              {
                resource.Products.data.map((product) => (
                  // product.embedCode ? (
                  //   <div
                  //     className="products-item flex items-center justify-center"
                  //     key={product.id}
                  //     dangerouslySetInnerHTML={{
                  //       __html: product.embedCode || "",
                  //     }}
                  //   ></div>
                  // ) : (

                  <div key={product.attributes?.notionItemId}>
                    <div className="border rounded-lg border-slate-200 overflow-hidden flex items-center justify-center bg-slate-50 mb-4">
                      <Link href={product.attributes?.productLink || ""}>
                        <a className="flex">
                          <Image
                            // style={{padding:"20px"}}
                            src={
                              product.attributes?.productPhoto?.data?.[0]
                                ?.attributes?.url
                                ? product.attributes.productPhoto.data[0]
                                    .attributes.url
                                : ""
                            }
                            height={200}
                            width={200}
                            className="object-contain w-full h-full bg-slate-50 "
                            alt={product.attributes?.name + "logo"}
                          />
                        </a>
                      </Link>
                    </div>

                    <div className="capitalize text-base leading-6 font-medium mb-2 text-gray-800 line-clamp-1">
                      {product.attributes?.name}
                    </div>
                    <div className="text-xl leading-tight font-semibold  text-gray-800 mb-2">
                      {product.attributes?.price} {product.attributes?.currency}
                    </div>
                    <div className="text-sm leading-tight font-light text-gray-600 line-clamp-3">
                      {product.attributes?.description}
                    </div>
                    <Button
                      type="secondary-color"
                      className="w-full mt-4 flex items-center justify-center"
                      href={product.attributes?.productLink || ""}
                      disabled={!product.attributes?.productLink}
                      Icon={LinkExternal02Icon}
                      iconPosition="right"
                      target="_blank"
                      tag="link"
                    >
                      {product.attributes?.productLink
                        ? "Buy Now"
                        : "Coming Soon"}
                    </Button>
                  </div>
                ))
                // )
              }
            </div>
          </div>
        )}
        {resource.address && (
          <div className="pt-6">
            <H2>Location</H2>
            <div className="my-6 text-gray-800">
              {resource?.address?.map((addr) => {
                if (addr?.__typename === "ComponentAddressAddress") {
                  return addr?.address;
                }
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
