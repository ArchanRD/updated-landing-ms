type blog = {
  title: string;
  photo: string;
  tags: string[];
  description: string;
};

export const BlogCard: React.FC<blog> = (blog) => {
  return (
    <>
      <div className="flex flex-col w-72 h-full sm:w-80 bg-white rounded-md overflow-clip">
        <img src={blog.photo}></img>
        <div className="flex flex-col p-5 space-y-2 font-dmsans ">
          <span className="text-sm font-medium text-[#19A0A0]">
            {blog.tags.join(" • ")}
          </span>
          <h2 className="text-lg font-bold ">{blog.title}</h2>
          <p className="text-sm text-gray-500">{blog.description}</p>
        </div>
      </div>
    </>
  );
};
