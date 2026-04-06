"use client";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "category" | "status" | "landsIn" | "tag" | "file";
  className?: string;
}

export default function Badge({ children, variant = "tag", className = "" }: BadgeProps) {
  const base = "inline-flex items-center rounded-[20px] px-2 py-[2px] text-[10px] font-bold leading-tight";

  const variants: Record<string, string> = {
    category: "bg-[#7B8FF7]/15 text-[#7B8FF7]",
    status: "bg-[#5CEFB5]/15 text-[#5CEFB5]",
    landsIn: "bg-[#5CEFB5]/10 text-[#5CEFB5]",
    tag: "bg-[#232833] text-[#7A7F8E]",
    file: "bg-[#5CEFB5]/10 text-[#5CEFB5]",
  };

  return (
    <span className={`${base} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
