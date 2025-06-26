import { useState } from "react";
import { AiOutlineEye } from "react-icons/ai";
import { useDeleteNews, useNews, useUpdateNews } from "../../app/store/useNews";
import { useToastStore } from "../../app/store/useToastStore";
import StatistikAdmin from "./StatistikAdmin";

const Posts = () => {
  const { data } = useNews();
  const postsData = data?.data?.news || [];

  const deleteNews = useDeleteNews();
  const updateNews = useUpdateNews();
  const setToast = useToastStore((state) => state.setToast);

  const [filterType, setFilterType] = useState("all");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editMedia, setEditMedia] = useState("");
  const [mediaFile, setMediaFile] = useState(null);
  const [mediaType, setMediaType] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedIdToDelete, setSelectedIdToDelete] = useState(null);

  const adminSource = postsData.filter((post) => post.source === "admin");

  const filteredPosts = adminSource.filter((post) => {
    if (filterType === "Image") return !!post.newsImage && !post.newsVideo;
    if (filterType === "Video") return !!post.newsVideo;
    return true;
  });

  const handleEdit = (post) => {
    setEditingId(post._id);
    setEditTitle(post.title);
    setEditDescription(post.description);
    const media = post.newsVideo || post.newsImage || "";
    setEditMedia(media);
    setMediaType(post.newsVideo ? "video" : "image");
    setMediaFile(null);
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setMediaFile(file);
      setEditMedia(url);
      setMediaType(file.type.startsWith("video") ? "video" : "image");
    }
  };

  const handleSave = (id) => {
    setUpdatingId(id);
    const formData = new FormData();
    formData.append("title", editTitle);
    formData.append("description", editDescription);
    if (mediaFile) {
      const isVideo = mediaFile.type.startsWith("video");
      formData.append(isVideo ? "newsVideo" : "newsImage", mediaFile);
    }

    updateNews.mutate(
      { id, data: formData },
      {
        onSuccess: () => {
          setToast({ type: "success", message: "Postingan berhasil diubah!" });
          setEditingId(null);
          setMediaFile(null);
        },
        onError: () => {
          setToast({ type: "error", message: "Gagal mengubah postingan!" });
        },
        onSettled: () => {
          setUpdatingId(null);
        },
      }
    );
  };

  const handleConfirmDelete = (id) => {
    setSelectedIdToDelete(id);
    setShowConfirmModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex gap-2 mb-4">
        {["all", "Image", "Video"].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-2 rounded-lg border cursor-pointer ${
              filterType === type
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-800"
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Statistik Admin */}
      <StatistikAdmin />

      {/* Post Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPosts.map((post) => (
          <div
            key={post._id}
            className="relative bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border"
          >
            {updatingId === post._id && (
              <div className="absolute inset-0 bg-white/60 z-10 flex items-center justify-center">
                <span className="loading loading-spinner loading-lg text-indigo-600" />
              </div>
            )}

            {editingId === post._id ? (
              <div className="p-4 space-y-2">
                <input
                  type="file"
                  accept="image/*,video/*"
                  onChange={handleMediaChange}
                  className="w-full text-sm cursor-pointer"
                />
                {mediaType === "video" ? (
                  <video
                    controls
                    src={editMedia}
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                ) : (
                  <img
                    src={editMedia}
                    alt="Preview"
                    className="w-full h-40 object-cover rounded-lg border"
                  />
                )}
              </div>
            ) : post.newsVideo ? (
              <video
                src={post.newsVideo}
                controls
                className="w-full h-40 object-cover rounded-lg"
              />
            ) : (
              <img
                src={post.newsImage}
                alt={post.title}
                className="w-full h-40 object-cover rounded-lg"
              />
            )}

            <div className="p-4 space-y-2">
              {editingId === post._id ? (
                <>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Judul"
                  />
                  <textarea
                    value={editDescription}
                    onChange={(e) => setEditDescription(e.target.value)}
                    className="w-full border rounded px-3 py-2 text-sm"
                    placeholder="Deskripsi"
                  />
                  <button
                    onClick={() => handleSave(post._id)}
                    className="btn btn-success btn-sm mt-2 flex items-center gap-2"
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

              <div className="flex justify-between items-center mt-4">
                <div className="flex items-center gap-1 text-gray-500 text-sm">
                  <AiOutlineEye className="w-4 h-4" />
                  <span>{post.views}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <button
                    onClick={() => handleEdit(post)}
                    className="text-blue-600 cursor-pointer"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => handleConfirmDelete(post._id)}
                    className="text-red-600 cursor-pointer"
                    disabled={
                      deleteNews.isLoading && selectedIdToDelete === post._id
                    }
                  >
                    {deleteNews.isLoading && selectedIdToDelete === post._id ? (
                      <span className="loading loading-spinner loading-sm" />
                    ) : (
                      "🗑️"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Konfirmasi Hapus */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg space-y-4">
            <h2 className="text-lg font-semibold">Konfirmasi Hapus</h2>
            <p className="text-sm text-gray-600">
              Apakah kamu yakin ingin menghapus postingan ini?
            </p>
            <div className="flex justify-end gap-2 pt-2">
              <button
                className="btn btn-sm btn-outline"
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedIdToDelete(null);
                }}
              >
                Batal
              </button>
              <button
                className="btn btn-sm btn-error text-white"
                onClick={() => {
                  deleteNews.mutate(selectedIdToDelete, {
                    onSuccess: () => {
                      setToast({
                        type: "success",
                        message: "Berhasil dihapus!",
                      });
                    },
                    onError: () => {
                      setToast({
                        type: "error",
                        message: "Gagal menghapus data!",
                      });
                    },
                    onSettled: () => {
                      setShowConfirmModal(false);
                      setSelectedIdToDelete(null);
                    },
                  });
                }}
              >
                {deleteNews.isLoading ? (
                  <span className="loading loading-spinner loading-sm" />
                ) : (
                  "Ya, Hapus"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Posts;
