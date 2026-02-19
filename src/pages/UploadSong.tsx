import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, Music, Image } from "lucide-react";
import { GENRES } from "@/lib/mockData";
import { toast } from "sonner";

const AUDIO_FORMATS = ["MP3", "WAV", "FLAC", "AAC"];

export default function UploadSong() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    artistName: "",
    isrc: "",
    genre: "",
    description: "",
    lyrics: "",
    releaseDate: "",
    explicit: false,
    audioFormat: "",
    ownsRights: false,
  });

  const update = (field: string, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.title.trim() || !form.artistName.trim() || !form.genre) {
      toast.error("Please fill in all required fields.");
      return;
    }
    if (!form.ownsRights) {
      toast.error("You must confirm you own the rights to this content.");
      return;
    }

    // In production this would upload to R2 + insert into Supabase
    toast.success("Song submitted for review! It will be visible once approved by an admin.");
    navigate("/");
  };

  const genreOptions = GENRES.filter((g) => g !== "All");

  return (
    <div className="py-6 animate-fade-in max-w-2xl mx-auto">
      <button onClick={() => navigate(-1)} className="p-2 text-muted-foreground hover:text-foreground transition-colors mb-4">
        <ArrowLeft size={24} />
      </button>

      <h1 className="text-2xl font-bold text-foreground mb-1">Upload a Song</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Submit your track for review. Once approved by an admin, it will be publicly available on SoundReach.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Audio file */}
        <div className="glass rounded-xl p-6">
          <label className="flex flex-col items-center justify-center gap-3 cursor-pointer py-8 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors">
            <Music size={32} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload audio file</span>
            <span className="text-xs text-muted-foreground/60">MP3, WAV, FLAC, AAC — Max 50MB</span>
            <input type="file" accept="audio/*" className="hidden" />
          </label>
        </div>

        {/* Cover art */}
        <div className="glass rounded-xl p-6">
          <label className="flex flex-col items-center justify-center gap-3 cursor-pointer py-6 border-2 border-dashed border-border rounded-xl hover:border-primary/50 transition-colors">
            <Image size={32} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Click to upload cover art</span>
            <span className="text-xs text-muted-foreground/60">JPEG, PNG — Max 5MB</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" />
          </label>
        </div>

        {/* Song info */}
        <div className="glass rounded-xl p-6 space-y-4">
          <h3 className="text-sm font-semibold text-foreground">Song Information</h3>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              placeholder="Enter song title"
              className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={200}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Artist Name *</label>
            <input
              type="text"
              value={form.artistName}
              onChange={(e) => update("artistName", e.target.value)}
              placeholder="Enter artist or band name"
              className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              maxLength={200}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">ISRC</label>
              <input
                type="text"
                value={form.isrc}
                onChange={(e) => update("isrc", e.target.value)}
                placeholder="e.g. USRC11234567"
                className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                maxLength={20}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Genre *</label>
              <select
                value={form.genre}
                onChange={(e) => update("genre", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
              >
                <option value="">Select genre</option>
                {genreOptions.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Release Date</label>
              <input
                type="date"
                value={form.releaseDate}
                onChange={(e) => update("releaseDate", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground">Audio Format</label>
              <select
                value={form.audioFormat}
                onChange={(e) => update("audioFormat", e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none"
              >
                <option value="">Select format</option>
                {AUDIO_FORMATS.map((f) => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Describe your song..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              maxLength={1000}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground">Lyrics</label>
            <textarea
              value={form.lyrics}
              onChange={(e) => update("lyrics", e.target.value)}
              placeholder="Paste your lyrics here..."
              rows={6}
              className="w-full px-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              maxLength={5000}
            />
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.explicit}
              onChange={(e) => update("explicit", e.target.checked)}
              className="w-4 h-4 rounded border-border bg-secondary accent-primary"
            />
            <span className="text-sm text-foreground">Contains explicit content</span>
          </label>
        </div>

        {/* Rights confirmation */}
        <div className="glass rounded-xl p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={form.ownsRights}
              onChange={(e) => update("ownsRights", e.target.checked)}
              className="w-4 h-4 rounded border-border bg-secondary accent-primary mt-0.5"
            />
            <span className="text-sm text-muted-foreground">
              I confirm that I own the rights to this content or have proper authorization to distribute it.
              I understand that uploading copyrighted material without permission is prohibited. *
            </span>
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-colors glow-primary"
        >
          <Upload size={18} />
          Submit for Review
        </button>
      </form>
    </div>
  );
}
