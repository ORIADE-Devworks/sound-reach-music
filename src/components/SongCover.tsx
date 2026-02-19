import { Music } from "lucide-react";

interface SongCoverProps {
  coverUrl?: string;
  title: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "h-12 w-12",
  md: "h-24 w-24",
  lg: "h-40 w-40",
  xl: "h-64 w-64",
};

const iconSizeMap = {
  sm: 16,
  md: 32,
  lg: 48,
  xl: 64,
};

export default function SongCover({ coverUrl, title, size = "md", className = "" }: SongCoverProps) {
  if (coverUrl) {
    return (
      <img
        src={coverUrl}
        alt={`${title} cover`}
        className={`${sizeMap[size]} rounded-lg object-cover ${className}`}
      />
    );
  }

  // Generate a deterministic color from title
  const hash = title.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hues = [145, 200, 280, 320, 30, 60, 170, 240];
  const hue = hues[hash % hues.length];

  return (
    <div
      className={`${sizeMap[size]} rounded-lg flex items-center justify-center ${className}`}
      style={{
        background: `linear-gradient(135deg, hsl(${hue} 60% 25%), hsl(${(hue + 40) % 360} 50% 15%))`,
      }}
    >
      <Music size={iconSizeMap[size]} className="text-white/50" />
    </div>
  );
}
