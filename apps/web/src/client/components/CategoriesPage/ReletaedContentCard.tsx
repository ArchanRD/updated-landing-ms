import Image from "next/image";
import React from "react";
import { RelatedContent } from "../../graphql-strapi/types.generated";

type Props = NonNullable<
  RelatedContent
>
const RelatedContentCard = ({ title, description, media }: Props) => {
  return !description ? (
    <></>
  ) : (
    <div className="rounded-md relative border border-slate-400">
      {media?.data?.attributes?.url && (
        <div className="relative aspect-video w-full">
          <Image
            layout="fill"
            objectFit="cover"
            className="rounded-t-md object-cover"
            src={
                media?.data?.attributes?.url ?? ""
            }
            alt="blog media"
          />
        </div>
      )}
      <div className="px-4 py-4 bg-slate-50 rounded-b-md">
        <h3 className="mb-4 font-semibold">{title}</h3>
        <div
          className="text-base md:text-sm prose leading-relaxed prose-a:text-green-900 prose:text-gray-800"
          dangerouslySetInnerHTML={{
            __html: description,
          }}
        />
      </div>
    </div>
  );
};

export default RelatedContentCard;
