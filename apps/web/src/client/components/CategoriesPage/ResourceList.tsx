import React from "react";
import { useSortAndFilter } from "../../hooks/context/FilterContext";
import ResourceCard from "../ResourcesPage/ResourceCard";
import RelatedContentCard from "./ReletaedContentCard";
import { Category, RelatedContent } from "../../graphql-strapi/types.generated";

type Props = {
  category: Category;
  savedReources: { [id in string]: boolean };
};

const ResourceList = ({ category, savedReources }: Props) => {
  const { fileteredResources } = useSortAndFilter();
  // const relatedContentLength = category.RelatedContent?.data.length || 0;
  const chunkSize = 5; // Math.floor(    fileteredResources.length / (relatedContentLength + 1)  );
  const fileteredResourcesParts = [];

  for (let i = 0; i < fileteredResources.length; i += chunkSize) {
    const chunk = fileteredResources.slice(i, i + chunkSize);
    fileteredResourcesParts.push(chunk);
    // do whatever
  }
  if(!fileteredResources || !fileteredResources?.length){
    return (
      <main className="grid min-h-full place-items-center bg-white py-24 px-6 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          no resources found matching your description
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Sorry, we couldn’t find the resources you’re looking for.
        </p>
      </div>
    </main>
    )
  }
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="divide-y mt-10 divide-gray-200 w-full space-y-2 lg:max-w-4xl flex-1 flex-shrink-0 md:col-span-8 lg:col-span-9">
        {fileteredResourcesParts.map((fileteredResources, index) => (
          <div key={index}>
            {fileteredResources.map((resource) => (
              <ResourceCard
                key={resource.id}
                {...resource}
                bgColor={category?.bgColor || "#e4faf1"}
                saved={savedReources?.[resource.id!] !== undefined}
              />
            ))}
            {category?.RelatedContent?.data?.[index]?.attributes && (
              <div className="block md:hidden mt-10 pt-8 h-auto pb-8">
                <RelatedContentCard
                  {...(category.RelatedContent.data?.[index]
                    ?.attributes as RelatedContent)}
                />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="hidden md:block mt-10 pt-8 h-auto md:col-span-4 lg:col-span-3 space-y-6">
        {category?.RelatedContent?.data?.map((rc) =>
          (rc.attributes?.RelatedContentType as string) === "Youtube Video" &&
          rc.attributes?.videoUrl ? (
            <iframe
              key={rc.id}
              className="aspect-vertical-video w-full rounded-md mt-10"
              src={rc.attributes?.videoUrl}
              title={rc.attributes?.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          ) : (
            <RelatedContentCard
              key={rc.attributes?.title}
              {...(rc as RelatedContent)}
            />
          )
        )}
      </div>
    </div>
  );
};

export default ResourceList;
