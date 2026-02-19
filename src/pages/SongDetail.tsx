import { useParams, useNavigate } from "react-router-dom";
import { MOCK_SONGS, formatDuration, formatPlays } from "@/lib/mockData";
import { usePlayer } from "@/contexts/PlayerContext";
import { ArrowLeft, Play, Heart, Share2, Clock, Music, ChevronDown, ChevronUp, Disc, Calendar, Tag, FileAudio, User } from "lucide-react";
import SongCover from "@/components/SongCover";
import SongRow from "@/components/SongRow";
import ShareSongModal from "@/components/ShareSongModal";
import { useState } from "react";

export default function SongDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { play } = usePlayer();
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const song = MOCK_SONGS.find((s) => s.id === id);
  if (!song) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Song not found</p>
      </div>
    );
  }

  const related = MOCK_SONGS.filter((s) => s.id !== song.id && (s.genre === song.genre || s.artist === song.artist)).slice(0, 5);

  return (
    <div className="py-6 animate-fade-in">
      <button onClick={() => navigate(-1)} className="p-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft size={24} />
      </button>

      {/* Hero */}
      <div className="flex flex-col items-center text-center mb-8">
        <SongCover coverUrl={song.coverUrl} title={song.title} size="xl" className="rounded-2xl shadow-2xl mb-6" />
        <h1 className="text-2xl font-bold text-foreground">{song.title}</h1>
        <p className="text-muted-foreground mt-1">{song.artist}</p>
        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap justify-center">
          <span className="flex items-center gap-1"><Music size={12} />{song.genre}</span>
          <span className="flex items-center gap-1"><Clock size={12} />{formatDuration(song.duration)}</span>
          <span>{formatPlays(song.plays)} plays</span>
          {song.explicit && <span className="px-1.5 py-0.5 rounded bg-secondary text-secondary-foreground font-bold text-[10px]">E</span>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-4 mb-8">
        <button className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors">
          <Heart size={20} />
        </button>
        <button
          onClick={() => play(song)}
          className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-semibold flex items-center gap-2 hover:bg-primary/90 transition-colors glow-primary"
        >
          <Play size={20} className="ml-0.5" /> Play
        </button>
        <button
          onClick={() => setShareOpen(true)}
          className="p-3 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80 transition-colors"
        >
          <Share2 size={20} />
        </button>
      </div>

      {/* Song Details / Metadata */}
      <div className="glass rounded-xl p-4 mb-6 space-y-3">
        <h3 className="text-sm font-semibold text-foreground mb-2">Song Details</h3>
        <div className="grid grid-cols-2 gap-3 text-sm">
          {song.isrc && (
            <div className="flex items-center gap-2">
              <Disc size={14} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">ISRC</p>
                <p className="text-foreground font-medium">{song.isrc}</p>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Calendar size={14} className="text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Release Date</p>
              <p className="text-foreground font-medium">{song.releaseDate}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Tag size={14} className="text-muted-foreground shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Genre</p>
              <p className="text-foreground font-medium">{song.genre}</p>
            </div>
          </div>
          {song.audioFormat && (
            <div className="flex items-center gap-2">
              <FileAudio size={14} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Format</p>
                <p className="text-foreground font-medium">{song.audioFormat}</p>
              </div>
            </div>
          )}
          {song.uploadedBy && (
            <div className="flex items-center gap-2">
              <User size={14} className="text-muted-foreground shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Uploaded By</p>
                <p className="text-foreground font-medium">{song.uploadedBy}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      {song.description && (
        <div className="glass rounded-xl p-4 mb-6">
          <h3 className="text-sm font-semibold text-foreground mb-2">About</h3>
          <p className="text-sm text-muted-foreground">{song.description}</p>
        </div>
      )}

      {/* Lyrics */}
      {song.lyrics && (
        <div className="glass rounded-xl p-4 mb-6">
          <button
            onClick={() => setLyricsOpen(!lyricsOpen)}
            className="flex items-center justify-between w-full text-foreground font-semibold text-sm"
          >
            Lyrics
            {lyricsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
          {lyricsOpen && (
            <pre className="mt-3 text-sm text-muted-foreground whitespace-pre-wrap font-sans leading-relaxed">
              {song.lyrics}
            </pre>
          )}
        </div>
      )}

      {/* Related */}
      {related.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-3">You might also like</h3>
          <div className="glass rounded-xl p-2 space-y-0.5">
            {related.map((s, i) => (
              <SongRow key={s.id} song={s} index={i} />
            ))}
          </div>
        </div>
      )}

      {/* Share Modal */}
      {shareOpen && (
        <ShareSongModal
          songId={song.id}
          songTitle={song.title}
          artistName={song.artist}
          onClose={() => setShareOpen(false)}
        />
      )}
    </div>
  );
}
