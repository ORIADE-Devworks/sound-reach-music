import { Artist, formatPlays } from "@/lib/mockData";
import { User } from "lucide-react";

interface ArtistCardProps {
  artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
  const hash = artist.name.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  const hues = [145, 200, 280, 320, 30, 60, 170, 240];
  const hue = hues[hash % hues.length];

  return (
    <div className="flex flex-col items-center gap-2 p-3 rounded-xl transition-colors hover:bg-secondary/50 min-w-[120px]">
      {artist.avatarUrl ? (
        <img
          src={artist.avatarUrl}
          alt={artist.name}
          className="w-20 h-20 rounded-full object-cover"
        />
      ) : (
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            background: `linear-gradient(135deg, hsl(${hue} 60% 30%), hsl(${(hue + 40) % 360} 50% 18%))`,
          }}
        >
          <User size={28} className="text-foreground/40" />
        </div>
      )}
      <p className="text-sm font-medium text-foreground truncate w-full text-center">{artist.name}</p>
      <p className="text-xs text-muted-foreground">{formatPlays(artist.totalPlays)} plays</p>
    </div>
  );
}
