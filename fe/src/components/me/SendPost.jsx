import { useState } from "react";
import NewsPostsIMG from "./posts/NewsPostsIMG";
import NewsPostsVideo from "./posts/NewsPostsVideo";

const SendPost = () => {
  const [sendTab, setSendTab] = useState("image");

  return (
    <div className="bg-white p-6 rounded shadow">
      <div className="flex gap-6 mb-4 border-b pb-2">
        {["image", "video"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSendTab(tab)}
            className={`text-sm font-medium cursor-pointer ${
              sendTab === tab
                ? "text-[var(--primary-color)] border-b-2 border-[var(--primary-color)]"
                : "text-gray-500"
            }`}
          >
            {tab === "image" ? "Post Gambar" : "Post Video"}
          </button>
        ))}
      </div>

      {sendTab === "image" && <NewsPostsIMG />}
      {sendTab === "video" && <NewsPostsVideo />}
    </div>
  );
};

export default SendPost;
