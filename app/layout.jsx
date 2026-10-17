import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://mangnime.my.id"),
  title: "MangNime",
  description:
    "Tempat nonton anime subtitle Indonesia gratis dengan kualitas HD dan tanpa iklan yang menggangu.",
  icons: {
    icon: "/img/Icon.svg",
    apple: "/img/Icon2.svg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="id"
      data-scroll-behavior="smooth"
      className="scroll-smooth scroll-pt-20"
    >
      <body
        className={`${jakarta.variable} ${playfair.variable} font-body bg-[#120F16] text-[#FAF5F8] antialiased flex flex-col min-h-screen selection:bg-[#FFB7C5] selection:text-[#120F16]`}
      >
        <Navbar />
        <main className="flex-grow pb-24 lg:pb-0">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
