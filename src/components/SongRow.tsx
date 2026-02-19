import { useState } from "react";
import { Song, formatDuration } from "@/lib/mockData";
import { usePlayer } from "@/contexts/PlayerContext";
import { MoreVertical } from "lucide-react";
import SongCover from "./SongCover";
import SongOptionsMenu from "./SongOptionsMenu";
import ShareSongModal from "./ShareSongModal";

interface SongRowProps {
  song: Song;
  index?: number;
  showIndex?: boolean;
}

export default function SongRow({ song, index, showIndex }: SongRowProps) {
  const { play, currentSong } = usePlayer();
  const isActive = currentSong?.id === song.id;
  const [optionsOpen, setOptionsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  return (
    <>
      <div
        className={`flex items-center gap-3 w-full px-4 py-3 rounded-lg transition-colors text-left group
          ${isActive ? "bg-primary/10" : "hover:bg-secondary/60"}`}
      >
        {showIndex && (
          <span className={`w-6 text-sm text-center ${isActive ? "text-primary font-semibold" : "text-muted-foreground"}`}>
            {(index ?? 0) + 1}
          </span>
        )}
        <button onClick={() => play(song)} className="flex items-center gap-3 flex-1 min-w-0">
          <SongCover coverUrl={song.coverUrl} title={song.title} size="sm" />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium truncate ${isActive ? "text-primary" : "text-foreground"}`}>
              {song.title}
            </p>
            <p className={`text-xs truncate ${isActive ? "text-primary/70" : "text-muted-foreground"}`}>
              {song.artist}
            </p>
          </div>
        </button>
        <span className="text-xs text-muted-foreground mr-2">{formatDuration(song.duration)}</span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setOptionsOpen(true);
          }}
          className="p-1 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground transition-all"
        >
          <MoreVertical size={18} />
        </button>
      </div>

      <SongOptionsMenu
        song={song}
        isOpen={optionsOpen}
        onClose={() => setOptionsOpen(false)}
        onShare={() => setShareOpen(true)}
      />

      {shareOpen && (
        <ShareSongModal
          songId={song.id}
          songTitle={song.title}
          artistName={song.artist}
          onClose={() => setShareOpen(false)}
        />
      )}
    </>
  );
}
