import { Song, formatPlays } from "@/lib/mockData";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router-dom";
import { Play } from "lucide-react";
import SongCover from "./SongCover";

interface SongCardProps {
  song: Song;
}

export default function SongCard({ song }: SongCardProps) {
  const { play } = usePlayer();
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/song/${song.id}`)}
      className="group flex flex-col items-center gap-2 p-3 rounded-xl transition-colors hover:bg-secondary/50 text-left w-full"
    >
      <div className="relative w-full aspect-square">
        <SongCover coverUrl={song.coverUrl} title={song.title} size="lg" className="w-full h-full" />
        <div className="absolute inset-0 bg-background/0 group-hover:bg-background/30 transition-colors rounded-lg flex items-center justify-center">
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform scale-75 group-hover:scale-100">
            <Play size={18} className="text-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>
      <div className="w-full">
        <p className="text-sm font-medium truncate text-foreground">{song.title}</p>
        <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
        <p className="text-xs text-muted-foreground/60">{formatPlays(song.plays)} plays</p>
      </div>
    </button>
  );
}
