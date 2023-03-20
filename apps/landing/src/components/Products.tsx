import { useState, useRef } from "react";
import { Resources } from "../utils/constants";
import Image from "next/image";
import { ArrowLeftIcon, ArrowRightIcon } from "@untitledui/icons/duotone";
import { ResourceCard } from "./cards/Card";
import { scrollUtil } from "../utils/scroll";
import React from "react";

const Products = () => {
  const [searchText, setSearchText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (scrollRefOffset: number) =>
    scrollUtil(scrollRef, scrollRefOffset);
  return (
    <>
      <div className=" mt-24 mb-4 px-6 bg-white lg:pt-24 sm:px-16 lg:pb-14">
        <h1 className="uppercase sm:hidden font-dmsans text-center text-green-700 font-bold text-base mb-2">
          Eco-reposiotry
        </h1>
        <h1 className="text-gray-800 text-4xl font-semibold text-center font-poppins lg:text-4xl">
          Find eco-friendly products & services
        </h1>
        <p className="text-gray-500 text-lg font-dmsans text-center mt-4 lg:mt-2 lg:text-xl lg:text-gray-700 sm:mb-16">
          Make sustainable choices for day-to-day needs, social cause, society,
          or restoring lakes!
        </p>
      </div>
      <div className="pl-6 lg:px-16 mx-auto overflow-hidden">
        <div className=" mx-auto flex justify-center space-x-2">
          <div className="hidden lg:block w-96 flex items-start h-14">
            <label htmlFor="search" className="sr-only">
              Quick search
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="search"
                id="search"
                aria-label="Search components"
                placeholder=" Search planet-friendly products or services..."
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                className="block w-96 h-14 rounded-md border-gray-300 pr-12 shadow-sm font-inter text-base font-medium text-gray-400 text-normal focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              />
            </div>
          </div>
          <button className="bg-gray-800 h-10 text-white px-5 py-2 rounded font-inter text-base font-medium h-14">
            Explore repository
          </button>
        </div>
        <div
          ref={scrollRef}
          className="flex items-center space-y-8 w-full overflow-x-scroll no-scrollbar scroll-smooth"
        >
          <ArrowLeftIcon
            className="absolute hidden lg:block bg-white w-12 h-12 rounded-full p-3 left-8"
            onClick={() => scroll(-200)}
          />
          <div className="flex space-x-8">
            {Resources.map((resource, index) => {
              return (
                <ResourceCard key={index} resource={resource}></ResourceCard>
              );
            })}
            <div className="flex flex-col items-start space-y-4 w-[340px] h-[340px] rounded-md bg-[#F9FAFB] p-8 ">
              <h2 className="">
                Discover products & services in carbon emission control, green
                energy, sustainable consultancy, & more
              </h2>
              <button className="bg-gray-800 h-10 text-white px-5 py-2 rounded font-inter text-base font-medium h-14">
                Explore repository
              </button>
            </div>
          </div>
          <ArrowRightIcon
            className="absolute hidden lg:block bg-white w-12 h-12 rounded-full p-3 right-8"
            onClick={() => scroll(200)}
          />
        </div>
      </div>
    </>
  );
};

export default Products;
