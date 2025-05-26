/* eslint-disable no-unused-vars */
import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Dummy data
const dummyPosts = Array.from({ length: 6 }).map((_, i) => ({
  id: i + 1,
  title: `Judul Postingan ${i + 1}`,
  description: `Deskripsi untuk postingan ke-${i + 1}.`,
  image: `/animal/0${(i % 6) + 1}.jpg`,
  views: Math.floor(Math.random() * 500 + 100),
  likes: Math.floor(Math.random() * 100),
}));

const Posts = () => {
  const [posts, setPosts] = useState(dummyPosts);
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImage, setEditImage] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleEdit = (post) => {
    setEditingId(post.id);
    setEditTitle(post.title);
    setEditDescription(post.description);
    setEditImage(post.image);
    setImageFile(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const imageUrl = URL.createObjectURL(file);
      setEditImage(imageUrl);
    }
  };

  const handleSave = (id) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === id
          ? {
              ...post,
              title: editTitle,
              description: editDescription,
              image: editImage,
            }
          : post
      )
    );
    setEditingId(null);
    setImageFile(null);
  };

  const handleDelete = (id) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const totalLikes = posts.reduce((sum, post) => sum + post.likes, 0);

  const chartData = {
    labels: posts.map((post) => `Post ${post.id}`),
    datasets: [
      {
        label: "Likes",
        data: posts.map((post) => post.likes),
        backgroundColor: "#6366f1",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Jumlah Likes per Postingan" },
    },
  };

  return (
    <div className="space-y-6">
      {/* Statistik */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4">Statistik Post</h2>
          <Bar data={chartData} options={chartOptions} />
        </div>
        <div className="bg-white p-6 rounded-xl shadow-md flex flex-col justify-center items-center">
          <h2 className="text-xl font-semibold mb-2">Total Likes</h2>
          <p className="text-4xl font-bold text-indigo-600">{totalLikes}</p>
        </div>
      </div>

      {/* Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
          >
            {/* Gambar atau Input Gambar */}
            {editingId === post.id ? (
              <div className="p-4 space-y-2">
                <input
                  type="text"
                  className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={editImage}
                  onChange={(e) => setEditImage(e.target.value)}
                  placeholder="URL Gambar (opsional)"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-sm cursor-pointer"
                />
                {editImage && (
                  <img
                    src={editImage}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                )}
              </div>
            ) : (
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-40 object-cover"
              />
            )}

            {/* Konten */}
            <div className="p-4 space-y-2">
              {editingId === post.id ? (
                <>
                  <input
                    type="text"
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    placeholder="Judul"
                  />
                  <textarea
                    className="w-full border rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    placeholder="Deskripsi"
                  />
                  <button
                    onClick={() => handleSave(post.id)}
                    className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600 text-sm transition cursor-pointer"
                  >
                    💾 Simpan
                  </button>
                </>
              ) : (
                <>
                  <h3 className="font-semibold text-base md:text-lg">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600">{post.description}</p>
                </>
              )}

              {/* Footer Aksi */}
              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <AiOutlineEye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>

                <div className="flex items-center gap-3 text-sm">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-600 hover:text-blue-800 transition cursor-pointer"
                    title="Edit"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800 transition cursor-pointer"
                    title="Hapus"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Posts;
