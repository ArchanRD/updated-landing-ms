import React from "react";

const Hero = () => {
  return (
    <div className="bg-[#FFFCF9] h-screen w-full flex overflow-hidden m-auto">
      <div className=" sm:px-6 lg:px-16 mx-auto mt-32 flex flex-col lg:flex-row lg:flex items-center justify-between">
        <div className="flex flex-col items-start flex-wrap px-7 md:px-0">
          <h1 className="font-poppins text-[32px] font-semibold leading-10 xl:leading-normal text-gray-800  lg:text-gray-700 lg:font-bold lg:text-6xl xl:text-6xl">
            Living sustainably simplified
          </h1>
          <p className="text-sm text-gray-500 mt-4 lg:mt-6 font-dmsans font-normal lg:text-xl xl:text-2xl">
            Knowledge, resources, & community to enable indivisuals &
            organisations make sustainable decisions
          </p>
          <button className="py-3 px-6 mt-10 lg:px-11 text-base lg:mt-16 font-medium lg:font-bold bg-[#059669] rounded text-white">
            Join now for free
          </button>
        </div>
        <div className="w-full xl:w-1/2 h-full px-7 md:px-0">
          <div className="flex items-center justify-center w-full h-full lg:w-[60vw] lg:h-[60vw] bg-[#F6F3ED] lg:rounded-full lg:ml-16 xl:ml-0 rounded-none mt-16 xl:mt-0">
            <p className="hidden lg:block xl:mb-24 xl:mr-16 font-dmsans font-normal text-gray-500 text-base w-72">
              Show person finding eco-friendly alternatives, connecting with
              other eco-conscious people & reading/consuming stories/info from
              knowledge hub
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
