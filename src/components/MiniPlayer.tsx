import { usePlayer } from "@/contexts/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, ChevronUp } from "lucide-react";
import SongCover from "./SongCover";

export default function MiniPlayer() {
  const { currentSong, isPlaying, toggle, next, previous, currentTime, openFullPlayer } = usePlayer();

  if (!currentSong) return null;

  const progress = currentSong.duration > 0 ? (currentTime / currentSong.duration) * 100 : 0;

  // Positioned above the bottom nav (bottom nav ~56px)
  return (
    <div className="fixed bottom-[56px] left-0 right-0 z-50">
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-secondary">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="glass border-t border-border/30 px-4 py-2">
        <div className="flex items-center gap-3 max-w-screen-xl mx-auto">
          <button onClick={openFullPlayer} className="flex items-center gap-3 flex-1 min-w-0 text-left">
            <SongCover coverUrl={currentSong.coverUrl} title={currentSong.title} size="sm" />
            <div className="min-w-0">
              <p className="text-sm font-medium truncate text-foreground">{currentSong.title}</p>
              <p className="text-xs text-muted-foreground truncate">{currentSong.artist}</p>
            </div>
          </button>

          <div className="flex items-center gap-1">
            <button onClick={previous} className="p-2 text-foreground/80 hover:text-foreground transition-colors">
              <SkipBack size={20} />
            </button>
            <button
              onClick={toggle}
              className="p-2.5 rounded-full bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <button onClick={next} className="p-2 text-foreground/80 hover:text-foreground transition-colors">
              <SkipForward size={20} />
            </button>
          </div>

          <button onClick={openFullPlayer} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <ChevronUp size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
