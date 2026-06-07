import { Outfit, Poppins } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const outfit = Outfit({
  weight: ['400', '700', '900'],
  subsets: ["latin"],
  variable: "--font-outfit",
  display: 'swap',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
  variable: "--font-poppins",
});

export const metadata = {
  title: "MangNime - Streaming Anime Gratis",
  description:
    "Tempat nonton anime subtitle Indonesia gratis dengan kualitas HD dan tanpa iklan yang menggangu.",
    icons: {
    icon: "/img/Icon.png",
    apple: "/img/Icon.png",
  },
  openGraph: {
    title: "MangNime - Streaming Anime Sub Indo Gratis",
    description: "Nonton anime subtitle Indonesia terbaik dengan kualitas HD.",
    url: "https://mangnime.vercel.app",
    siteName: "MangNime",
    images: [
      {
        url: "/img/logo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" className="scroll-smooth scroll-pt-20 md:scroll-pt-24">
      <body
        className={`${outfit.variable} ${poppins.variable} font-body bg-celestia-night text-white antialiased flex flex-col min-h-screen`}
      >
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
