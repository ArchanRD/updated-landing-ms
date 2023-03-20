type Resource = {
  color: string;
  title: string;
  emoji: string;
};
type CardProps = {
  resource: Resource;
};

export const ResourceCard: React.FC<CardProps> = ({ resource }) => {
  return (
    <div
      className="flex flex-col items-end w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] rounded-md"
      style={{ backgroundColor: resource.color }}
    >
      <div className="flex flex-col items-start justify-around p-8 h-1/2 w-full flex-wrap">
        <span className="text-2xl leading-6">{resource.emoji}</span>
        <h2 className="font-semibold text-gray-700 text-md sm:text-2xl">
          {resource.title}
        </h2>
      </div>
      {/* <div className="flex flex-col h-1/2 w-full items-end justify-end pt-24">
                  <Image
                    objectFit="contain"
                    src={resource.photo}
                    height="100%"
                    width="100%"
                  ></Image>
                </div> */}
    </div>
  );
};
