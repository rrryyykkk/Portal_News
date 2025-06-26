import { Link } from "react-router-dom";

// Gambar default kategori
const categoriesImage = {
  Politics: "/categories/politics.jpg",
  Sport: "/sport/06.jpg",
  Technology: "/technology/01.jpg",
  Entertainment: "/categories/entertaiment.jpg",
  Business: "/categories/bisnis.jpg",
  Health: "/categories/health.jpg",
  general: "/categories/general.jpg",
  Other: "/categories/other.jpg",
};

const Category = ({ news }) => {
  
  const getUniqueCategories = (news, limit = 7) => {
    const map = new Map();

    news.forEach((item) => {
      const rawCategory = item?.category;
      if (!rawCategory) return; // Skip jika category undefined/null

      const normalized =
        rawCategory[0].toUpperCase() + rawCategory.slice(1).toLowerCase();
      const key = normalized.toLowerCase();

      if (!map.has(key)) {
        map.set(key, {
          id: item._id || item.id || key,
          text: normalized,
          img: categoriesImage[normalized] || categoriesImage["general"],
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
