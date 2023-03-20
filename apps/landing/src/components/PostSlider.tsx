export const PostSlider = () => {
  return (
    <>
      <h2 className="leading-6 text-[#AD603E] text-2xl md:text-5xl  text-center mr-6 mt-32">
        Emerging society to make sustainable choices
      </h2>
      <div className="flex flex-col lg:flex-row">
        <div className="flex flex-col my-16">
          <div className="flex flex-wrap justify-evenly items-center">
            <div className="md:max-w-[418px] bg-[#F7BBA0] flex flex-col items-start justify-end rounded-md p-6 space-y-4 pt-10">
              <div className="flex space-x-2">
                <div className="bg-[#FFE1CB] w-7 h-7 rounded-full"> </div>
                <div className="bg-[#FFE1CB] w-20 h-7 rounded-full"> </div>
              </div>
              <p>
                Life update: Stopped using any sort of chemical for tooth care.
                I have switched to Shudh_hi’s ayurvedic...{" "}
              </p>
              <img src="/images/jar.png"></img>
            </div>
            <div className="lg:max-w-[33%] mt-20 px-6 lg:px-0">
              {/* Profile header  */}
              <div className="flex items-center gap-3 mb-6">
                <div className="w-16 h-16 rounded-full overflow-clip">
                  <img src="/images/jar-profile.png" />
                </div>

                {/* Name  */}
                <div>
                  <h1 className="font-poppins font-bold text-lg text-gray-800">
                    Himanjali Jala
                  </h1>
                  <p className="font-dmsans font-normal text-sm text-gray-500">
                    Product Manager, Bangalore
                  </p>
                </div>
              </div>
              <p className="font-dmsans font-normal text-lg text-gray-700">
                “I discovered Shudh_hi’s ayurvedic tooth powder through
                community. My oral health is no better now as I have stopped
                using harmful toothpastes. ”
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
