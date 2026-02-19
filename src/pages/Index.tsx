import { MOCK_SONGS, MOCK_ARTISTS } from "@/lib/mockData";
import SongCard from "@/components/SongCard";
import SongRow from "@/components/SongRow";
import ArtistCard from "@/components/ArtistCard";
import { usePlayer } from "@/contexts/PlayerContext";
import { TrendingUp, Flame, Star } from "lucide-react";

const Index = () => {
  const { play, setQueue } = usePlayer();

  const trending = [...MOCK_SONGS].sort((a, b) => b.plays - a.plays).slice(0, 6);
  const recent = MOCK_SONGS.slice(0, 5);
  const topArtists = [...MOCK_ARTISTS].sort((a, b) => b.totalPlays - a.totalPlays);

  return (
    <div className="py-6 space-y-8 animate-fade-in">
      {/* Greeting */}
      <section>
        <h2 className="text-2xl font-bold text-foreground">Good evening</h2>
        <p className="text-sm text-muted-foreground mt-1">Discover new music and enjoy your favorites</p>
      </section>

      {/* Top Artists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Star size={18} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Top Artists</h3>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
          {topArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* Trending */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={18} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Trending Now</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
          {trending.map((song) => (
            <SongCard key={song.id} song={song} />
          ))}
        </div>
      </section>

      {/* Recently added list */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Flame size={18} className="text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Recently Added</h3>
        </div>
        <div className="glass rounded-xl p-2 space-y-0.5">
          {recent.map((song, i) => (
            <SongRow key={song.id} song={song} index={i} showIndex />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
