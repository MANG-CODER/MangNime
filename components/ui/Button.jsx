import Link from "next/link";

export default function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className = "",
  ...props
}) {
  const baseStyles =
    "inline-flex items-center justify-center font-extrabold transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:pointer-events-none";

  const sizes = {
    sm: "px-5 py-2 text-xs rounded-full",
    md: "px-7 py-3 text-xs md:text-sm rounded-full",
    lg: "px-9 py-3.5 text-sm md:text-base rounded-full",
  };

  const variants = {
    primary:
      "bg-[#F4B8C6] hover:bg-[#f8c7d3] text-[#161218] shadow-vogue-blush hover:-translate-y-0.5",
    secondary:
      "bg-[#211B24] text-[#FDF6F7] hover:bg-[#2B232F] border border-[#F4B8C6]/30 hover:border-[#F4B8C6]",
    tertiary:
      "bg-[#161218] text-[#AD9CA6] hover:text-[#FDF6F7] border border-[#F4B8C6]/15 hover:bg-[#211B24]",
    gold: "bg-gradient-to-r from-[#F7D6C4] to-[#F4B8C6] text-[#161218] shadow-glow-gold hover:-translate-y-0.5",
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
