import React, { useState, useEffect } from "react";
import { PostSlider } from "./PostSlider";
import { MainSlide } from "./slides/Main";
import { Slide } from "./slides/Slide";

const Slider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide === 2 ? 0 : prevSlide + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#FFF6F4] w-full px-7 lg:pl-16 lg:pr-0 mx-auto flex flex-col">
      <div className="my-24 lg:mt-36 lg:mb-0">
        <p className="lg:hidden text-center text-base font-inter font-bold text-green-800 mb-4 ">
          ECO-COMMUNTITY
        </p>
        <h1 className="md:text-center xl:w-2/4 lg:text-left font-poppins font-semibold text-4xl text-center sm:text-left text-gray-800 sm:text-3xl md:text-5xl sm:leading-snug xl:leading-[72px]">
          Be part of sustainability focused community
        </h1>
      </div>

      <div className="hidden lg:block my-24 lg:mt-52 ">
        {
          <div>
            <MainSlide slide={currentSlide} />

            {/* <Slide slide={currentSlide}></Slide> */}
          </div>
        }
      </div>
      <div className="lg:hidden space-y-10">
        <MainSlide slide={0}></MainSlide>
        <MainSlide slide={1}></MainSlide>
        <MainSlide slide={2}></MainSlide>
      </div>
      <PostSlider></PostSlider>
    </div>
  );
};

export default Slider;
