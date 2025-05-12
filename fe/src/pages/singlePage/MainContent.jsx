import SideBar from "../../components/common/SideBar";

// icons
import { MdOutlineDateRange } from "react-icons/md";
import { MdOutlineCategory } from "react-icons/md";
import { MdOutlineComment } from "react-icons/md";

const News = {
  id: 1,
  title: "Test-1",
  description:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, voluptate.",
  img: "/weather/01.jpg",
  date: "2023-01-01",
  category: "Weather",
  comments: 10,
};

const MainContent = () => {
  const { title, description, img, date, category, comments } = News;

  return (
    <div className="grid grid-rows-1 md:grid-rows-1 lg:grid-cols-12 p-5 gap-2">
      <div className="lg:col-span-9 w-full flex flex-col items-center bg-gray-200 p-5 rounded-2xl">
        <h1 className="font-semibold text-3xl pb-5">{title}</h1>
        <div className="flex flex-col gap-3">
          <img src={img} alt={title} className="rounded-2xl" />
          <div className="flex flex-row justify-center gap-15 ">
            <div className="flex items-center gap-2">
              <MdOutlineDateRange />
              <h4 className="text-sm">{date}</h4>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineComment />
              <h4 className="text-sm">{comments}</h4>
            </div>
            <div className="flex items-center gap-2">
              <MdOutlineCategory />
              <h4 className="text-sm">{category}</h4>
            </div>
          </div>
        </div>
        <p className="pt-5 font-light">{description}</p>
      </div>
      <div className="lg:col-span-3 w-full">
        <SideBar />
      </div>
    </div>
  );
};

export default MainContent;
