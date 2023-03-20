import { ArrowLeftIcon, ArrowRightIcon } from "@untitledui/icons/duotone";
import { BlogCard } from "./cards/Blogs";
import { Blogs } from "../utils/constants";
import { useRef } from "react";
import { scrollUtil } from "../utils/scroll";
export const Articles = () => {
  const scrollRef = useRef(null);
  const scroll = (scrollRefOffset: number) => {
    scrollUtil(scrollRef, scrollRefOffset);
  };
  return (
    <>
      <div className="sm:px-7 lg:px-16 mx-auto flex flex-col mt-16 p-10 pr-0 overflow-hidden">
        <div className="flex w-full justify-between items-center">
          <h3 className="font-dmsans font-bold text-2xl">
            Articles & guides for positive changes
          </h3>
          <div className="flex space-x-2 pr-7 pl-2">
            <ArrowLeftIcon
              className="rounded-full h-10 p-2 border-2 border-gray-300"
              onClick={() => scroll(-500)}
            />
            <ArrowRightIcon
              className="rounded-full h-10 p-2 border-2 border-gray-300"
              onClick={() => scroll(500)}
            />
          </div>
        </div>
        <div className="flex flex-wrap md:flex-nowrap w-full mt-16">
          {/* <div className="flex flex-col items-center justify-center m-auto lg:mx-10 max-w-[300px]">
            <img src="/illustrations/reading-side.png" className="px-10" />
            <p className="text-lg lg:text-xl mt-5 lg:mt-12 ">
              Actionable insights from sustainability enthusiasts
            </p>
          </div> */}
          <div
            className="flex flex-col flex-wrap w-full mt-12 h-[470px] items-start content-start space-x-3 md:space-x-8 overflow-x-scroll scroll-smooth no-scrollbar "
            ref={scrollRef}
          >
            {Blogs.map((blog, index) => {
              return <BlogCard key={index} {...blog} />;
            })}
          </div>
        </div>
      </div>
    </>
  );
};
