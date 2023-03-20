import Image from "next/image";
import React from "react";
import AditiDeodhar from "../../public/images/review-profile-1.png";
import IshitPatel from "../../public/images/review-profile.png";

const Reviews = () => {
  return (
    <div className="px-6 lg:px-16 mx-auto my-24 lg:my-40 bg-white flex flex-wrap lg:flex-nowrap">
      <div className="flex flex-wrap items-center mx-auto sm:mx-0">
        <div className="bg-[#D9D9D9] w-16 h-16 rounded-full m-2 ml-0"></div>
        <h1 className="text-gray-400 text-3xl font-medium font-poppins leading-[48px]">
          Eco-repository for individuals & business
        </h1>
      </div>

      <div className="flex lg:justify-evenly flex-wrap lg:flex-nowrap mt-24 lg:mt-0 space-y-20 lg:space-y-0">
        {/* 1st review  */}
        <div className="lg:max-w-[33%]">
          {/* Profile header  */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full overflow-clip">
              <Image src={IshitPatel} alt="profile image" />
            </div>

            {/* Name  */}
            <div>
              <h1 className="font-poppins font-bold text-lg text-gray-800">
                Ishit Patel
              </h1>
              <p className="font-dmsans font-normal text-sm text-gray-500">
                Designer, Netherlands
              </p>
            </div>
          </div>
          <p className="font-dmsans font-normal text-lg text-gray-700">
            “ Through the community I found friends in Whitefield who were
            composting kitchen waste at home. Which made it super easy to get
            started in composting. ”
          </p>
        </div>

        {/* 2nd review  */}
        <div className="lg:max-w-[33%]">
          {/* Profile header  */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full overflow-clip">
              <Image src={AditiDeodhar} alt="profile image" />
            </div>
            {/* Name  */}
            <div>
              <h1 className="font-poppins font-bold text-lg text-gray-800">
                Aditi Deodhar
              </h1>
              <p className="font-dmsans font-normal text-sm text-gray-500">
                Founder, Brownleaf
              </p>
            </div>
          </div>
          <p className="font-dmsans font-normal text-lg text-gray-700">
            “ Do not be a lone fighter in sustainability. Its a recipe for
            frustration, for sure! ”
          </p>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
