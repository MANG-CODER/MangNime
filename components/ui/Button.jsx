import Link from "next/link";

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  // Definisi gaya dasar
  const baseStyles =
    "inline-flex items-center justify-center font-bold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  // Ukuran tombol
  const sizes = {
    sm: "px-5 py-1.5 text-xs rounded-full",
    md: "px-8 py-2.5 text-sm rounded-full",
    lg: "px-10 py-3.5 text-base rounded-full",
  };

  // Varian gaya sesuai Style Guide Celestia
  const variants = {
    primary:
      "bg-gradient-to-r from-celestia-royal to-celestia-lavender text-white shadow-glow-purple hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:-translate-y-0.5",
    secondary:
      "bg-celestia-royal text-white hover:bg-celestia-lavender border border-celestia-lavender/20",
    tertiary:
      "bg-celestia-night text-white border border-white/10 hover:bg-white/5",
    gold: "bg-gradient-to-r from-celestia-gold to-celestia-pink text-celestia-night shadow-glow-gold hover:-translate-y-1",
  };

  const combinedClasses = `${baseStyles} ${sizes[size]} ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={combinedClasses} {...props}>
        {children}
      </Link>
    );
  }

  return (
    <button className={combinedClasses} {...props}>
      {children}
    </button>
  );
}
