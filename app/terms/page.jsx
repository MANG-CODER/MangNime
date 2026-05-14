import Link from "next/link";

export const metadata = {
  title: "Syarat & Ketentuan - MangNime",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0D0B1A] pb-20 pt-10 animate-fade-in">
      <div className="container mx-auto px-4 max-w-[900px]">
        <div className="mb-10 text-center">
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white mb-4">
            Syarat & <span className="text-celestia-lavender">Ketentuan</span>
          </h1>
          <p className="text-gray-400">Terms of Service & DMCA Disclaimer.</p>
        </div>

        <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6 text-gray-300 backdrop-blur-xl leading-relaxed">
          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">
            1. Ketentuan Penggunaan
          </h2>
          <p>
            Dengan mengakses dan menggunakan situs MangNime, Anda menerima dan
            setuju untuk terikat dengan syarat dan ketentuan perjanjian ini.
            Jika Anda tidak menyetujui syarat-syarat ini, Anda tidak
            diperkenankan menggunakan situs ini.
          </p>

          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 pt-4">
            2. Disclaimer Hak Cipta (DMCA)
          </h2>
          <p>
            MangNime adalah situs penyedia layanan indeks tautan yang menautkan
            konten ke sumber pihak ketiga.{" "}
            <strong>
              MangNime TIDAK menyimpan file video, gambar, atau media apa pun di
              server kami sendiri.
            </strong>
          </p>
          <p>
            Semua video yang Anda tonton di MangNime di-<strong>hosting </strong> oleh layanan
            pihak ketiga (seperti Google Drive, Mega, VidHide, Mp4upload, dan
            lainnya) yang tidak berada di bawah kendali kami. Oleh karena itu,
            MangNime tidak bertanggung jawab atas kepatuhan hak cipta,
            legalitas, keakuratan, atau kelayakan materi yang terkandung dalam
            situs pihak ketiga tersebut.
          </p>

          <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2 pt-4">
            3. Penghapusan Konten
          </h2>
          <p>
            Jika Anda adalah pemilik hak cipta dan merasa bahwa konten Anda
            telah diunggah atau ditautkan tanpa izin di situs ini, silakan
            hubungi layanan pihak ketiga tempat <strong>file</strong> tersebut di-<strong>hosting </strong>
            untuk meminta penghapusan. Karena kami tidak menyimpan <strong>file </strong>
            tersebut, kami tidak dapat menghapusnya dari peredaran internet.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="inline-flex px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-bold transition-all"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
