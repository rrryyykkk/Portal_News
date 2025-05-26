import { Link } from "react-router-dom"; // jika pakai React Router

const Category = ({ news }) => {
  const getUniqueCategories = (news, limit = 7) => {
    const map = new Map();
    news.forEach((item) => {
      const key = item.category.toLowerCase();
      if (!map.has(key)) {
        map.set(key, {
          id: item.id,
          text: item.category,
          img: item.img,
        });
      }
    });
    return Array.from(map.values()).slice(0, limit);
  };

  const categories = getUniqueCategories(news);

  return (
    <div className="hidden lg:block">
      <div className="flex flex-row gap-5 p-5 items-center justify-center">
        {categories.map((category) => (
          <div key={category.id} className="mt-2">
            <div className="relative w-40 h-10">
              <Link to={`/category/${category.text.toLowerCase()}`}>
                <img
                  src={category.img}
                  alt={category.text}
                  className="bg-cover w-full h-full rounded-md blur-[1px] hover:blur-xs"
                />
                <h5 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white">
                  #{category.text}
                </h5>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Category;
