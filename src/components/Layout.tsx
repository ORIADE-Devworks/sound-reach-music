import { ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Home, Compass, Upload, Music2, Sun, Moon } from "lucide-react";
import MiniPlayer from "./MiniPlayer";
import FullPlayer from "./FullPlayer";
import { usePlayer } from "@/contexts/PlayerContext";
import { useTheme } from "@/contexts/ThemeContext";

const NAV_ITEMS = [
  { path: "/", icon: Home, label: "Home" },
  { path: "/explore", icon: Compass, label: "Explore" },
  { path: "/upload", icon: Upload, label: "Upload" },
];

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentSong } = usePlayer();
  const { theme, toggleTheme } = useTheme();

  // Bottom nav height ~56px, mini player ~60px
  const bottomPadding = currentSong ? "pb-[136px]" : "pb-[72px]";

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/30">
        <div className="max-w-screen-xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Music2 size={24} className="text-primary" />
            <h1 className="text-lg font-bold text-foreground">SoundReach</h1>
          </div>
          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors
                    ${isActive ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"}`}
                >
                  <item.icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main */}
      <main className={`max-w-screen-xl mx-auto px-4 ${bottomPadding}`}>
        {children}
      </main>

      {/* Mini Player — sits above bottom nav */}
      <MiniPlayer />

      {/* Bottom Nav — always at the very bottom */}
      <div className="fixed bottom-0 left-0 right-0 z-40 glass border-t border-border/30">
        <div className="flex items-center justify-around py-2 max-w-screen-xl mx-auto">
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-0.5 p-2 rounded-lg transition-colors
                  ${isActive ? "text-primary" : "text-muted-foreground"}`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <FullPlayer />
    </div>
  );
}
