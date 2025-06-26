import { useState } from "react";
import { FaHeart, FaReply } from "react-icons/fa";
import {
  useAddComment,
  useAllComments,
  useLikeUnlike,
  useReplyComment,
} from "../../app/store/useActivities";

const CommentSection = ({ newsId, setToast }) => {
  const { data, isLoading } = useAllComments({ newsId });
  const comments = Array.isArray(data?.data?.comments)
    ? data.data.comments
    : [];

  const addComment = useAddComment();
  const replyComment = useReplyComment();
  const likeUnlike = useLikeUnlike();

  const [newComment, setNewComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(3);

  const buildNested = (comments) => {
    const map = {};
    comments.forEach((c) => (map[c._id] = { ...c, replies: [] }));
    const roots = [];
    comments.forEach((c) => {
      if (c.parentId) {
        map[c.parentId]?.replies.push(map[c._id]);
      } else {
        roots.push(map[c._id]);
      }
    });
    return roots;
  };

  const nestedComments = buildNested(comments);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    addComment.mutate(
      { newsId, text: newComment },
      {
        onSuccess: () => {
          setToast({ message: "Komentar ditambahkan", type: "success" });
          setNewComment("");
        },
        onError: () => {
          setToast({
            message: "Gagal menambahkan komentar, harus login dulu",
            type: "error",
          });
        },
      }
    );
  };

  const handleReply = (parentId, text) => {
    if (!text.trim()) return;
    replyComment.mutate(
      { newsId, parentId, text },
      {
        onSuccess: () => {
          setToast({ message: "Balasan dikirim", type: "success" });
        },
        onError: () => {
          setToast({ message: "Gagal membalas komentar", type: "error" });
        },
      }
    );
  };

  const handleLike = (commentId) => {
    likeUnlike.mutate(
      { type: "comment", targetId: commentId, newsId },
      {
        onSuccess: (data) => {
          const likedStatus = data?.data?.liked;
          if (likedStatus === true) {
            setToast({ message: "Komentar disukai", type: "success" });
          } else if (likedStatus === false) {
            setToast({ message: "Like komentar dibatalkan", type: "success" });
          } else {
            setToast({
              message: "Berhasil mengubah status like",
              type: "success",
            });
          }
        },
        onError: () => {
          setToast({ message: "Gagal menyukai komentar", type: "error" });
        },
      }
    );
  };

  if (isLoading) return <p>Loading komentar...</p>;

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white p-4 border rounded-lg shadow">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Tulis komentar Anda..."
          rows={3}
          className="w-full p-2 border border-gray-300 rounded resize-none text-sm"
        />
        <div className="mt-2 text-right">
          <button
            onClick={handleAddComment}
            className="bg-blue-600 text-white px-4 py-2 rounded text-sm hover:bg-blue-700 cursor-pointer"
          >
            Kirim Komentar
          </button>
        </div>
      </div>

      {nestedComments.length === 0 ? (
        <p className="text-sm text-gray-500">
          Belum ada komentar. Yuk jadi yang pertama!
        </p>
      ) : (
        nestedComments
          .slice(0, visibleComments)
          .map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              onLike={handleLike}
              onReply={handleReply}
            />
          ))
      )}

      {visibleComments < nestedComments.length && (
        <div className="text-center">
          <button
            onClick={() => setVisibleComments(visibleComments + 3)}
            className="text-sm text-blue-600 hover:underline cursor-pointer"
          >
            Lihat komentar lainnya
          </button>
        </div>
      )}
    </div>
  );
};

const CommentItem = ({ comment, onLike, onReply }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);

  const repliesToShow = showAllReplies
    ? comment.replies
    : comment.replies.slice(0, 1);

  return (
    <div className="pl-4 border-l border-gray-200 mb-4">
      <div className="flex gap-3">
        <img
          src={comment.userId?.avatar || "https://i.pravatar.cc/40"}
          alt="avatar"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">
            {comment.userId?.userName || "User"}
          </h4>
          <p className="text-xs text-gray-500">
            {new Date(comment.createdAt).toLocaleString()}
          </p>
          <p className="text-sm mt-1 text-gray-800">{comment.text}</p>
          <div className="flex gap-4 text-xs text-gray-600 mt-2">
            <button
              onClick={() => onLike(comment._id)}
              className="flex items-center gap-1"
            >
              <FaHeart className="text-red-500 cursor-pointer" />
              {comment.likes || 0}
            </button>

            <button
              onClick={() => setReplying(!replying)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <FaReply /> Balas
            </button>
          </div>

          {replying && (
            <div className="mt-2">
              <input
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Tulis balasan..."
                className="w-full border border-gray-300 p-2 rounded text-sm"
              />
              <button
                onClick={() => {
                  onReply(comment._id, replyText);
                  setReplyText("");
                  setReplying(false);
                }}
                className="mt-1 text-sm text-blue-600 cursor-pointer"
              >
                Kirim Balasan
              </button>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {repliesToShow.map((reply) => (
                <CommentItem
                  key={reply._id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                />
              ))}
              {!showAllReplies && comment.replies.length > 1 && (
                <button
                  onClick={() => setShowAllReplies(true)}
                  className="text-xs text-blue-500 mt-1 cursor-pointer"
                >
                  Lihat {comment.replies.length - 1} balasan lainnya
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentSection;
