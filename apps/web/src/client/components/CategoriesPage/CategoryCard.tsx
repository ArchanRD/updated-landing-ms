import { Button, Emoji, H2 } from "@untitledui/core";
import Link from "next/link";
import Image from "next/image";
import React from "react";
import { Category } from "../../graphql-strapi/types.generated";

type Props = NonNullable<Category>;

const CategoryCard = (cat: Props) => {
  return (
    <Link href={"/" + cat.slug}>
      <div
        className="p-8 rounded-md flex flex-col justify-between cursor-pointer"
        style={{
          backgroundColor: cat.bgColor || "#e4faf1",
        }}
      >
        <div className="flex items-center space-x-4 mb-4">
          <Image
            src={
              (cat.logo?.data?.attributes?.url as string) ??
              "/favicon/mstile-150x150"
            }
            height={40}
            width={40}
            alt={cat.name + " logo"}
          />
          <H2 className="font-semibold">{cat.name}</H2>
        </div>
        <div className="mb-8 text-gray-800">{cat.description}</div>
        <div className="flex justify-between items-center">
          <span className="text-gray-600">
            {cat?.resourceCount} organisations
          </span>
          <Button type="secondary-gray">Browse All</Button>
        </div>
      </div>
    </Link>
  );
};

export default CategoryCard;
