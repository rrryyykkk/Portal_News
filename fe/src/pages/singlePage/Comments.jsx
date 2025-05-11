import React, { useState } from "react";
import { FaHeart, FaReply } from "react-icons/fa";

// Data awal komentar
const initialComments = [
  {
    id: 1,
    user: "John Doe",
    avatar: "https://i.pravatar.cc/40?img=1",
    text: "Tulisan ini sangat informatif!",
    likes: 2,
    timestamp: "2025-05-11 09:00",
    replies: [
      {
        id: 11,
        user: "Alice",
        avatar: "https://i.pravatar.cc/40?img=2",
        text: "Saya setuju banget!",
        likes: 1,
        timestamp: "2025-05-11 09:15",
        replies: [],
      },
      {
        id: 12,
        user: "Bob",
        avatar: "https://i.pravatar.cc/40?img=3",
        text: "Mantap sekali penjelasannya.",
        likes: 0,
        timestamp: "2025-05-11 09:20",
        replies: [],
      },
    ],
  },
  {
    id: 2,
    user: "Jane Smith",
    avatar: "https://i.pravatar.cc/40?img=4",
    text: "Thanks for sharing.",
    likes: 5,
    replies: [],
  },
  {
    id: 3,
    user: "Bob Martin",
    avatar: "https://i.pravatar.cc/40?img=5",
    text: "Very informative!",
    likes: 2,
    replies: [],
  },
  {
    id: 4,
    user: "Emma Watson",
    avatar: "https://i.pravatar.cc/40?img=6",
    text: "Nice read, thank you!",
    likes: 1,
    replies: [],
  },
];

const CommentSection = () => {
  const [comments, setComments] = useState(initialComments);
  const [newComment, setNewComment] = useState("");
  const [visibleComments, setVisibleComments] = useState(3);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment = {
      id: Date.now(),
      user: "Anda",
      avatar: "https://i.pravatar.cc/40?img=8",
      text: newComment,
      likes: 0,
      timestamp: new Date().toLocaleString(),
      replies: [],
    };
    setComments([comment, ...comments]);
    setNewComment("");
  };

  const handleLike = (commentId, path = []) => {
    const updateLikes = (items, path) => {
      if (path.length === 0) {
        return items.map((item) =>
          item.id === commentId ? { ...item, likes: item.likes + 1 } : item
        );
      }
      return items.map((item) => {
        if (item.id === path[0]) {
          return {
            ...item,
            replies: updateLikes(item.replies, path.slice(1)),
          };
        }
        return item;
      });
    };

    setComments((prev) => updateLikes(prev, path));
  };

  const handleReply = (commentId, text, path = []) => {
    if (!text.trim()) return;

    const reply = {
      id: Date.now(),
      user: "Anda",
      avatar: "https://i.pravatar.cc/40?img=7",
      text,
      likes: 0,
      timestamp: new Date().toLocaleString(),
      replies: [],
    };

    const addReply = (items, path) => {
      if (path.length === 0) {
        return items.map((item) =>
          item.id === commentId
            ? { ...item, replies: [...item.replies, reply] }
            : item
        );
      }
      return items.map((item) => {
        if (item.id === path[0]) {
          return {
            ...item,
            replies: addReply(item.replies, path.slice(1)),
          };
        }
        return item;
      });
    };

    setComments((prev) => addReply(prev, path));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Input komentar utama */}
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

      {/* Daftar komentar */}
      {comments.slice(0, visibleComments).map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          path={[]}
          onLike={handleLike}
          onReply={handleReply}
        />
      ))}

      {visibleComments < comments.length && (
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

const CommentItem = ({ comment, path, onLike, onReply }) => {
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showAllReplies, setShowAllReplies] = useState(false);

  const repliesToShow = showAllReplies
    ? comment.replies
    : comment.replies.slice(0, 1);

  return (
    <div className="pl-4 border-l border-gray-200 mb-4">
      <div className="flex gap-3">
        <img src={comment.avatar} alt="" className="w-10 h-10 rounded-full" />
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{comment.user}</h4>
          <p className="text-xs text-gray-500">{comment.timestamp}</p>
          <p className="text-sm mt-1 text-gray-800">{comment.text}</p>
          <div className="flex gap-4 text-xs text-gray-600 mt-2">
            <button
              onClick={() => onLike(comment.id, path)}
              className="flex items-center gap-1"
            >
              <FaHeart className="text-red-500 cursor-pointer" />{" "}
              {comment.likes}
            </button>
            <button
              onClick={() => setReplying(!replying)}
              className="flex items-center gap-1 cursor-pointer"
            >
              <FaReply /> Balas
            </button>
          </div>

          {/* Input Balasan */}
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
                  onReply(comment.id, replyText, path);
                  setReplyText("");
                  setReplying(false);
                }}
                className="mt-1 text-sm text-blue-600 cursor-pointer"
              >
                Kirim Balasan
              </button>
            </div>
          )}

          {/* Balasan */}
          {comment.replies.length > 0 && (
            <div className="mt-3 space-y-3">
              {repliesToShow.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  path={[...path, comment.id]}
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
