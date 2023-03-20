import { Founders } from "../utils/constants";
import { ArrowLeftIcon, ArrowRightIcon } from "@untitledui/icons/duotone";
import { useRef } from "react";
import { scrollUtil } from "../utils/scroll";
import { Founder } from "./cards/Founder";
export const Inspiration = () => {
  const scrollRef = useRef(null);
  const scroll = (scrollRefOffset: number) => {
    scrollUtil(scrollRef, scrollRefOffset);
  };
  return (
    <>
      <div className="sm:px-7 lg:px-16 mx-auto flex flex-col mt-16 p-10 overflow-hidden">
        <div className="flex w-full justify-between items-center">
          <h3 className="font-dmsans font-bold text-2xl">
            Inspiration from sustainability enablers
          </h3>
          <div className="flex space-x-2">
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
        <div className="flex flex-wrap md:flex-nowrap w-full mt-16 md:h-[540px] h-full">
          <div
            className="flex flex-wrap md:flex-col xl:flex-row items-center w-full justify-center md:justify-start items-start overflow-x-scroll scroll-smooth no-scrollbar mt-10 md:mt-0 "
            ref={scrollRef}
          >
            {Founders.map((founder, index) => {
              return <Founder key={index} {...founder}></Founder>;
            })}
          </div>
        </div>
      </div>
    </>
  );
};
