type FounderProps = {
  title: string;
  founder: string;
  company: string;
  photo: string;
  background: string;
};

export const Founder: React.FC<FounderProps> = (founders) => {
  return (
    <>
      <div
        className=" pl-3 pt-3 sm:pl-6 sm:pt-6 text-[#554419] rounded-lg h-64 w-80 xl:w-92 overflow-hidden m-3 mr-0 mt-0"
        style={{ backgroundColor: founders.background }}
      >
        <div className="flex flex-col justify-between h-full">
          <h3 className="font-bold text-md sm:text-xl pr-6">
            {founders.title}
          </h3>
          <div className="flex flex-row justify-between">
            <div className="flex flex-col font-dmsans sm:text-base justify-start h-fit my-auto">
              <p className="text-xs sm:font-normal mt-10">{founders.founder}</p>
              <p className="text-xs sm:font-normal mt-2 ">{founders.company}</p>
            </div>
            <div className="font-dmsans text-base font-normal max-w-[136px] mt-6">
              <img src={founders.photo}></img>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
