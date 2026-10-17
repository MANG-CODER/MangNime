"use client";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { createClient } from "@/utils/supabase/client";
import EmojiPicker from "emoji-picker-react";
import { usePathname } from "next/navigation";
import Link from "next/link";

export default function CommentSection({
  topicId,
  title = "Diskusi Komunitas",
}) {
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

  const CommentItem = ({ comment, isReply = false, topLevelId = null }) => {
    const [showReplies, setShowReplies] = useState(false);

    let descendants = [];
    if (!isReply) {
      const getDescendants = (parentId) => {
        let result = [];
        const children = comments.filter((c) => c.parent_id === parentId);
        children.forEach((child) => {
          result.push(child);
          result = result.concat(getDescendants(child.id));
        });
        return result;
      };

      descendants = getDescendants(comment.id).sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at),
      );
    }

    let replyToUsername = null;
    if (isReply && comment.parent_id !== topLevelId) {
      const repliedComment = comments.find((c) => c.id === comment.parent_id);
      if (repliedComment) replyToUsername = repliedComment.user_name;
    }

    return (
      <div
        className={`flex gap-3.5 md:gap-4 group ${
          isReply
            ? "mt-3.5 ml-4 md:ml-11 border-l-2 border-[#F4B8C6]/20 pl-3.5 md:pl-4"
            : "p-4 md:p-5 rounded-2xl bg-[#211B24]/70 border border-[#F4B8C6]/10 hover:border-[#F4B8C6]/25 transition-colors"
        }`}
      >
        <Image
          src={comment.user_avatar}
          alt={`Avatar ${comment.user_name}`}
          width={isReply ? 32 : 40}
          height={isReply ? 32 : 40}
          unoptimized
          className={`rounded-full object-cover shrink-0 border border-[#F4B8C6]/30 bg-[#161218] ${
            isReply ? "w-8 h-8" : "w-10 h-10"
          }`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-bold text-[#FDF6F7] text-sm">
              {comment.user_name}
            </span>
            {comment.user_role === "admin" && (
              <span className="bg-[#F4B8C6]/20 border border-[#F4B8C6]/40 text-[#F4B8C6] text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full">
                👑 Admin MangNime
              </span>
            )}
            <span className="text-[11px] text-[#AD9CA6]">
              •{" "}
              {new Date(comment.created_at).toLocaleDateString("id-ID", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>

          <p className="text-[#FDF6F7]/90 text-sm whitespace-pre-wrap leading-relaxed mb-3">
            {replyToUsername && (
              <span className="text-[#F4B8C6] font-bold mr-1.5">
                @{replyToUsername}
              </span>
            )}
            {comment.content}
          </p>

          {comment.image_url && (
            <Image
              src={comment.image_url}
              alt="Attachment"
              width={400}
              height={240}
              unoptimized
              className="max-h-60 w-auto rounded-2xl border border-[#F4B8C6]/20 bg-[#161218]/60 object-contain mb-3"
            />
          )}

          <div className="flex flex-wrap items-center gap-2.5 relative">
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
              className="text-xs text-[#AD9CA6] hover:text-[#F4B8C6] font-bold px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-[#F4B8C6]/10 transition-colors"
            >
              Balas
            </button>

            <button
              type="button"
              onClick={() =>
                setActiveReactComment(
                  activeReactComment === comment.id ? null : comment.id,
                )
              }
              className="text-xs text-[#AD9CA6] hover:text-[#F4B8C6] font-bold px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-[#F4B8C6]/10 transition-colors"
            >
              + Reaksi
            </button>

            {activeReactComment === comment.id && (
              <div className="absolute top-8 left-0 bg-[#251E29] border border-[#F4B8C6]/30 rounded-2xl p-2 shadow-vogue-card z-20 flex gap-1.5 animate-fade-in w-max">
                {reactEmojis.map((em, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleReaction(comment, em)}
                    className="text-lg hover:scale-125 transition-transform px-1"
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
                  type="button"
                  onClick={() => toggleReaction(comment, emoji)}
                  className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold border transition-all ${
                    users.includes(user?.id)
                      ? "bg-[#F4B8C6]/20 border-[#F4B8C6] text-[#F4B8C6]"
                      : "bg-white/[0.03] border-white/10 text-[#AD9CA6] hover:border-[#F4B8C6]/30"
                  }`}
                >
                  <span>{emoji}</span>
                  <span>{users.length}</span>
                </button>
              ))}
          </div>

          {!isReply && descendants.length > 0 && (
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="mt-3 flex items-center gap-2 text-xs font-bold text-[#F4B8C6] hover:text-[#FDF6F7] transition-colors bg-[#F4B8C6]/10 hover:bg-[#F4B8C6]/20 border border-[#F4B8C6]/25 px-3.5 py-1.5 rounded-full w-max"
            >
              {showReplies
                ? "Sembunyikan Balasan ▲"
                : `Lihat ${descendants.length} Balasan ▼`}
            </button>
          )}

          {!isReply && showReplies && (
            <div className="mt-2 flex flex-col">
              {descendants.map((child) => (
                <CommentItem
                  key={child.id}
                  comment={child}
                  isReply={true}
                  topLevelId={comment.id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  const parentComments = comments.filter((c) => !c.parent_id);

  return (
    <div className="mt-12 w-full max-w-[1400px] mx-auto bg-[#1B151E]/90 rounded-[32px] border border-[#F4B8C6]/20 p-5 sm:p-8 md:p-10 shadow-vogue-card animate-fade-in">
      {/* Header Komunitas */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 pb-5 border-b border-[#F4B8C6]/15">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#E88D9E] mb-1">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
              />
            </svg>
            <span>Forum Diskusi</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-extrabold text-[#FDF6F7] flex flex-wrap items-center gap-3">
            <span>{title.replace("💬 ", "")}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#F4B8C6]/15 border border-[#F4B8C6]/30 text-[#F4B8C6]">
              {comments.length} Komentar
            </span>
          </h3>
        </div>

        {/* Sort Pill Switcher */}
        <div className="flex items-center bg-[#161218] p-1 rounded-full border border-[#F4B8C6]/20 text-xs font-bold">
          <button
            type="button"
            onClick={() => setSortOrder("latest")}
            className={`px-4 py-1.5 rounded-full transition-all ${
              sortOrder === "latest"
                ? "bg-[#F4B8C6] text-[#161218]"
                : "text-[#AD9CA6] hover:text-[#FDF6F7]"
            }`}
          >
            Terbaru
          </button>
          <button
            type="button"
            onClick={() => setSortOrder("oldest")}
            className={`px-4 py-1.5 rounded-full transition-all ${
              sortOrder === "oldest"
                ? "bg-[#F4B8C6] text-[#161218]"
                : "text-[#AD9CA6] hover:text-[#FDF6F7]"
            }`}
          >
            Terlama
          </button>
        </div>
      </div>

      {/* Input Composer Box */}
      <div className="bg-[#211B24] rounded-[24px] border border-[#F4B8C6]/20 p-1 mb-8 shadow-inner">
        {user ? (
          <form onSubmit={handleSubmit} className="relative p-4 md:p-5">
            <div className="flex flex-wrap items-center justify-between text-xs text-[#AD9CA6] mb-3 pb-3 border-b border-[#F4B8C6]/10 gap-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#F4B8C6]" />
                <span>Berkomentar sebagai</span>
                <span className="text-[#F4B8C6] font-bold">
                  {user.user_metadata?.full_name || user.email.split("@")[0]}
                </span>
              </div>

              {replyTo && (
                <div className="flex items-center gap-2 bg-[#F4B8C6]/15 border border-[#F4B8C6]/30 text-[#F4B8C6] px-3 py-1 rounded-full">
                  <span>
                    Membalas <b>@{replyTo.user_name}</b>
                  </span>
                  <button
                    type="button"
                    onClick={() => setReplyTo(null)}
                    className="hover:text-white font-bold"
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
                  ? `Tulis balasan untuk ${replyTo.user_name}...`
                  : "Tulis komentar atau pendapatmu..."
              }
              className="w-full bg-transparent text-[#FDF6F7] placeholder-[#AD9CA6]/60 outline-none resize-none min-h-[100px] text-sm leading-relaxed"
            />

            {imagePreview && (
              <div className="relative inline-block mt-2 mb-3">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-36 object-contain rounded-2xl border border-[#F4B8C6]/30 bg-[#161218]"
                />
                <button
                  type="button"
                  onClick={clearAttachment}
                  className="absolute -top-2.5 -right-2.5 bg-[#E88D9E] text-[#161218] rounded-full w-6 h-6 flex items-center justify-center text-xs font-extrabold shadow-md"
                >
                  ✕
                </button>
              </div>
            )}

            <div className="flex flex-wrap justify-between items-center mt-3 pt-3 border-t border-[#F4B8C6]/10 gap-4 relative">
              <div className="flex items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    setShowEmoji(!showEmoji);
                    setShowGifPicker(false);
                  }}
                  className="w-9 h-9 rounded-full bg-[#161218] hover:bg-[#F4B8C6]/20 border border-[#F4B8C6]/20 flex items-center justify-center text-[#AD9CA6] hover:text-[#F4B8C6] transition-colors"
                  title="Tambah Emoji"
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
                  <div className="absolute top-12 left-0 z-50">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setNewComment((prev) => prev + e.emoji);
                        setShowEmoji(false);
                      }}
                      theme="dark"
                      width={300}
                      height={380}
                    />
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => {
                    setShowGifPicker(!showGifPicker);
                    setShowEmoji(false);
                  }}
                  className="px-3 h-9 rounded-full bg-[#161218] hover:bg-[#F4B8C6]/20 border border-[#F4B8C6]/20 text-[#AD9CA6] hover:text-[#F4B8C6] transition-colors font-extrabold text-xs"
                >
                  GIF
                </button>

                {showGifPicker && (
                  <div className="absolute top-12 left-0 bg-[#251E29] border border-[#F4B8C6]/30 rounded-2xl p-4 shadow-vogue-card z-50 w-[300px] sm:w-[340px]">
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
                        className="w-full bg-[#161218] border border-[#F4B8C6]/25 rounded-full text-xs px-3.5 py-2 text-[#FDF6F7] outline-none focus:border-[#F4B8C6]"
                      />
                      <button
                        type="button"
                        onClick={() => searchGiphy(gifSearchTerm)}
                        className="bg-[#F4B8C6] text-[#161218] px-3.5 rounded-full font-bold text-xs"
                      >
                        Cari
                      </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 max-h-[220px] overflow-y-auto custom-scrollbar">
                      {isSearchingGif ? (
                        <div className="col-span-2 text-center text-xs text-[#F4B8C6] py-6">
                          Mencari GIF...
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
                            className="w-full h-24 object-cover rounded-xl cursor-pointer hover:opacity-80 transition-opacity bg-[#161218]"
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
                  className="w-9 h-9 rounded-full bg-[#161218] hover:bg-[#F4B8C6]/20 border border-[#F4B8C6]/20 flex items-center justify-center text-[#AD9CA6] hover:text-[#F4B8C6] transition-colors"
                  title="Upload Gambar"
                >
                  <svg
                    className="w-4 h-4"
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
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] font-extrabold text-xs rounded-full shadow-vogue-blush transition-all disabled:opacity-40"
              >
                <span>
                  {loading
                    ? "Mengirim..."
                    : replyTo
                      ? "Balas Komentar"
                      : "Kirim Komentar"}
                </span>
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                  />
                </svg>
              </button>
            </div>
          </form>
        ) : (
          <div className="p-8 text-center flex flex-col items-center justify-center min-h-[170px]">
            <p className="font-serif italic text-base text-[#F4B8C6] mb-1">
              Bergabung dalam Diskusi MangNime
            </p>
            <p className="text-[#AD9CA6] text-xs mb-4">
              Silakan masuk ke akunmu untuk ikut berkomentar dan memberi reaksi.
            </p>
            <Link
              href={`/login?next=${pathname}`}
              className="px-6 py-2.5 bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] rounded-full text-xs font-extrabold transition-all shadow-vogue-blush"
            >
              Login Sekarang
            </Link>
          </div>
        )}
      </div>

      {/* Daftar Komentar */}
      <div className="space-y-3.5">
        {comments.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-[#211B24]/40 border border-[#F4B8C6]/10">
            <p className="text-[#AD9CA6] text-sm">
              Belum ada komentar. Jadilah yang pertama berkomentar!
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
