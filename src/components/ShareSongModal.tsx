import { QRCodeCanvas } from "qrcode.react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Share2, Copy } from "lucide-react";
import { toast } from "sonner";

interface ShareSongModalProps {
  songId: string;
  songTitle: string;
  artistName: string;
  onClose: () => void;
}

export default function ShareSongModal({ songId, songTitle, artistName, onClose }: ShareSongModalProps) {
  const songUrl = `${window.location.origin}/song/${songId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(songUrl);
      toast.success("Link copied to clipboard!");
    } catch {
      toast.error("Failed to copy link.");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: `${songTitle} by ${artistName}`, url: songUrl });
        toast.success("Shared successfully!");
      } catch {
        // User cancelled
      }
    } else {
      handleCopy();
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[70] flex items-center justify-center bg-background/40 backdrop-blur-md"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="relative w-11/12 max-w-sm glass border border-border/30 shadow-2xl rounded-3xl p-6 text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition"
          >
            <X size={22} />
          </button>

          <h2 className="text-xl font-bold mb-1 text-foreground">Share Song</h2>
          <p className="text-sm text-muted-foreground mb-5">{songTitle} — {artistName}</p>

          <div className="flex justify-center mb-5">
            <div className="p-3 bg-card border border-border rounded-2xl">
              <QRCodeCanvas value={songUrl} size={130} bgColor="transparent" fgColor="hsl(220,20%,25%)" level="H" />
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl px-3 py-2 flex items-center justify-between text-sm text-foreground/70">
            <span className="truncate">{songUrl}</span>
            <button onClick={handleCopy} className="ml-2 hover:text-primary transition">
              <Copy size={16} />
            </button>
          </div>

          <button
            onClick={handleShare}
            className="w-full mt-5 py-3 rounded-xl bg-primary hover:bg-primary/90 transition text-primary-foreground font-semibold flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share Song
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
