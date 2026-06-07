"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const supabase = createClient();

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState({ anime: [], komik: [] });

  // State Form Edit
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // State Admin
  const [adminMenu, setAdminMenu] = useState("home");
  const [allComments, setAllComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const fetchUserAndAdminData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        router.push("/login");
        return;
      }

      // AMBIL HISTORY DAN BERSIHKAN DATA SAMPAH
      const histData = JSON.parse(localStorage.getItem("mangnime_history")) || {
        anime: {},
        komik: {},
      };

      const rawAnimeHistory = Object.values(histData.anime || {});
      const rawKomikHistory = Object.values(histData.komik || {});
      const cleanAnime = rawAnimeHistory.filter((h) => !h.title.includes("{"));
      const cleanKomik = rawKomikHistory.filter((h) => !h.title.includes("{"));

      setHistory({
        anime: cleanAnime.slice(-4), // Ambil 4 history terakhir
        komik: cleanKomik.slice(-4),
      });

      const currentUser = session.user;
      setUser(currentUser);
      setNewName(currentUser.user_metadata?.full_name || "");

      // JIKA ADMIN, AMBIL DATA KOMENTAR & TOTAL USER
      if (currentUser.user_metadata?.role === "admin") {
        // 1. Ambil Data Komentar
        const { data: commentsData } = await supabase
          .from("comments")
          .select("id, content, user_name, topic_id, created_at")
          .order("created_at", { ascending: false });

        if (commentsData) setAllComments(commentsData);

        // 2. Ambil Total User
        const { data: userCount } = await supabase.rpc("get_user_count");
        if (userCount !== null) setTotalUsers(userCount);
      }
      setLoading(false);
    };

    fetchUserAndAdminData();
  }, [router]);

  const handleDeleteComment = async (commentId) => {
    if (!confirm("Yakin ingin menghapus komentar ini?")) return;

    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);

    if (!error) {
      setAllComments((prev) => prev.filter((c) => c.id !== commentId));
    } else {
      alert("Gagal menghapus: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    let finalAvatarUrl = user.user_metadata?.avatar_url;

    if (selectedFile) {
      const fileExt = selectedFile.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, selectedFile);

      if (uploadError) {
        alert("Gagal mengunggah: " + uploadError.message);
        setUpdateLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(fileName);
      finalAvatarUrl = publicUrl;
    }

    const { data, error } = await supabase.auth.updateUser({
      data: { full_name: newName, avatar_url: finalAvatarUrl },
    });

    if (!error) {
      setUser(data.user);
      setIsEditing(false);
      setSelectedFile(null);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl("");
      alert("Profil berhasil diperbarui!");
      router.refresh();
    } else {
      alert("Gagal memperbarui: " + error.message);
    }
    setUpdateLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center text-white">
        Memuat...
      </div>
    );

  if (!user) return null;

  const isAdmin = user.user_metadata?.role === "admin";
  const currentName = user.user_metadata?.full_name || user.email.split("@")[0];
  const currentAvatar =
    user.user_metadata?.avatar_url || "https://placehold.co/200";

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* KOTAK PROFIL */}
        <div className="bg-[#151226]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-celestia-pink overflow-hidden shrink-0 bg-[#0D0B1A]">
              <img
                src={previewUrl || currentAvatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              {isAdmin && (
                <span className="inline-block bg-celestia-gold/20 text-celestia-gold border border-celestia-gold/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-3 uppercase flex items-center gap-1.5 w-max mx-auto md:mx-0">
                  👑 Admin MangNime
                </span>
              )}

              {!isEditing ? (
                <>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase">
                    {currentName}
                  </h1>
                  <p className="text-gray-400 mb-6">{user.email}</p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-white/10 text-white rounded-xl text-sm font-bold border border-white/10 hover:bg-white/20 transition-colors"
                    >
                      Edit Profil
                    </button>
                    <button
                      onClick={handleLogout}
                      className="px-6 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-bold border border-red-500/20 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-4 max-w-md mx-auto md:mx-0 text-left bg-black/20 p-5 rounded-2xl border border-white/5"
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-celestia-pink/10 file:text-celestia-pink file:border-0 hover:file:bg-celestia-pink/20 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-celestia-pink transition-colors"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 py-2 bg-celestia-pink text-white font-bold rounded-xl hover:bg-pink-500 transition-colors"
                    >
                      {updateLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* AREA LANJUTKAN MEMBACA / MENONTON */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          {/* Lanjut Nonton (Anime) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-celestia-sky"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4l12 6-12 6z" />
              </svg>
              Terakhir Ditonton
            </h3>
            {history.anime.length > 0 ? (
              <div className="space-y-3">
                {history.anime.map((h, i) => (
                  <Link
                    key={i}
                    href={h.url}
                    className="flex gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors"
                  >
                    <img
                      src={h.image}
                      className="w-12 h-16 object-cover rounded bg-black/50 border border-white/5"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-celestia-sky transition-colors">
                        {h.title}
                      </h4>
                      <p className="text-xs text-celestia-sky mt-1">
                        Episode {h.episodeNumber}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Belum ada riwayat anime.</p>
            )}
          </div>

          {/* Lanjut Baca (Komik) */}
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-celestia-pink"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Terakhir Dibaca
            </h3>
            {history.komik.length > 0 ? (
              <div className="space-y-3">
                {history.komik.map((h, i) => (
                  <Link
                    key={i}
                    href={h.url}
                    className="flex gap-3 hover:bg-white/5 p-2 rounded-xl transition-colors group"
                  >
                    <img
                      src={h.image}
                      className="w-12 h-16 object-cover rounded bg-black/50 border border-white/5"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-celestia-pink transition-colors">
                        {h.title}
                      </h4>
                      <p className="text-xs text-celestia-pink mt-1">
                        Chapter {h.chapterIndex}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500">Belum ada riwayat komik.</p>
            )}
          </div>
        </div>

        {/* AREA ADMIN */}
        {isAdmin && (
          <div className="animate-fade-in mb-8">
            {adminMenu !== "home" && (
              <button
                onClick={() => setAdminMenu("home")}
                className="mb-4 text-sm text-gray-400 hover:text-white font-bold flex items-center gap-1 transition-colors"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Kembali
              </button>
            )}

            {adminMenu === "home" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  onClick={() => setAdminMenu("stats")}
                  className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-left hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-6 h-6 text-celestia-sky group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-white">
                      Statistik Website
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Lihat ringkasan aktivitas pengguna.
                  </p>
                </button>

                <button
                  onClick={() => setAdminMenu("comments")}
                  className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-left hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-6 h-6 text-celestia-pink group-hover:scale-110 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                      Moderasi Komentar
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-medium">
                    Pantau dan hapus komentar yang tidak pantas.
                  </p>
                </button>
              </div>
            )}

            {adminMenu === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-10 text-center">
                  <div className="text-6xl font-black text-celestia-sky mb-2">
                    {totalUsers}
                  </div>
                  <div className="text-xs text-gray-500 font-bold uppercase">
                    Total User Terdaftar
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-10 text-center">
                  <div className="text-6xl font-black text-celestia-pink mb-2">
                    {allComments.length}
                  </div>
                  <div className="text-xs text-gray-500 font-bold uppercase">
                    Total Komentar
                  </div>
                </div>
              </div>
            )}

            {adminMenu === "comments" && (
              <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">
                  Daftar Komentar
                </h3>
                <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                  {allComments.map((comment) => {
                    const rawTopicId = comment.topic_id
                      ? String(comment.topic_id).trim().toLowerCase()
                      : "";
                    let commentUrl = "#";

                    if (rawTopicId.includes("anime-")) {
                      const slug = rawTopicId.replace("anime-", "");
                      if (slug) commentUrl = `/anime/${slug}`;
                    } else if (rawTopicId.includes("episode-")) {
                      const slug = rawTopicId.replace("episode-", "");
                      if (slug) commentUrl = `/episode/${slug}`;
                    } else if (rawTopicId.includes("komik-")) {
                      const slug = rawTopicId.replace("komik-", "");
                      if (slug) commentUrl = `/komik/${slug}`;
                    } else if (rawTopicId.includes("chapter-")) {
                      const slug = rawTopicId.replace("chapter-", "");
                      if (slug) commentUrl = `/komik/${slug}`; // Fallback to komik base if exact chapter URL is too complex
                    }

                    return (
                      <div
                        key={comment.id}
                        className="bg-black/30 p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between gap-4 group mb-3"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-sm text-white truncate">
                              {comment.user_name}
                            </span>
                            <span className="text-[10px] text-celestia-sky bg-celestia-sky/10 px-2 py-0.5 rounded truncate font-mono border border-celestia-sky/20">
                              {rawTopicId || "⚠️ Data Lama (Tanpa ID)"}
                            </span>
                          </div>
                          <p className="text-sm text-gray-400 line-clamp-2">
                            {comment.content || "(Lampiran Media)"}
                          </p>
                        </div>

                        <div className="flex gap-2 shrink-0 md:self-center">
                          {commentUrl !== "#" ? (
                            <Link
                              href={commentUrl}
                              className="bg-celestia-sky/20 text-celestia-sky hover:bg-celestia-sky hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-celestia-sky/30"
                            >
                              Buka URL
                            </Link>
                          ) : (
                            <button
                              disabled
                              className="bg-gray-800 text-gray-600 px-4 py-2 rounded-lg text-xs font-bold cursor-not-allowed border border-gray-700"
                            >
                              N/A
                            </button>
                          )}

                          <button
                            onClick={() => handleDeleteComment(comment.id)}
                            className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AREA BOOKMARK */}
        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 flex justify-between items-center hover:bg-white/[0.04] transition-colors">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-celestia-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Bookmarks Saya
            </h3>
            <p className="text-sm text-gray-400">
              Lanjutkan menikmati koleksimu.
            </p>
          </div>
          <Link
            href="/bookmark"
            className="px-6 py-2 bg-white/10 text-white rounded-xl font-bold hover:bg-white/20 transition-all border border-white/10"
          >
            Buka
          </Link>
        </div>
      </div>
    </div>
  );
}
