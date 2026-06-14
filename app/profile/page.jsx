"use client";
import NextImage from "next/image";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import Link from "next/link";

const supabase = createClient();

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState({ anime: [], komik: [] });

  // State Notifikasi & Dialog Konfirmasi
  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    text: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: null });

  // State Edit Profil Biasa
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // --- STATE RESIZER/CROPPER 1:1 INTERAKTIF ---
  const [cropModal, setCropModal] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState("");
  const [cropScale, setCropScale] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [minScale, setMinScale] = useState(1);
  const [finalBlob, setFinalBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // State drag canvas
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragStartCrop, setDragStartCrop] = useState({ x: 0, y: 0 });

  const canvasRef = useRef(null);
  const imageRef = useRef(null);

  // State Admin
  const [adminMenu, setAdminMenu] = useState("home");
  const [allComments, setAllComments] = useState([]);
  const [totalUsers, setTotalUsers] = useState(0);

  const router = useRouter();

  const showAlert = (type, text) => {
    setAlertInfo({ show: true, type, text });
    setTimeout(() => {
      setAlertInfo({ show: false, type: "", text: "" });
    }, 5000);
  };
  const closeAlert = () => setAlertInfo({ show: false, type: "", text: "" });

  useEffect(() => {
    const fetchUserAndAdminData = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
        return;
      }

      const histData = JSON.parse(localStorage.getItem("mangnime_history")) || {
        anime: {},
        komik: {},
      };
      const cleanAnime = Object.values(histData.anime || {}).filter(
        (h) => !h.title.includes("{"),
      );
      const cleanKomik = Object.values(histData.komik || {}).filter(
        (h) => !h.title.includes("{"),
      );

      setHistory({ anime: cleanAnime.slice(-4), komik: cleanKomik.slice(-4) });

      const currentUser = session.user;
      setUser(currentUser);
      setNewName(currentUser.user_metadata?.full_name || "");

      if (currentUser.user_metadata?.role === "admin") {
        const { data: commentsData } = await supabase
          .from("comments")
          .select("id, content, user_name, topic_id, created_at")
          .order("created_at", { ascending: false });

        if (commentsData) setAllComments(commentsData);

        const { data: userCount } = await supabase.rpc("get_user_count");
        if (userCount !== null) setTotalUsers(userCount);
      }
      setLoading(false);
    };

    fetchUserAndAdminData();
  }, [router]);

  // --- LOGIKA DRAW CANVAS UNTUK MANIPULASI GAMBAR ---
  useEffect(() => {
    if (cropModal && rawImageSrc && canvasRef.current) {
      const img = new Image();
      img.src = rawImageSrc;
      img.onload = () => {
        imageRef.current = img;
        const fitScale = Math.max(
          250 / img.naturalWidth,
          250 / img.naturalHeight,
        );
        setMinScale(fitScale);
        setCropScale(fitScale);
        setCropX(0);
        setCropY(0);
        drawCanvas();
      };
    }
  }, [cropModal, rawImageSrc]);

  useEffect(() => {
    if (cropModal && imageRef.current) {
      drawCanvas();
    }
  }, [cropScale, cropX, cropY]);

const getMaxOffset = () => {
  if (!imageRef.current) return { maxX: 0, maxY: 0 };
  const img = imageRef.current;
  const scaledW = img.naturalWidth * cropScale;
  const scaledH = img.naturalHeight * cropScale;
  const maxX = Math.max(0, (scaledW - 250) / 2);
  const maxY = Math.max(0, (scaledH - 250) / 2);
  return { maxX, maxY };
};

const drawCanvas = () => {
  const canvas = canvasRef.current;
  if (!canvas || !imageRef.current) return;
  const ctx = canvas.getContext("2d");
  const img = imageRef.current;
  const SIZE = canvas.width;

  const scaledW = img.naturalWidth * cropScale;
  const scaledH = img.naturalHeight * cropScale;

  const drawX = (SIZE - scaledW) / 2 + cropX;
  const drawY = (SIZE - scaledH) / 2 + cropY;

  ctx.clearRect(0, 0, SIZE, SIZE);
  ctx.save();
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img, drawX, drawY, scaledW, scaledH);
  ctx.restore();
};

  // --- HANDLER DRAG MOUSE ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
    setDragStartCrop({ x: cropX, y: cropY });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !imageRef.current) return;
    const img = imageRef.current;
    const { maxX, maxY } = getMaxOffset();
    const ratio = (img.naturalWidth * cropScale) / 250;
    const newX = dragStartCrop.x + (e.clientX - dragStart.x) * ratio;
    const newY = dragStartCrop.y + (e.clientY - dragStart.y) * ratio;
    setCropX(Math.max(-maxX, Math.min(maxX, newX)));
    setCropY(Math.max(-maxY, Math.min(maxY, newY)));
  };

  const handleMouseUp = () => setIsDragging(false);

  // --- HANDLER DRAG TOUCH (mobile) ---
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    setIsDragging(true);
    setDragStart({ x: touch.clientX, y: touch.clientY });
    setDragStartCrop({ x: cropX, y: cropY });
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !imageRef.current) return;
    const touch = e.touches[0];
    const img = imageRef.current;
    const { maxX, maxY } = getMaxOffset();
    const ratio = (img.naturalWidth * cropScale) / 250;
    const newX = dragStartCrop.x + (touch.clientX - dragStart.x) * ratio;
    const newY = dragStartCrop.y + (touch.clientY - dragStart.y) * ratio;
    setCropX(Math.max(-maxX, Math.min(maxX, newX)));
    setCropY(Math.max(-maxY, Math.min(maxY, newY)));
  };

  const handleTouchEnd = () => setIsDragging(false);

  // Validasi ukuran input file awal (Maks 2.5MB)
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const maxSize = 2.5 * 1024 * 1024;
    if (file.size > maxSize) {
      showAlert(
        "error",
        "Ukuran file terlalu besar! Maksimal batas ukuran foto adalah 2,5MB.",
      );
      e.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setRawImageSrc(reader.result);
      setCropScale(0);
      setCropX(0);
      setCropY(0);
      setCropModal(true);
    };
    reader.readAsDataURL(file);
  };

  // Konversi canvas menjadi Blob File 1:1 siap upload
  const saveCroppedImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const newUrl = URL.createObjectURL(blob);
        setFinalBlob(blob);
        setPreviewUrl(newUrl);
        setCropModal(false);
        showAlert("success", "Pemotongan foto 1:1 berhasil diterapkan!");
      },
      "image/jpeg",
      0.9,
    );
  };

  const confirmDeleteComment = (commentId) =>
    setConfirmDialog({ show: true, id: commentId });

  const executeDeleteComment = async () => {
    const commentId = confirmDialog.id;
    setConfirmDialog({ show: false, id: null });
    const { error } = await supabase
      .from("comments")
      .delete()
      .eq("id", commentId);
    if (!error) {
      setAllComments((prev) => prev.filter((c) => c.id !== commentId));
      showAlert("success", "Komentar berhasil dihapus!");
    } else {
      showAlert("error", "Gagal menghapus komentar: " + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);

    let finalAvatarUrl = user.user_metadata?.avatar_url;

    if (finalBlob) {
      const fileName = `${user.id}-${Math.random()}.jpg`;
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, finalBlob, { contentType: "image/jpeg" });

      if (uploadError) {
        showAlert(
          "error",
          "Gagal mengunggah foto profil: " + uploadError.message,
        );
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
      setFinalBlob(null);
      showAlert("success", "Profil Anda berhasil diperbarui!");
      router.refresh();
    } else {
      showAlert("error", "Gagal memperbarui profil: " + error.message);
    }
    setUpdateLoading(false);
  };

  if (loading)
    return (
      <div className="min-h-screen bg-[#0D0B1A] flex items-center justify-center text-white font-bold">
        Memuat data...
      </div>
    );
  if (!user) return null;

  const isAdmin = user.user_metadata?.role === "admin";
  const currentName = user.user_metadata?.full_name || user.email.split("@")[0];
  const currentAvatar =
    user.user_metadata?.avatar_url || "https://placehold.co/200";

 const sliderMaxX = imageRef.current
   ? Math.max(0, (imageRef.current.naturalWidth * cropScale - 250) / 2)
   : 0;
 const sliderMaxY = imageRef.current
   ? Math.max(0, (imageRef.current.naturalHeight * cropScale - 250) / 2)
   : 0;

  return (
    <div className="min-h-screen bg-[#0D0B1A] pt-32 pb-20 px-4 relative">
      {/* --- FLOATING TOAST ALERT --- */}
      {alertInfo.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[150] animate-fade-in w-[90%] max-w-md">
          <div
            className={`flex items-start justify-between p-4 rounded-2xl border backdrop-blur-xl shadow-2xl ${alertInfo.type === "error" ? "bg-red-500/10 border-red-500/50" : "bg-green-500/10 border-green-500/50"}`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`p-2 rounded-full ${alertInfo.type === "error" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"}`}
              >
                {alertInfo.type === "error" ? (
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
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                ) : (
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
                      d="M5 13l4 4L19 7"
                    ></path>
                  </svg>
                )}
              </div>
              <p
                className={`text-sm font-medium ${alertInfo.type === "error" ? "text-red-200" : "text-green-200"}`}
              >
                {alertInfo.text}
              </p>
            </div>
            <button
              onClick={closeAlert}
              className={`ml-4 p-1.5 rounded-lg transition-colors ${alertInfo.type === "error" ? "text-red-400 hover:bg-red-500/20" : "text-green-400 hover:bg-green-500/20"}`}
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
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* --- KUSTOM INTERACTIVE CROPPER MODAL (1:1 Ratio) --- */}
      {cropModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#151226] border border-white/10 p-6 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <h3 className="text-lg font-black text-white mb-1">
              Sesuaikan Foto Profil
            </h3>
            <p className="text-xs text-gray-400 mb-4">
              Drag gambar langsung atau gunakan slider untuk mengatur posisi &
              zoom.
            </p>

            <div className="flex justify-center mb-4">
              <canvas
                ref={canvasRef}
                width={250}
                height={250}
                className={`border-2 border-[#FF78C6] rounded-full bg-[#0D0B1A] shadow-inner select-none ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>

            <div className="space-y-3 text-left bg-black/30 p-3 rounded-xl border border-white/5">
              <div>
                <label className="text-[11px] font-bold text-gray-400 flex justify-between">
                  Ukuran Zoom <span>{cropScale.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min={minScale}
                  max={minScale * 3}
                  step={0.01}
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-lg accent-[#FF78C6]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 flex justify-between">
                  Geser Horisontal (X) <span>{Math.round(cropX)}px</span>
                </label>
                <input
                  type="range"
                  min={-sliderMaxX}
                  max={sliderMaxX}
                  step="1"
                  value={cropX}
                  onChange={(e) => setCropX(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-lg accent-[#4CC9FF]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-400 flex justify-between">
                  Geser Vertikal (Y) <span>{Math.round(cropY)}px</span>
                </label>
                <input
                  type="range"
                  min={-sliderMaxY}
                  max={sliderMaxY}
                  step="1"
                  value={cropY}
                  onChange={(e) => setCropY(Number(e.target.value))}
                  className="w-full h-1 bg-gray-700 rounded-lg accent-[#4CC9FF]"
                />
              </div>

              {/* Info kalau gambar sudah persegi — slider tidak perlu */}
              {sliderMaxX === 0 && sliderMaxY === 0 && imageRef.current && (
                <p className="text-[11px] text-gray-500 text-center py-1">
                  Gambar sudah persegi — gunakan drag atau zoom.
                </p>
              )}
            </div>

            <div className="flex gap-2 mt-5">
              <button
                onClick={saveCroppedImage}
                className="flex-1 py-2.5 bg-gradient-to-r from-[#FF78C6] to-[#8B6CFF] text-white font-bold rounded-xl text-xs uppercase tracking-wider"
              >
                Potong & Simpan
              </button>
              <button
                onClick={() => setCropModal(false)}
                className="px-4 py-2.5 bg-white/5 text-gray-400 rounded-xl text-xs font-bold hover:bg-white/10"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* --- KUSTOM MODAL KONFIRMASI HAPUS KOMENTAR --- */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#151226] border border-white/10 p-6 rounded-2xl shadow-2xl max-w-sm w-full">
            <h3 className="text-xl font-bold text-white mb-2">
              Hapus Komentar?
            </h3>
            <p className="text-gray-400 text-sm mb-6">
              Tindakan ini tidak dapat dibatalkan. Komentar akan terhapus secara
              permanen dari database.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setConfirmDialog({ show: false, id: null })}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors text-sm font-bold"
              >
                Batal
              </button>
              <button
                onClick={executeDeleteComment}
                className="px-4 py-2 bg-red-500/20 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-colors text-sm font-bold border border-red-500/30"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* PANEL PROFIL UTAMA */}
        <div className="bg-[#151226]/80 backdrop-blur-xl border border-white/5 rounded-3xl p-8 shadow-2xl relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#FF78C6] overflow-hidden shrink-0 bg-[#0D0B1A] shadow-lg">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Avatar Preview"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              ) : (
                <NextImage
                  src={currentAvatar}
                  alt="Avatar"
                  width={160}
                  height={160}
                  className="w-full h-full object-cover"
                />
              )}
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              {isAdmin && (
                <span className="inline-block bg-[#FFD98A]/20 text-[#FFD98A] border border-[#FFD98A]/30 px-3 py-1 rounded-full text-xs font-bold tracking-widest mb-3 uppercase w-max mx-auto md:mx-0">
                  👑 Admin MangNime
                </span>
              )}

              {!isEditing ? (
                <>
                  <h1 className="text-3xl md:text-4xl font-black text-white mb-2 uppercase tracking-tight">
                    {currentName}
                  </h1>
                  <p className="text-gray-400 mb-6 font-mono text-sm">
                    {user.email}
                  </p>
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
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-2 uppercase">
                      Unggah Foto (Maks 2.5MB)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-[#FF78C6]/10 file:text-[#FF78C6] file:border-0 hover:file:bg-[#FF78C6]/20 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-400 mb-1.5 uppercase">
                      Nama Lengkap
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 text-white rounded-xl px-4 py-3 outline-none focus:border-[#FF78C6] transition-colors"
                      required
                    />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 py-2 bg-[#FF78C6] text-white font-bold rounded-xl hover:bg-pink-500 transition-colors text-sm"
                    >
                      {updateLoading ? "Menyimpan..." : "Simpan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setPreviewUrl("");
                        setFinalBlob(null);
                      }}
                      className="px-4 py-2 bg-white/5 text-gray-400 rounded-xl hover:bg-white/10 transition-colors text-sm"
                    >
                      Batal
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* RIWAYAT MENONTON / MEMBACA */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#4CC9FF]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4l12 6-12 6z" />
              </svg>{" "}
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
                    <NextImage
                      src={h.image}
                      alt={h.title}
                      width={48}
                      height={64}
                      className="w-12 h-16 object-cover rounded bg-black/50 border border-white/5"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1">
                        {h.title}
                      </h4>
                      <p className="text-xs text-[#4CC9FF] mt-1">
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

          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 border-b border-white/10 pb-2 flex items-center gap-2">
              <svg
                className="w-5 h-5 text-[#FF78C6]"
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
              </svg>{" "}
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
                    <NextImage
                      src={h.image}
                      alt={h.title}
                      width={48}
                      height={64}
                      className="w-12 h-16 object-cover rounded bg-black/50 border border-white/5"
                    />
                    <div>
                      <h4 className="text-sm font-bold text-white line-clamp-1 group-hover:text-[#FF78C6] transition-colors">
                        {h.title}
                      </h4>
                      <p className="text-xs text-[#FF78C6] mt-1">
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

        {/* MODERASI DASHBOARD ADMIN */}
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
                </svg>{" "}
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
                      className="w-6 h-6 text-[#4CC9FF] group-hover:scale-110 transition-transform"
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
                    Lihat ringkasan total pengguna terdaftar.
                  </p>
                </button>
                <button
                  onClick={() => setAdminMenu("comments")}
                  className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 text-left hover:bg-white/[0.05] transition-all group"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <svg
                      className="w-6 h-6 text-[#FF78C6] group-hover:scale-110 transition-transform"
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
                    Pantau dan kelola komentar spam sistem.
                  </p>
                </button>
              </div>
            )}

            {adminMenu === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-10 text-center">
                  <div className="text-6xl font-black text-[#4CC9FF] mb-2">
                    {totalUsers}
                  </div>
                  <div className="text-xs text-gray-500 font-bold uppercase">
                    Total User Terdaftar
                  </div>
                </div>
                <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-10 text-center">
                  <div className="text-6xl font-black text-[#FF78C6] mb-2">
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
                      if (slug) commentUrl = `/komik/${slug}`;
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
                            <span className="text-[10px] text-[#4CC9FF] bg-[#4CC9FF]/10 px-2 py-0.5 rounded truncate font-mono border border-[#4CC9FF]/20">
                              {rawTopicId || "⚠️ Data Lama"}
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
                              className="bg-[#4CC9FF]/20 text-[#4CC9FF] hover:bg-[#4CC9FF] hover:text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors border border-[#4CC9FF]/30"
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
                            onClick={() => confirmDeleteComment(comment.id)}
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
                className="w-5 h-5 text-[#FFD98A]"
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
              </svg>{" "}
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
