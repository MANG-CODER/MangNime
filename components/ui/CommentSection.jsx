"use client";

import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import EmojiPicker from "emoji-picker-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CommentSection({ topicId, title = "Comments" }) {
  const pathname = usePathname();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [selectedGifUrl, setSelectedGifUrl] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sortOrder, setSortOrder] = useState("latest");
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGifPicker, setShowGifPicker] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [activeReactComment, setActiveReactComment] = useState(null);
  const [gifSearchTerm, setGifSearchTerm] = useState("");
  const [gifResults, setGifResults] = useState([]);
  const [isSearchingGif, setIsSearchingGif] = useState(false);

  const fileInputRef = useRef(null);
  const textareaRef = useRef(null);
  const supabase = createClient();

  const reactEmojis = [
    "😀",
    "😂",
    "🥰",
    "😎",
    "🤔",
    "😭",
    "😡",
    "👍",
    "🙏",
    "✨",
    "🔥",
    "❤️",
  ];

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    getSession();
  }, []);

  useEffect(() => {
    fetchComments();
  }, [topicId, sortOrder]);

  const fetchComments = async () => {
    if (!topicId) return;
    const { data, error } = await supabase
      .from("comments")
      .select("*")
      .eq("topic_id", topicId)
      .order("created_at", { ascending: sortOrder === "oldest" });
    if (!error) setComments(data || []);
  };

  const searchGiphy = async (term) => {
    setIsSearchingGif(true);
    try {
      const apiKey = "yeIfqczFu1PpG1Ht2rsyEjjX9OStuEEK";
      const endpoint = term.trim()
        ? `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=${encodeURIComponent(term)}&limit=12`
        : `https://api.giphy.com/v1/gifs/trending?api_key=${apiKey}&limit=12`;
      const response = await fetch(endpoint);
      if (!response.ok) return;
      const { data } = await response.json();
      setGifResults(data || []);
    } catch {
      setGifResults([]);
    } finally {
      setIsSearchingGif(false);
    }
  };

  useEffect(() => {
    if (showGifPicker && gifResults.length === 0) searchGiphy("");
  }, [showGifPicker]);

  const handleSelectGif = (gifUrl) => {
    setSelectedGifUrl(gifUrl);
    setImageFile(null);
    setImagePreview(gifUrl);
    setShowGifPicker(false);
    setGifSearchTerm("");
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setSelectedGifUrl("");
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const clearAttachment = () => {
    setImageFile(null);
    setSelectedGifUrl("");
    setImagePreview("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return alert("Silakan login terlebih dahulu!");
    if (!newComment.trim() && !imageFile && !selectedGifUrl) return;

    setLoading(true);
    let finalImageUrl = selectedGifUrl || null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("comment_images")
        .upload(fileName, imageFile);
      if (!uploadError) {
        const { data } = supabase.storage
          .from("comment_images")
          .getPublicUrl(fileName);
        finalImageUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from("comments").insert([
      {
        user_id: user.id,
        user_name: user.user_metadata?.full_name || user.email.split("@")[0],
        user_avatar:
          user.user_metadata?.avatar_url || "https://placehold.co/100",
        user_role: user.user_metadata?.role || "user",
        topic_id: topicId,
        content: newComment,
        image_url: finalImageUrl,
        parent_id: replyTo ? replyTo.id : null,
      },
    ]);

    if (!error) {
      setNewComment("");
      clearAttachment();
      setReplyTo(null);
      fetchComments();
    }
    setLoading(false);
  };

  const toggleReaction = async (comment, emoji) => {
    if (!user) return alert("Login dulu untuk memberi reaction!");

    let currentReactions = JSON.parse(JSON.stringify(comment.reactions || {}));
    let usersWhoReacted = currentReactions[emoji] || [];

    if (usersWhoReacted.includes(user.id)) {
      usersWhoReacted = usersWhoReacted.filter((id) => id !== user.id);
    } else {
      usersWhoReacted.push(user.id);
    }

    if (usersWhoReacted.length === 0) {
      delete currentReactions[emoji];
    } else {
      currentReactions[emoji] = usersWhoReacted;
    }

    setComments(
      comments.map((c) =>
        c.id === comment.id ? { ...c, reactions: currentReactions } : c,
      ),
    );
    setActiveReactComment(null);

    const { error } = await supabase
      .from("comments")
      .update({ reactions: currentReactions })
      .eq("id", comment.id);

    if (error) {
      console.error("Supabase Error Update Reaction:", error);
      alert("Gagal menyimpan reaction!");
      fetchComments();
    }
  };

  const CommentItem = ({ comment, isReply = false }) => {
    const childComments = comments.filter((c) => c.parent_id === comment.id);

    return (
      <div
        className={`flex gap-3 md:gap-4 group ${isReply ? "mt-4 ml-6 md:ml-12 border-l-2 border-white/5 pl-4" : "mt-8"}`}
      >
        <img
          src={comment.user_avatar}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover shrink-0 border border-white/10 bg-[#151226]"
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-bold text-celestia-sky text-sm">
              {comment.user_name}
            </span>
            {comment.user_role === "admin" && (
              <span className="bg-celestia-gold/20 text-celestia-gold text-[9px] font-black uppercase px-2 py-0.5 rounded shadow-glow-gold">
                👑 Admin MangNime
              </span>
            )}
            <span className="text-[10px] text-gray-500 font-medium">
              {new Date(comment.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <p className="text-gray-300 text-sm whitespace-pre-wrap leading-relaxed mb-2">
            {comment.content}
          </p>
          {comment.image_url && (
            <img
              src={comment.image_url}
              alt="Attachment"
              className="max-h-60 rounded-xl border border-white/10 bg-black/30 object-contain mb-2"
            />
          )}

          <div className="flex flex-wrap items-center gap-3 relative">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                setReplyTo(comment);
                if (textareaRef.current) {
                  textareaRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "center",
                  });
                  setTimeout(() => textareaRef.current.focus(), 500);
                }
              }}
              className="text-[11px] text-gray-500 hover:text-white font-bold transition-colors"
            >
              Reply
            </button>

            <button
              onClick={() =>
                setActiveReactComment(
                  activeReactComment === comment.id ? null : comment.id,
                )
              }
              className="text-[11px] text-gray-500 hover:text-celestia-pink font-bold transition-colors"
            >
              React +
            </button>

            {activeReactComment === comment.id && (
              <div className="absolute top-6 left-0 bg-[#1E1B2E] border border-white/10 rounded-xl p-2 shadow-2xl z-20 flex gap-1 animate-fade-in w-max">
                {reactEmojis.map((em, i) => (
                  <button
                    key={i}
                    onClick={() => toggleReaction(comment, em)}
                    className="text-lg hover:scale-125 transition-transform"
                  >
                    {em}
                  </button>
                ))}
              </div>
            )}

            {comment.reactions &&
              Object.entries(comment.reactions).map(([emoji, users]) => (
                <button
                  key={emoji}
                  onClick={() => toggleReaction(comment, emoji)}
                  className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold border transition-colors ${
                    users.includes(user?.id)
                      ? "bg-celestia-pink/20 border-celestia-pink text-celestia-pink"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <span>{emoji}</span> <span>{users.length}</span>
                </button>
              ))}
          </div>

          {childComments.map((child) => (
            <CommentItem key={child.id} comment={child} isReply={true} />
          ))}
        </div>
      </div>
    );
  };

  const parentComments = comments.filter((c) => !c.parent_id);

  return (
    // DI SINI KUNCINYA: w-full max-w-[1200px] (Sangat lebar namun tetap proporsional & Rata Tengah)
    <div className="mt-16 w-full max-w-[1200px] mx-auto bg-[#0D0B1A] rounded-2xl border border-white/5 p-6 md:p-10 shadow-xl animate-fade-in">
      <div className="bg-[#151226]/80 rounded-2xl border border-white/10 p-1 mb-10 shadow-inner">
        {user ? (
          <form onSubmit={handleSubmit} className="relative p-4 md:p-5">
            <div className="flex flex-col md:flex-row md:items-center justify-between text-[11px] md:text-xs text-gray-400 mb-4 pb-4 border-b border-dashed border-white/10 gap-3">
              <div className="flex items-center gap-2">
                <span className="font-bold text-gray-500">NickName</span>
                <span className="text-celestia-sky font-medium">
                  {user.user_metadata?.full_name || user.email.split("@")[0]}
                </span>
              </div>

              {replyTo && (
                <div className="flex items-center gap-2 bg-celestia-pink/10 text-celestia-pink px-3 py-1 rounded-full animate-fade-in">
                  <span>
                    Membalas <b>{replyTo.user_name}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="ml-2 bg-celestia-pink/20 hover:bg-celestia-pink text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px]"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>

            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder={
                replyTo
                  ? `Balas komentar ${replyTo.user_name}...`
                  : "Tulis pendapatmu..."
              }
              className="w-full bg-transparent text-gray-200 outline-none resize-none min-h-[120px] text-sm leading-relaxed"
            />

            {imagePreview && (
              <div className="relative inline-block mt-2 mb-4">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-40 object-contain rounded-xl border border-white/10 bg-black/50"
                />
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="absolute -top-3 -right-3 bg-red-500 hover:bg-red-600 text-white rounded-full w-7 h-7 flex items-center justify-center text-xs font-bold shadow-lg transition-colors"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-white/5 gap-4 relative">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmoji(!showEmoji);
                    setShowGifPicker(false);
                  }}
                  className="text-gray-400 hover:text-celestia-gold transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </button>
                {showEmoji && (
                  <div className="absolute top-10 left-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setNewComment((prev) => prev + e.emoji);
                        setShowEmoji(false);
                      }}
                      theme="dark"
                      width={300}
                      height={400}
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    setShowGifPicker(!showGifPicker);
                    setShowEmoji(false);
                  }}
                  className="text-gray-400 hover:text-celestia-pink transition-colors font-black text-xs border border-gray-400 hover:border-celestia-pink px-1.5 py-0.5 rounded"
                >
                  GIF
                </button>
                {showGifPicker && (
                  <div className="absolute top-10 left-0 bg-[#1E1B2E] border border-white/10 rounded-xl p-4 shadow-2xl z-50 w-[300px] sm:w-[350px]">
                    <div className="flex gap-2 mb-3">
                      <input
                        type="text"
                        placeholder="Cari GIF..."
                        value={gifSearchTerm}
                        onChange={(e) => setGifSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            searchGiphy(gifSearchTerm);
                          }
                        }}
                        className="w-full bg-black/40 border border-white/10 rounded text-sm px-3 py-2 text-white outline-none focus:border-celestia-pink"
                      />
                      <button
                        type="button"
                        onClick={() => searchGiphy(gifSearchTerm)}
                        className="bg-white/10 px-3 rounded hover:bg-white/20 text-sm"
                      >
                        🔍
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[250px] min-h-[100px] overflow-y-auto custom-scrollbar">
                      {isSearchingGif ? (
                        <div className="col-span-2 text-center text-xs text-celestia-pink font-bold animate-pulse py-4">
                          Mencari...
                        </div>
                      ) : (
                        gifResults.map((gif) => (
                          <img
                            key={gif.id}
                            src={gif.images.fixed_height_small.url}
                            alt="gif"
                            onClick={() =>
                              handleSelectGif(gif.images.downsized_medium.url)
                            }
                            className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity bg-black/50"
                          />
                        ))
                      )}
                    </div>
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-gray-400 hover:text-celestia-sky transition-colors"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              <button
                type="submit"
                disabled={
                  loading ||
                  (!newComment.trim() && !imageFile && !selectedGifUrl)
                }
                className="px-6 py-2 bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white font-bold text-sm rounded-lg hover:shadow-glow-purple transition-all disabled:opacity-50"
              >
                {loading ? "MENGIRIM..." : replyTo ? "BALAS KOMENTAR" : "KIRIM"}
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[200px]">
            <span className="text-4xl mb-3">🔒</span>
            <p className="text-gray-400 text-sm mb-4">
              Anda harus login untuk ikut berdiskusi.
            </p>
            <Link
              href={`/login?next=${pathname}`}
              className="px-6 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg text-sm font-bold transition-all border border-white/10"
            >
              Login Sekarang
            </Link>
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4 border-b border-white/5 pb-4">
        <h3 className="text-xl md:text-2xl font-black text-white">{title}</h3>
        <div className="flex gap-4 text-xs md:text-sm font-bold">
          <button
            onClick={() => setSortOrder("latest")}
            className={`transition-colors ${sortOrder === "latest" ? "text-celestia-lavender" : "text-gray-500 hover:text-white"}`}
          >
            Terbaru
          </button>
          <button
            onClick={() => setSortOrder("oldest")}
            className={`transition-colors ${sortOrder === "oldest" ? "text-celestia-lavender" : "text-gray-500 hover:text-white"}`}
          >
            Terlama
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 font-medium">
              Jadilah yang pertama berkomentar!
            </p>
          </div>
        ) : (
          parentComments.map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))
        )}
      </div>
    </div>
  );
}
