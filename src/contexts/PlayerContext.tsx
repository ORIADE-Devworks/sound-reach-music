import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { Song, MOCK_SONGS } from "@/lib/mockData";

interface PlayerState {
  currentSong: Song | null;
  isPlaying: boolean;
  queue: Song[];
  currentTime: number;
  isFullPlayer: boolean;
}

interface PlayerContextType extends PlayerState {
  play: (song: Song) => void;
  pause: () => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  setQueue: (songs: Song[]) => void;
  seek: (time: number) => void;
  openFullPlayer: () => void;
  closeFullPlayer: () => void;
}

const PlayerContext = createContext<PlayerContextType | null>(null);

export function PlayerProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<PlayerState>({
    currentSong: null,
    isPlaying: false,
    queue: MOCK_SONGS,
    currentTime: 0,
    isFullPlayer: false,
  });

  const play = useCallback((song: Song) => {
    setState((prev) => ({ ...prev, currentSong: song, isPlaying: true, currentTime: 0 }));
  }, []);

  const pause = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: false }));
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }));
  }, []);

  const next = useCallback(() => {
    setState((prev) => {
      if (!prev.currentSong) return prev;
      const idx = prev.queue.findIndex((s) => s.id === prev.currentSong!.id);
      const nextSong = prev.queue[(idx + 1) % prev.queue.length];
      return { ...prev, currentSong: nextSong, currentTime: 0, isPlaying: true };
    });
  }, []);

  const previous = useCallback(() => {
    setState((prev) => {
      if (!prev.currentSong) return prev;
      const idx = prev.queue.findIndex((s) => s.id === prev.currentSong!.id);
      const prevSong = prev.queue[(idx - 1 + prev.queue.length) % prev.queue.length];
      return { ...prev, currentSong: prevSong, currentTime: 0, isPlaying: true };
    });
  }, []);

  const setQueue = useCallback((songs: Song[]) => {
    setState((prev) => ({ ...prev, queue: songs }));
  }, []);

  const seek = useCallback((time: number) => {
    setState((prev) => ({ ...prev, currentTime: time }));
  }, []);

  const openFullPlayer = useCallback(() => {
    setState((prev) => ({ ...prev, isFullPlayer: true }));
  }, []);

  const closeFullPlayer = useCallback(() => {
    setState((prev) => ({ ...prev, isFullPlayer: false }));
  }, []);

  return (
    <PlayerContext.Provider
      value={{ ...state, play, pause, toggle, next, previous, setQueue, seek, openFullPlayer, closeFullPlayer }}
    >
      {children}
    </PlayerContext.Provider>
  );
}

export function usePlayer() {
  const ctx = useContext(PlayerContext);
  if (!ctx) throw new Error("usePlayer must be used within PlayerProvider");
  return ctx;
}
