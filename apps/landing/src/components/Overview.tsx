import { useState } from "react";

export const Overview = () => {
  const [searchText, setSearchText] = useState("");
  return (
    <>
      <div className="flex flex-col bg-[#FFFCF9]">
        <div className=" px-6 lg:px-16 mx-auto flex flex-col lg:flex-row items-start lg:items-center py-14 lg:py-28">
          <div className="lg:max-w-[50%] mx-auto lg:mx-0">
            <h2 className="m-auto py-10 lg:p-10 font-bold text-Inter text-2xl lg:text-4xl leading-loose">
              Get access to ever growing repository
            </h2>
          </div>
          <div className="flex flex-col lg:flex-row justify-center space-y-2 lg:space-x-2 lg:space-y-0">
            <div className="max-w-96 flex items-start h-14">
              <label htmlFor="search" className="sr-only">
                Quick search
              </label>
              <div className="relative flex items-center">
                <input
                  type="text"
                  name="search"
                  id="search"
                  aria-label="Search components"
                  placeholder=" enter email address"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  className="block w-96 h-12 rounded-md border-gray-300 pr-12 shadow-sm font-inter text-base font-medium text-gray-400 text-normal focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
            </div>
            <button className="bg-gray-800 text-white px-5 py-2 rounded font-inter text-base font-medium h-12 w-max">
              Explore now
            </button>
          </div>
        </div>
        <div className="mx-auto text-center bg-white pt-14 lg:pt-28 w-full ">
          <h1 className="font-bold text-3xl lg:text-5xl font-Inter">
            Overview Section
          </h1>
        </div>
        <div className="px-6 lg:px-16 mx-auto w-full overflow-clip bg-white mx-auto">
          <div className="rounded-t-full rounded-b-none w-full aspect-video bg-gray-100 mt-24"></div>
        </div>
      </div>
    </>
  );
};
