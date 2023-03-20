import Link from "next/link";
import Image from "next/image";
import React, { useState } from "react";
import Avatar from "../../assets/images/Avatar.png";
import Avatar1 from "../../assets/images/Avatar-1.png";
import Avatar2 from "../../assets/images/Avatar-2.png";
import Avatar3 from "../../assets/images/Avatar-3.png";
import { GoogleIcon } from "@untitledui/icons/social";
import { ArrowRightIcon } from "@untitledui/icons/duotone";
import { AboutAndInfo } from "../../utils/constants";
type Props = {
  title: string;
  about: string;
  isLit: boolean;
};
const Row = React.memo(({ title, about, isLit }: Props) => {
  const [show, setShow] = useState(isLit);
  return (
    <div className="hidden lg:flex flex flex-col pb-8 md:pb-5 justify-evenly lg:border-b-2 border-white">
      <div className="flex flex-col space-y-2">
        <div className="flex flex-col-reverse sm:items-center sm:flex-row space-x-2">
          <span
            className="bg-[#FDEBCF] rounded-full h-8 w-8 m-2 ml-0 shrink-0"
            onClick={() => {
              setShow((prev) => !prev);
            }}
          >
            {" "}
          </span>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
        </div>
        {show && (
          <div className="font-dmsans font-normal text-base flex flex-col space-y-2">
            <p className="font-dmsans text-lg text-gray-700 sm:text-base font-normal">
              {about}
            </p>
            {/* <Link href="#">
              <div className="inline-flex space-x-4">
                <span className="underline sm:no-underline font-bold">
                  Explore feed
                </span>
                <ArrowRightIcon className="h-6 w-6"></ArrowRightIcon>
              </div>
            </Link> */}
          </div>
        )}
      </div>
    </div>
  );
});
type SlideProps = {
  slide: number;
};
export const Slide = ({ slide }: SlideProps) => {
  return (
    <>
      <div className="hidden lg:flex flex-col w-full lg:max-w-[30%] xl:max-w-[40%] justify-around">
        {AboutAndInfo.map((info, index) => {
          return <Row key={index} {...info} isLit={slide === index} />;
        })}
        <div className="hidden lg:block">
          <h1 className="font-dmsans sm:text-lg font-normal">
            Join the community & find your sustainability tribe
          </h1>
          <div className="my-4">
            <div className="flex">
              <div>
                <Image
                  src={Avatar}
                  width={32}
                  height={32}
                  alt="rounded image"
                />
              </div>
              <div className="ml-[-5px]">
                <Image
                  src={Avatar1}
                  width={32}
                  height={32}
                  alt="rounded image"
                />
              </div>
              <div className="ml-[-5px]">
                <Image
                  src={Avatar2}
                  width={32}
                  height={32}
                  alt="rounded image"
                />
              </div>
              <div className="ml-[-5px]">
                <Image
                  src={Avatar3}
                  width={32}
                  height={32}
                  alt="rounded image"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Social login */}
        <div className="flex flex-col space-y-2">
          <Link
            href="#"
            className="hidden lg:flex bg-gray-800 py-4 px-6 justify-center items-center w-max rounded text-white gap-2"
          >
            <div className="inline flex items-center space-x-2 bg-gray-800 h-12 text-white px-5 py-2 rounded font-inter text-base font-medium w-56 justify-center">
              <GoogleIcon className="h-[13.33px] w-[13.33px]" />
              <h1 className="font-dmsans font-normal text-base">
                Join with Google
              </h1>
            </div>
          </Link>
          <Link
            href="#"
            className="hidden lg:flex bg-gray-800 py-4 px-6 justify-center items-center w-max rounded text-white gap-2"
          >
            <div className="inline flex items-center justify-center space-x-2 border-[1px] h-12 border-gray-800 rounded font-inter text-base font-medium px-5 py-2 w-56">
              <h1 className="font-dmsans font-normal text-base">
                Explore feed
              </h1>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};
