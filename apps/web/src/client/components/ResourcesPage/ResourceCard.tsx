import { useQueryClient } from "@tanstack/react-query";
import { Button, H2 } from "@untitledui/core";
import {
  BookmarkCheckIcon,
  BookmarkIcon,
  LinkExternal02Icon,
  MarkerPin02Icon,
} from "@untitledui/icons/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { getGraphQLClient } from "../../graphql/client";
import {
  useRemoveSavedResourceMutation,
  useSaveResourceMutation,
} from "../../graphql/saveResource.generated";
import { ProcessedResource } from "../../hooks/context/FilterContext";

type Props = ProcessedResource & {
  bgColor: string;
  showLearnMoreLink?: boolean;
  saved?: boolean;
};
type TagProps = {
  tags: Props["tags"];
};

const Tags: React.FC<TagProps> = ({ tags }) => (
  <div className="flex flex-wrap">
    {tags?.data?.map((tag) => (
      <div
        key={tag.attributes?.name}
        className="py-1 px-2.5 bg-slate-100 text-sm rounded-md mr-3 mt-2 text-gray-700"
      >
        {tag.attributes?.name}
      </div>
    ))}
  </div>
);

type LocationProps = {
  address: ProcessedResource["address"];
};

const Location: React.FC<LocationProps> = ({ address }) => {
  const city = address?.[0]?.cityInfo?.city;
  const state = address?.[0]?.cityInfo?.state;
  const country = address?.[0]?.cityInfo?.country;

  if (!city && !state && !country) {
    return <div className="text-sm">Location not available</div>;
  }
  return (
    <div className="flex text-sm space-x-1 items-center">
      <MarkerPin02Icon height={16} width={16} />
      <div>
        {city && <span>{city + ","}&nbsp;</span>}
        {state && <span>{state + ","}&nbsp;</span>}
        {country && <span>{country}</span>}
      </div>
    </div>
  );
};

const ResourceCard = ({
  logo,
  slug,
  name,
  analyticsURL,
  address,
  url,
  bgColor,
  tags,
  description,
  showLearnMoreLink = true,
  id,
  saved = false,
}: Props) => {
  const client = getGraphQLClient();
  const queryClient = useQueryClient();
  const { mutateAsync: saveResource, isLoading: isSaving } =
    useSaveResourceMutation(client, {
      onSuccess: () => queryClient.invalidateQueries(["currentUser"]),
    });

  const { mutateAsync: removeSavedResource, isLoading: isRemoving } =
    useRemoveSavedResourceMutation(client, {
      onSuccess: () => queryClient.invalidateQueries(["currentUser"]),
    });

  let message = "Save";
  if (isSaving) {
    message = "Saving...";
  } else if (isRemoving) {
    message = "Removing...";
  } else if (saved) {
    message = "Saved";
  }

  return (
    <div className="py-8 space-y-4">
      <div className="mb-4 md:flex justify-between items-start">
        <div className="flex space-x-4 ">
          {logo ? (
            <Link href={"resource/" + slug}>
              <div className="h-20 aspect-square border border-gray-200 rounded-lg p-1 hover:border-gray-600 hover:shadow-sm transition-all">
                <Image
                  src={
                    logo.data?.attributes?.url
                      ? logo.data.attributes.url
                      : "/android-chrome-384x384.png"
                  }
                  height={70}
                  width={70}
                  className="object-contain w-20 h-20 bg-slate-50"
                  alt={name + "logo"}
                />
              </div>
            </Link>
          ) : (
            <div className="h-20 w-20 bg-slate-100 rounded-lg"></div>
          )}
          <div className="space-y-1 py-2">
            <div className="group flex space-x-2 items-center mb-2">
              <H2>
                <a
                  href={analyticsURL!}
                  target="_blank"
                  className="hover-underline-animation"
                  rel="noreferrer"
                >
                  {name}
                </a>
              </H2>
              <LinkExternal02Icon
                height={18}
                width={18}
                strokeWidth={2}
                className="translate-x-0 translate-y-0 transition-all"
              />
            </div>
            <Location address={address} />
          </div>
        </div>
        {url && (
          <div className="py-3 flex space-x-4 items-center">
            <Button
              type="secondary-gray"
              Icon={saved ? BookmarkCheckIcon : BookmarkIcon}
              rounded={true}
              onClick={() =>
                saved
                  ? removeSavedResource({ resourceId: id as string })
                  : saveResource({ resourceId: id as string })
              }
            >
              {message}
            </Button>
            <a
              href={analyticsURL || url}
              className="flex justify-center md:mt-0 group space-x-2 py-2 px-4 rounded-full transition-all text-gray-600 bg-green-100 hover:bg-green-200 items-center hover:text-gray-800"
              style={{
                backgroundColor: bgColor || "#e4faf1",
              }}
              target="_blank"
              rel="noreferrer"
            >
              <span>Visit Website</span>
              <LinkExternal02Icon
                height={18}
                width={18}
                strokeWidth={2}
                className="translate-x-0 translate-y-0 transition-all"
              />
            </a>
          </div>
        )}
      </div>
      <Tags tags={tags} />
      <p className="text-gray-800 text-base pt-2 leading-6">
        {description}{" "}
        {showLearnMoreLink && (
          <Link href={"/resource/" + slug}>
            <a className="text-indigo-600">Learn more about {name}.</a>
          </Link>
        )}
      </p>
    </div>
  );
};

export default ResourceCard;
