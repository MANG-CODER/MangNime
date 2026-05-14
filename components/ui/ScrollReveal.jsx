"use client";

import { useEffect, useRef, useState } from "react";

export default function ScrollReveal({ children, className = "" }) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Jika elemen masuk ke dalam viewport (layar)
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Hentikan observasi setelah elemen terlihat agar animasi tidak berulang
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Animasi terpicu saat 10% elemen mulai terlihat
        rootMargin: "50px", // Memuat elemen sedikit sebelum benar-benar masuk layar
      },
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
      } ${className}`}
    >
      {children}
    </div>
  );
}
