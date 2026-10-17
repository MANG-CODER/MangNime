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

  const [alertInfo, setAlertInfo] = useState({
    show: false,
    type: "",
    text: "",
  });
  const [confirmDialog, setConfirmDialog] = useState({ show: false, id: null });

  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);

  // STATE RESIZER/CROPPER 1:1 INTERAKTIF
  const [cropModal, setCropModal] = useState(false);
  const [rawImageSrc, setRawImageSrc] = useState("");
  const [cropScale, setCropScale] = useState(1);
  const [cropX, setCropX] = useState(0);
  const [cropY, setCropY] = useState(0);
  const [minScale, setMinScale] = useState(1);
  const [finalBlob, setFinalBlob] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

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
      <div className="min-h-screen bg-[#161218] flex items-center justify-center text-[#F4B8C6] text-sm font-bold">
        Memuat profil...
      </div>
    );
  if (!user) return null;

  const isAdmin = user.user_metadata?.role === "admin";
  const currentName = user.user_metadata?.full_name || user.email.split("@")[0];
  const currentAvatar =
    user.user_metadata?.avatar_url || "https://placehold.co/200/211B24/F4B8C6";

  const sliderMaxX = imageRef.current
    ? Math.max(0, (imageRef.current.naturalWidth * cropScale - 250) / 2)
    : 0;
  const sliderMaxY = imageRef.current
    ? Math.max(0, (imageRef.current.naturalHeight * cropScale - 250) / 2)
    : 0;

  return (
    <div className="min-h-screen bg-[#161218] pt-8 pb-20 px-4 md:px-8 relative">
      {/* FLOATING TOAST ALERT */}
      {alertInfo.show && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-[150] animate-fade-in w-[90%] max-w-md">
          <div
            className={`flex items-start justify-between p-4 rounded-2xl border backdrop-blur-2xl shadow-vogue-card ${
              alertInfo.type === "error"
                ? "bg-[#211B24]/95 border-[#E88D9E]/60 text-[#FDF6F7]"
                : "bg-[#211B24]/95 border-[#F4B8C6]/60 text-[#FDF6F7]"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="w-6 h-6 rounded-full bg-[#F4B8C6]/20 text-[#F4B8C6] flex items-center justify-center text-xs font-extrabold shrink-0">
                {alertInfo.type === "error" ? "!" : "✓"}
              </span>
              <p className="text-xs md:text-sm font-medium">{alertInfo.text}</p>
            </div>
            <button
              onClick={closeAlert}
              className="ml-4 text-[#AD9CA6] hover:text-[#FDF6F7]"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* KUSTOM INTERACTIVE CROPPER MODAL (1:1 Ratio) */}
      {cropModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#211B24] border border-[#F4B8C6]/25 p-6 rounded-[32px] shadow-vogue-card max-w-sm w-full text-center">
            <h3 className="text-lg font-extrabold text-[#FDF6F7] mb-1">
              Sesuaikan Foto Profil
            </h3>
            <p className="text-xs text-[#AD9CA6] mb-4">
              Geser gambar langsung atau gunakan slider untuk mengatur posisi
              &amp; zoom.
            </p>

            <div className="flex justify-center mb-4">
              <canvas
                ref={canvasRef}
                width={250}
                height={250}
                className={`border-2 border-[#F4B8C6] rounded-full bg-[#161218] shadow-inner select-none ${
                  isDragging ? "cursor-grabbing" : "cursor-grab"
                }`}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              />
            </div>

            <div className="space-y-3 text-left bg-[#161218] p-3.5 rounded-2xl border border-[#F4B8C6]/15">
              <div>
                <label className="text-[11px] font-bold text-[#AD9CA6] flex justify-between">
                  Ukuran Zoom{" "}
                  <span className="text-[#F4B8C6]">
                    {cropScale.toFixed(1)}x
                  </span>
                </label>
                <input
                  type="range"
                  min={minScale}
                  max={minScale * 3}
                  step={0.01}
                  value={cropScale}
                  onChange={(e) => setCropScale(parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-[#211B24] rounded-lg accent-[#F4B8C6]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#AD9CA6] flex justify-between">
                  Geser Horizontal (X){" "}
                  <span className="text-[#B8C4D4]">{Math.round(cropX)}px</span>
                </label>
                <input
                  type="range"
                  min={-sliderMaxX}
                  max={sliderMaxX}
                  step="1"
                  value={cropX}
                  onChange={(e) => setCropX(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#211B24] rounded-lg accent-[#B8C4D4]"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#AD9CA6] flex justify-between">
                  Geser Vertikal (Y){" "}
                  <span className="text-[#B8C4D4]">{Math.round(cropY)}px</span>
                </label>
                <input
                  type="range"
                  min={-sliderMaxY}
                  max={sliderMaxY}
                  step="1"
                  value={cropY}
                  onChange={(e) => setCropY(Number(e.target.value))}
                  className="w-full h-1.5 bg-[#211B24] rounded-lg accent-[#B8C4D4]"
                />
              </div>
            </div>

            <div className="flex gap-2.5 mt-5">
              <button
                type="button"
                onClick={saveCroppedImage}
                className="flex-1 py-2.5 bg-[#F4B8C6] text-[#161218] font-extrabold rounded-full text-xs uppercase tracking-wider shadow-vogue-blush"
              >
                Potong &amp; Simpan
              </button>
              <button
                type="button"
                onClick={() => setCropModal(false)}
                className="px-5 py-2.5 bg-[#161218] text-[#AD9CA6] rounded-full text-xs font-bold hover:text-[#FDF6F7]"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL KONFIRMASI HAPUS KOMENTAR */}
      {confirmDialog.show && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#211B24] border border-[#F4B8C6]/25 p-6 rounded-3xl shadow-vogue-card max-w-sm w-full">
            <h3 className="text-lg font-extrabold text-[#FDF6F7] mb-2">
              Hapus Komentar?
            </h3>
            <p className="text-[#AD9CA6] text-xs leading-relaxed mb-6">
              Tindakan ini tidak dapat dibatalkan. Komentar akan terhapus secara
              permanen dari database.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() => setConfirmDialog({ show: false, id: null })}
                className="px-4 py-2 text-[#AD9CA6] hover:text-[#FDF6F7] text-xs font-bold"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={executeDeleteComment}
                className="px-5 py-2 bg-[#E88D9E] text-[#161218] rounded-full text-xs font-extrabold"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* PANEL PROFIL UTAMA */}
        <div className="bg-[#211B24]/90 backdrop-blur-2xl border border-[#F4B8C6]/20 rounded-[32px] p-7 md:p-10 shadow-vogue-card relative overflow-hidden mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="w-32 h-32 md:w-36 md:h-36 rounded-full border-2 border-[#F4B8C6] p-1 overflow-hidden shrink-0 bg-[#161218] shadow-vogue-card">
              <div className="w-full h-full rounded-full overflow-hidden">
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
                    unoptimized
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left w-full">
              {isAdmin && (
                <span className="inline-block bg-[#F7D6C4]/15 text-[#F7D6C4] border border-[#F7D6C4]/35 px-3.5 py-1 rounded-full text-[11px] font-extrabold tracking-wider mb-3 uppercase">
                  👑 Admin MangNime
                </span>
              )}

              {!isEditing ? (
                <>
                  <h1 className="text-2xl md:text-4xl font-extrabold text-[#FDF6F7] mb-1.5 tracking-tight">
                    {currentName}
                  </h1>
                  <p className="text-[#AD9CA6] mb-6 text-xs md:text-sm">
                    {user.email}
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start gap-3">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-2.5 bg-[#F4B8C6] text-[#161218] rounded-full text-xs font-extrabold shadow-vogue-blush active:scale-95 transition-all"
                    >
                      Edit Profil
                    </button>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="px-6 py-2.5 bg-[#161218] text-[#E88D9E] rounded-full text-xs font-bold border border-[#E88D9E]/30 hover:bg-[#E88D9E] hover:text-[#161218] transition-all"
                    >
                      Keluar (Logout)
                    </button>
                  </div>
                </>
              ) : (
                <form
                  onSubmit={handleUpdateProfile}
                  className="space-y-4 max-w-md mx-auto md:mx-0 text-left bg-[#161218] p-5 rounded-3xl border border-[#F4B8C6]/20"
                >
                  <div>
                    <label className="block text-xs font-bold text-[#AD9CA6] mb-2 uppercase tracking-wider">
                      Unggah Foto (Maks 2.5MB)
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="block w-full text-xs text-[#AD9CA6] file:mr-4 file:py-2 file:px-4 file:rounded-full file:bg-[#F4B8C6]/15 file:text-[#F4B8C6] file:font-bold file:border-0 hover:file:bg-[#F4B8C6]/25 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#AD9CA6] mb-1.5 uppercase tracking-wider">
                      Nama Tampilan
                    </label>
                    <input
                      type="text"
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full bg-[#211B24] border border-[#F4B8C6]/25 text-[#FDF6F7] text-sm rounded-2xl px-4 py-2.5 outline-none focus:border-[#F4B8C6]"
                      required
                    />
                  </div>
                  <div className="flex gap-2.5 pt-2">
                    <button
                      type="submit"
                      disabled={updateLoading}
                      className="flex-1 py-2.5 bg-[#F4B8C6] text-[#161218] font-extrabold rounded-full text-xs shadow-vogue-blush"
                    >
                      {updateLoading ? "Menyimpan..." : "Simpan Perubahan"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setPreviewUrl("");
                        setFinalBlob(null);
                      }}
                      className="px-5 py-2.5 bg-[#211B24] text-[#AD9CA6] rounded-full hover:text-[#FDF6F7] text-xs font-bold"
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
          <div className="bg-[#211B24]/85 border border-[#F4B8C6]/15 rounded-3xl p-6 shadow-vogue-card">
            <h3 className="text-base font-extrabold text-[#FDF6F7] mb-4 border-b border-[#F4B8C6]/15 pb-3 flex items-center gap-2.5">
              <svg
                className="w-4 h-4 text-[#F4B8C6]"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M4 4l12 6-12 6z" />
              </svg>
              Terakhir Ditonton
            </h3>
            {history.anime.length > 0 ? (
              <div className="space-y-2.5">
                {history.anime.map((h, i) => (
                  <Link
                    key={i}
                    href={h.url}
                    className="flex items-center gap-3.5 hover:bg-[#F4B8C6]/[0.08] p-2 rounded-2xl transition-colors group"
                  >
                    <NextImage
                      src={h.image}
                      alt={h.title}
                      width={48}
                      height={64}
                      unoptimized
                      className="w-12 h-16 object-cover rounded-xl bg-[#161218] border border-[#F4B8C6]/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-[#FDF6F7] group-hover:text-[#F4B8C6] line-clamp-1">
                        {h.title}
                      </h4>
                      <p className="text-xs text-[#F4B8C6] mt-0.5 font-semibold">
                        Episode {h.episodeNumber}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#AD9CA6] py-6 text-center">
                Belum ada riwayat menonton anime.
              </p>
            )}
          </div>

          <div className="bg-[#211B24]/85 border border-[#F4B8C6]/15 rounded-3xl p-6 shadow-vogue-card">
            <h3 className="text-base font-extrabold text-[#FDF6F7] mb-4 border-b border-[#F4B8C6]/15 pb-3 flex items-center gap-2.5">
              <svg
                className="w-4 h-4 text-[#B8C4D4]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
              Terakhir Dibaca
            </h3>
            {history.komik.length > 0 ? (
              <div className="space-y-2.5">
                {history.komik.map((h, i) => (
                  <Link
                    key={i}
                    href={h.url}
                    className="flex items-center gap-3.5 hover:bg-[#F4B8C6]/[0.08] p-2 rounded-2xl transition-colors group"
                  >
                    <NextImage
                      src={h.image}
                      alt={h.title}
                      width={48}
                      height={64}
                      unoptimized
                      className="w-12 h-16 object-cover rounded-xl bg-[#161218] border border-[#F4B8C6]/20 shrink-0"
                    />
                    <div className="min-w-0">
                      <h4 className="text-xs md:text-sm font-bold text-[#FDF6F7] line-clamp-1 group-hover:text-[#F4B8C6] transition-colors">
                        {h.title}
                      </h4>
                      <p className="text-xs text-[#B8C4D4] mt-0.5 font-semibold">
                        Chapter {h.chapterIndex}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#AD9CA6] py-6 text-center">
                Belum ada riwayat membaca komik.
              </p>
            )}
          </div>
        </div>

        {/* MODERASI DASHBOARD ADMIN */}
        {isAdmin && (
          <div className="animate-fade-in mb-8">
            {adminMenu !== "home" && (
              <button
                type="button"
                onClick={() => setAdminMenu("home")}
                className="mb-4 text-xs text-[#F4B8C6] hover:underline font-bold flex items-center gap-1.5"
              >
                &larr; Kembali ke Menu Admin
              </button>
            )}

            {adminMenu === "home" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button
                  type="button"
                  onClick={() => setAdminMenu("stats")}
                  className="bg-[#211B24]/85 border border-[#F4B8C6]/20 rounded-3xl p-6 text-left hover:border-[#F4B8C6]/50 transition-all group shadow-vogue-card"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2.5 rounded-2xl bg-[#161218] text-[#B8C4D4]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                        />
                      </svg>
                    </span>
                    <h3 className="text-lg font-extrabold text-[#FDF6F7]">
                      Statistik Website
                    </h3>
                  </div>
                  <p className="text-xs text-[#AD9CA6]">
                    Lihat ringkasan total pengguna dan diskusi terdaftar.
                  </p>
                </button>

                <button
                  type="button"
                  onClick={() => setAdminMenu("comments")}
                  className="bg-[#211B24]/85 border border-[#F4B8C6]/20 rounded-3xl p-6 text-left hover:border-[#F4B8C6]/50 transition-all group shadow-vogue-card"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <span className="p-2.5 rounded-2xl bg-[#161218] text-[#F4B8C6]">
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                    </span>
                    <h3 className="text-lg font-extrabold text-[#FDF6F7]">
                      Moderasi Komentar
                    </h3>
                  </div>
                  <p className="text-xs text-[#AD9CA6]">
                    Pantau dan kelola komentar komunitas di seluruh halaman.
                  </p>
                </button>
              </div>
            )}

            {adminMenu === "stats" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#211B24] border border-[#F4B8C6]/20 rounded-3xl p-8 text-center">
                  <div className="text-5xl font-extrabold text-[#B8C4D4] mb-2">
                    {totalUsers}
                  </div>
                  <div className="text-xs text-[#AD9CA6] font-bold uppercase tracking-wider">
                    Total User Terdaftar
                  </div>
                </div>
                <div className="bg-[#211B24] border border-[#F4B8C6]/20 rounded-3xl p-8 text-center">
                  <div className="text-5xl font-extrabold text-[#F4B8C6] mb-2">
                    {allComments.length}
                  </div>
                  <div className="text-xs text-[#AD9CA6] font-bold uppercase tracking-wider">
                    Total Komentar
                  </div>
                </div>
              </div>
            )}

            {adminMenu === "comments" && (
              <div className="bg-[#211B24] border border-[#F4B8C6]/20 rounded-3xl p-6">
                <h3 className="text-lg font-extrabold text-[#FDF6F7] mb-5 border-b border-[#F4B8C6]/15 pb-3">
                  Daftar Seluruh Komentar
                </h3>
                <div className="space-y-3 max-h-[480px] overflow-y-auto pr-2 custom-scrollbar">
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
                        className="bg-[#161218] p-4 rounded-2xl border border-[#F4B8C6]/15 flex flex-col md:flex-row justify-between gap-4"
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2 mb-1">
                            <span className="font-bold text-xs text-[#FDF6F7]">
                              {comment.user_name}
                            </span>
                            <span className="text-[10px] text-[#B8C4D4] bg-[#B8C4D4]/15 px-2.5 py-0.5 rounded-full font-mono">
                              {rawTopicId || "Data Lama"}
                            </span>
                          </div>
                          <p className="text-xs text-[#AD9CA6] line-clamp-2">
                            {comment.content || "(Lampiran Media)"}
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0 md:self-center">
                          {commentUrl !== "#" && (
                            <Link
                              href={commentUrl}
                              className="bg-[#211B24] text-[#F4B8C6] hover:bg-[#F4B8C6] hover:text-[#161218] px-4 py-1.5 rounded-full text-xs font-bold transition-colors border border-[#F4B8C6]/25"
                            >
                              Buka
                            </Link>
                          )}
                          <button
                            type="button"
                            onClick={() => confirmDeleteComment(comment.id)}
                            className="bg-[#E88D9E]/15 text-[#E88D9E] hover:bg-[#E88D9E] hover:text-[#161218] px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
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
        <div className="bg-[#211B24]/85 border border-[#F4B8C6]/20 rounded-3xl p-6 flex justify-between items-center shadow-vogue-card">
          <div>
            <h3 className="text-lg font-extrabold text-[#FDF6F7] mb-0.5 flex items-center gap-2.5">
              <svg
                className="w-5 h-5 text-[#F4B8C6]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                />
              </svg>
              Koleksi Tersimpan (Bookmark)
            </h3>
            <p className="text-xs text-[#AD9CA6]">
              Kelola daftar anime dan komik yang kamu simpan.
            </p>
          </div>
          <Link
            href="/bookmark"
            className="px-6 py-2.5 bg-[#F4B8C6] text-[#161218] rounded-full text-xs font-extrabold hover:bg-[#f8c7d3] transition-all shadow-vogue-blush"
          >
            Buka Koleksi &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
}
