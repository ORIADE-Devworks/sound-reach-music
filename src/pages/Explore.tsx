import { useState } from "react";
import { MOCK_SONGS, GENRES } from "@/lib/mockData";
import SongCard from "@/components/SongCard";
import SongRow from "@/components/SongRow";
import { Search } from "lucide-react";

export default function Explore() {
  const [query, setQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState("All");

  const filtered = MOCK_SONGS.filter((song) => {
    const matchesQuery =
      !query ||
      song.title.toLowerCase().includes(query.toLowerCase()) ||
      song.artist.toLowerCase().includes(query.toLowerCase());
    const matchesGenre = activeGenre === "All" || song.genre === activeGenre;
    return matchesQuery && matchesGenre;
  });

  return (
    <div className="py-6 space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold text-foreground">Explore</h2>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search songs, artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
        />
      </div>

      {/* Genre chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
        {GENRES.map((genre) => (
          <button
            key={genre}
            onClick={() => setActiveGenre(genre)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${activeGenre === genre
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
          >
            {genre}
          </button>
        ))}
      </div>

      {/* Results */}
      {query ? (
        <div className="glass rounded-xl p-2 space-y-0.5">
          {filtered.length === 0 && (
            <p className="text-center text-muted-foreground py-8 text-sm">No songs found</p>
          )}
          {filtered.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} showIndex />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
          {filtered.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      )}
    </div>
  );
}
