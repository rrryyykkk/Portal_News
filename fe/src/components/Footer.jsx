import { IoMdMail } from "react-icons/io";
import { IoLogoInstagram } from "react-icons/io5";
import { FaXTwitter } from "react-icons/fa6";

const comments = [
  {
    id: 1,
    userName: "John Doe",
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 2,
    userName: "Joni Doe",
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 3,
    userName: "Johan Doe",
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 4,
    userName: "Jihan Doe",
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 5,
    userName: "Jihan OI",
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
  {
    id: 6,
    userName: "Jahan Juli",
    comment: "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
  },
];

const imgFooter = [
  {
    id: 1,
    img: "/footer/1.png",
  },

  {
    id: 2,
    img: "/footer/2.png",
  },
  {
    id: 3,
    img: "/footer/3.png",
  },
  {
    id: 4,
    img: "/footer/4.png",
  },

  {
    id: 5,
    img: "/footer/5.png",
  },
  {
    id: 6,
    img: "/footer/6.png",
  },

  {
    id: 7,
    img: "/footer/7.png",
  },

  {
    id: 8,
    img: "/footer/8.png",
  },

  {
    id: 9,
    img: "/footer/9.png",
  },
];

const categories = [
  {
    id: 1,
    text: "Culture",
  },
  {
    id: 2,
    text: "Fashion",
  },
  {
    id: 3,
    text: "Featured",
  },
  {
    id: 4,
    text: "Food",
  },
  {
    id: 5,
    text: "Healthy living",
  },
  {
    id: 6,
    text: "Technology",
  },
];
const Footer = () => {
  return (
    <footer className=" hidden md:block">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 bg-white py-5">
        {/* kiri */}
        <div className="grid grid-cols-1 gap-2 bg-gray-200 rounded-r-3xl w-full">
          {/* atas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6  ">
            {/* Kolom 1: Info & Newsletter */}
            <div className="space-y-5 pl-8 pt-2">
              <div className="flex items-center gap-2 pt-4 ">
                <div className="h-4  w-1 bg-[var(--primary-color)]"></div>
                <h2 className="text-2xl font-bold ">ZYnnn.news</h2>
              </div>
              <div>
                <p className="text-sm text-gray-700 mt-2">
                  ZYnnn.news adalah sebuah platform portal berita daring yang
                  berkomitmen untuk menghadirkan informasi yang akurat,
                  mendalam, dan berimbang kepada seluruh lapisan masyarakat.
                  Kami menyajikan ragam berita terkini dari berbagai sektor
                  seperti politik, ekonomi, teknologi, pendidikan, hingga gaya
                  hidup dengan mengedepankan prinsip jurnalisme profesional dan
                  independen.
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-4  w-1 bg-[var(--primary-color)]"></div>
                  <h2 className="text-2xl font-bold">Newsletters</h2>
                </div>
                <div className="relative mt-2">
                  <input
                    type="text"
                    className="input input-md w-full pr-10 border-none border-gray-300 rounded-md"
                    placeholder="Write your email"
                  />
                  <IoMdMail className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
                </div>
              </div>
            </div>
            {/* Kolom 2: Categories & Sosial */}

            {/* dekstop */}
            <div className="hidden lg:block space-y-5 pl-8 pt-2  ">
              <div className="grid grid-cols-1 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-4  w-1 bg-[var(--primary-color)]"></div>
                  <h2 className="text-2xl font-bold">Categories</h2>
                </div>
                <ul className="mt-5 space-y-4 text-sm text-gray-700 ">
                  {categories.map((item) => (
                    <li key={item.id}>
                      <a href="#" className="hover:text-[var(--primary-color)]">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-4  w-1 bg-[var(--primary-color)]"></div>
                  <h2 className="text-2xl font-bold">Social Network</h2>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/r3zkymrk?igsh=NXlhdHdla3dpdm1x"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#F45C9F] to-[#FF7563] text-white  hover:brightness-130"
                  >
                    <IoLogoInstagram className="w-5 h-5" />
                    Instagram
                  </a>
                  {/* Twitter */}
                  <a
                    href="https://x.com/rezkymubar76721?t=xEXpwvaA4y10zrymVWADAg&s=09"
                    target="_blank"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#15202B] hover:brightness-40"
                  >
                    <FaXTwitter className="text-white w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>

            {/* tablet */}
            <div className="hidden  lg:hidden  md:block space-y-5 pl-8 pt-2  ">
              <div className="grid grid-cols-1 pt-4 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-4  w-1 bg-[var(--primary-color)]"></div>
                  <h2 className="text-2xl font-bold">Categories</h2>
                </div>
                <ul className="mt-5 space-y-2 text-sm text-gray-700 ">
                  {categories.map((item) => (
                    <li key={item.id}>
                      <a href="#" className="hover:text-[var(--primary-color)]">
                        {item.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="grid grid-cols-1 px-4">
                <div className="flex items-center gap-2">
                  <div className="h-4  w-1 bg-[var(--primary-color)]"></div>
                  <h2 className="text-2xl font-bold">Social Network</h2>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  {/* Instagram */}
                  <a
                    href="https://www.instagram.com/r3zkymrk?igsh=NXlhdHdla3dpdm1x"
                    target="_blank"
                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-[#F45C9F] to-[#FF7563] text-white hover:brightness-130"
                  >
                    <IoLogoInstagram className="w-5 h-5" />
                    Instagram
                  </a>
                  {/* Twitter */}
                  <a
                    href="https://x.com/rezkymubar76721?t=xEXpwvaA4y10zrymVWADAg&s=09"
                    target="_blank"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-[#15202B] hover:brightness-40"
                  >
                    <FaXTwitter className="text-white w-5 h-5" />
                  </a>
                </div>
              </div>
            </div>
          </div>
          {/* Baris bawah */}
          <div className="flex items-center justify-between my-5 py-2 text-sm w-9/10 text-gray-500 bg-gray-300 rounded-r-md">
            <p className="font-semibold pl-4">
              Privacy Policy | Terms & Conditions
            </p>
            <p className="font-semibold pr-4">
              All Copyright &copy; 2025 Reserved
            </p>
          </div>
        </div>

        {/* kanan */}
        <div className="hidden lg:block">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 ">
            <div className="p-1.5">
              <div className="flex items-center gap-2">
                <div className="h-4  w-1 bg-[var(--primary-color)]"></div>
                <h2 className="text-2xl font-bold">New Comments</h2>
              </div>
              <ul className="mt-2 space-y-2">
                {comments.slice(0, 5).map((comment) => (
                  <li key={comment.id} className="bg-gray-200 p-3 rounded-md">
                    <h3 className="font-semibold text-sm">
                      {comment.userName}
                    </h3>
                    <p className="text-xs">{comment.comment}</p>
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-1.5">
              <div className="flex items-center gap-2">
                <div className="h-4 w-1 bg-[var(--primary-color)]"></div>
                <h2 className="text-2xl font-bold mb-2">Follow On Instagram</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {imgFooter.map((img) => (
                  <img
                    key={img.id}
                    src={img.img}
                    alt="img"
                    className="w-full h-24 object-cover rounded-md"
                    loading="lazy"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
