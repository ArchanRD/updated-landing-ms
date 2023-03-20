import { ArrowRightIcon } from "@untitledui/icons/duotone";
import { GoogleIcon } from "@untitledui/icons/social";
import Link from "next/link";
import Image from "next/image";
import Avatar from "../../assets/images/Avatar.png";
import Avatar1 from "../../assets/images/Avatar-1.png";
import Avatar2 from "../../assets/images/Avatar-2.png";
import Avatar3 from "../../assets/images/Avatar-3.png";
import { useState } from "react";
import { Slide } from "./Slide";
type MainSlideProps = {
  slide: number;
};
export const MainSlide = ({ slide }: MainSlideProps) => {
  return (
    <>
      <div className="flex flex-wrap w-full justify-between transition-all">
        <Slide slide={slide}></Slide>
        <div className="flex items-start flex-col lg:max-w-[65%] xl:max-w-[56%] mx-auto lg:mr-0 lg:ml-12">
          {slide === 0 && (
            <div>
              <div className="flex flex-col lg:hidden space-y-2">
                <div className="flex flex-col">
                  <span className="bg-[#FDEBCF] rounded-full h-8 w-8 m-2 ml-0 shrink-0">
                    {" "}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    Place to foster sustainability
                  </h3>
                </div>
                <div className="font-dmsans font-normal text-base space-y-2 mb-8">
                  <p className="font-dmsans text-lg text-gray-700 sm:text-base font-normal pb-8">
                    Engage with your customers to win their loyalty & increase
                    your sales using our features of Website, Feedback & SMS
                    campaigns, Loyalty programmes, & Customers Wallet
                  </p>
                  {/* <Link href="#">
                    <div className="inline-flex space-x-4 py-8">
                      <span className="underline sm:no-underline font-bold">
                        Explore feed
                      </span>
                      <ArrowRightIcon className="h-6 w-6"></ArrowRightIcon>
                    </div>
                  </Link> */}
                </div>
              </div>
              <img
                src="/images/slider-main.png"
                className="shrink-0 object-contain aspect-w-792 aspect-h-616"
              ></img>
            </div>
          )}
          {slide === 1 && (
            <div>
              <div className="flex flex-col lg:hidden space-y-2">
                <div className="flex  flex-col">
                  <span className="bg-[#FDEBCF] rounded-full h-8 w-8 m-2 ml-0 shrink-0">
                    {" "}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    Connect with people & take actions
                  </h3>
                </div>
                <div className="font-dmsans font-normal text-base space-y-2 mb-8">
                  <p className="font-dmsans text-lg text-gray-700 sm:text-base font-normal pb-8">
                    Meet like minded people locally or globally to accelerate
                    you sustainability journey.
                  </p>
                  {/* <Link href="#">
                    <div className="inline-flex space-x-4 py-8">
                      <span className="underline sm:no-underline font-bold">
                        Explore feed
                      </span>
                      <ArrowRightIcon className="h-6 w-6"></ArrowRightIcon>
                    </div>
                  </Link> */}
                </div>
              </div>
              <img
                src="/images/map.png"
                className="shrink-0 object-contain aspect-w-792 aspect-h-616"
              ></img>
            </div>
          )}
          {slide === 2 && (
            <div>
              {" "}
              <div className="flex flex-col lg:hidden space-y-2">
                <div className="flex flex-col">
                  <span className="bg-[#FDEBCF] rounded-full h-8 w-8 m-2 ml-0 shrink-0">
                    {" "}
                  </span>
                  <h3 className="text-xl font-bold text-gray-800">
                    Place to foster sustainability
                  </h3>
                </div>
                <div className="font-dmsans font-normal text-base space-y-2 mb-8">
                  <p className="font-dmsans text-lg text-gray-700 sm:text-base font-normal pb-8">
                    Share your knowledge and experiences to help others adopt
                    eco-centric lifestyle. Every small step matters.
                  </p>
                  {/* <Link href="#">
                    <div className="inline-flex space-x-4 py-8">
                      <span className="underline sm:no-underline font-bold">
                        Explore feed
                      </span>
                      <ArrowRightIcon className="h-6 w-6"></ArrowRightIcon>
                    </div>
                  </Link> */}
                </div>
              </div>
              <img
                src="/images/change.png"
                className="shrink-0 object-contain aspect-w-792 aspect-h-616"
              ></img>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
