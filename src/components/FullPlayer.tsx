import { usePlayer } from "@/contexts/PlayerContext";
import { Play, Pause, SkipBack, SkipForward, ChevronDown, Shuffle, Repeat, Heart, ListMusic } from "lucide-react";
import { formatDuration } from "@/lib/mockData";
import { motion, AnimatePresence } from "framer-motion";
import SongCover from "./SongCover";
import { Slider } from "@/components/ui/slider";

export default function FullPlayer() {
  const {
    currentSong,
    isPlaying,
    toggle,
    next,
    previous,
    currentTime,
    seek,
    isFullPlayer,
    closeFullPlayer,
  } = usePlayer();

  if (!currentSong) return null;

  return (
    <AnimatePresence>
      {isFullPlayer && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed inset-0 z-[60] bg-background flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4">
            <button onClick={closeFullPlayer} className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ChevronDown size={24} />
            </button>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Now Playing</p>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <ListMusic size={20} />
            </button>
          </div>

          {/* Cover art */}
          <div className="flex-1 flex items-center justify-center px-12">
            <div className="w-full max-w-sm aspect-square">
              <SongCover
                coverUrl={currentSong.coverUrl}
                title={currentSong.title}
                size="xl"
                className="w-full h-full rounded-2xl shadow-2xl glow-primary"
              />
            </div>
          </div>

          {/* Song info */}
          <div className="px-8 mt-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h2 className="text-xl font-bold text-foreground truncate">{currentSong.title}</h2>
                <p className="text-sm text-muted-foreground">{currentSong.artist}</p>
              </div>
              <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                <Heart size={22} />
              </button>
            </div>
          </div>

          {/* Progress */}
          <div className="px-8 mt-6">
            <Slider
              value={[currentTime]}
              max={currentSong.duration}
              step={1}
              onValueChange={([v]) => seek(v)}
              className="w-full"
            />
            <div className="flex justify-between mt-1.5">
              <span className="text-xs text-muted-foreground">{formatDuration(currentTime)}</span>
              <span className="text-xs text-muted-foreground">{formatDuration(currentSong.duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-6 py-6">
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Shuffle size={20} />
            </button>
            <button onClick={previous} className="p-3 text-foreground hover:text-foreground/80 transition-colors">
              <SkipBack size={28} fill="currentColor" />
            </button>
            <button
              onClick={toggle}
              className="w-16 h-16 rounded-full bg-primary flex items-center justify-center hover:bg-primary/90 transition-colors glow-primary"
            >
              {isPlaying ? (
                <Pause size={28} className="text-primary-foreground" />
              ) : (
                <Play size={28} className="text-primary-foreground ml-1" />
              )}
            </button>
            <button onClick={next} className="p-3 text-foreground hover:text-foreground/80 transition-colors">
              <SkipForward size={28} fill="currentColor" />
            </button>
            <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
              <Repeat size={20} />
            </button>
          </div>

          <div className="h-8" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
