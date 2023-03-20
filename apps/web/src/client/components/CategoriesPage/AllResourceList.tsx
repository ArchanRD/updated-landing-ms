import React from "react";
import {
  ProcessedResource
} from "../../hooks/context/FilterContext";
import ResourceCard from "../ResourcesPage/ResourceCard";
const AllResourceList = ({
  fileteredResources,
}: {
  fileteredResources: ProcessedResource[];
}) => {
  return (
    <div className="grid lg:grid-cols-12 gap-8">
      <div className="divide-y mt-10 divide-gray-200 space-y-2 lg:max-w-4xl flex-1 flex-shrink-0 md:col-span-8 lg:col-span-9">
        {fileteredResources.map((resource) => (
          <ResourceCard
            key={resource.id}
            {...resource}
            bgColor={
              resource.category?.data?.[0]?.attributes?.bgColor || "#e4faf1"
            }
            saved={undefined}
          />
        ))}
      </div>
    </div>
  );
};

export default AllResourceList;
