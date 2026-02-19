import { motion, AnimatePresence } from "framer-motion";
import { Download, Eye, Share2, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Song } from "@/lib/mockData";
import { toast } from "sonner";

interface SongOptionsMenuProps {
  song: Song;
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export default function SongOptionsMenu({ song, isOpen, onClose, onShare }: SongOptionsMenuProps) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    onClose();
    navigate(`/song/${song.id}`);
  };

  const handleDownload = () => {
    // In production this would generate a signed R2 URL
    toast.info("Downloads will be available when the backend is connected.");
    onClose();
  };

  const handleShare = () => {
    onClose();
    onShare?.();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[65] bg-background/30 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 400 }}
            className="fixed bottom-0 left-0 right-0 z-[66] glass border-t border-border/30 rounded-t-3xl p-4 pb-8"
          >
            <div className="w-10 h-1 bg-muted-foreground/30 rounded-full mx-auto mb-4" />

            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center text-muted-foreground text-sm font-bold">
                ♪
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{song.title}</p>
                <p className="text-xs text-muted-foreground truncate">{song.artist}</p>
              </div>
              <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="space-y-1">
              <button
                onClick={handleViewDetails}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-secondary/60 transition-colors text-left"
              >
                <Eye size={20} className="text-muted-foreground" />
                <span className="text-sm text-foreground">View Song Details</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-secondary/60 transition-colors text-left"
              >
                <Download size={20} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Download</span>
              </button>
              <button
                onClick={handleShare}
                className="flex items-center gap-3 w-full px-4 py-3 rounded-xl hover:bg-secondary/60 transition-colors text-left"
              >
                <Share2 size={20} className="text-muted-foreground" />
                <span className="text-sm text-foreground">Share</span>
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
