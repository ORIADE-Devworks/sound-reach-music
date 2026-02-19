export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: string;
  coverUrl: string;
  duration: number;
  plays: number;
  explicit: boolean;
  lyrics?: string;
  description?: string;
  releaseDate: string;
  isrc?: string;
  audioFormat?: string;
  uploadedBy?: string;
}

export interface Artist {
  id: string;
  name: string;
  avatarUrl: string;
  genre: string;
  songCount: number;
  totalPlays: number;
}

export const MOCK_SONGS: Song[] = [
  {
    id: "1",
    title: "Midnight Groove",
    artist: "Luna Wave",
    genre: "Afrobeats",
    coverUrl: "",
    duration: 234,
    plays: 12400,
    explicit: false,
    releaseDate: "2026-01-15",
    isrc: "USRC11234567",
    audioFormat: "MP3",
    uploadedBy: "Luna Wave",
    lyrics: "Feel the rhythm in the night\nLet the music take you high\nEvery beat a new delight\nDancing underneath the sky\n\nMidnight groove, midnight groove\nNothing left for us to prove\nJust the sound and you and me\nLost in this melody",
    description: "A smooth Afrobeats track perfect for late-night vibes.",
  },
  {
    id: "2",
    title: "Sunrise Dreams",
    artist: "Kofi Beats",
    genre: "Afropop",
    coverUrl: "",
    duration: 198,
    plays: 8900,
    explicit: false,
    releaseDate: "2026-01-20",
    isrc: "USRC11234568",
    audioFormat: "WAV",
    uploadedBy: "Kofi Beats",
    lyrics: "Wake up to the morning light\nEverything is gonna be alright\nSunrise dreams on my mind\nLeaving yesterday behind",
  },
  {
    id: "3",
    title: "City Lights",
    artist: "Amara Gold",
    genre: "R&B",
    coverUrl: "",
    duration: 267,
    plays: 23100,
    explicit: false,
    releaseDate: "2025-12-01",
    isrc: "USRC11234569",
    audioFormat: "FLAC",
    uploadedBy: "Amara Gold",
    lyrics: "City lights are shining bright\nWalking through the urban night\nEvery corner, every street\nMakes my heart skip a beat",
    description: "An R&B anthem for the city dwellers.",
  },
  {
    id: "4",
    title: "Thunder Road",
    artist: "Storm Collective",
    genre: "Hip Hop",
    coverUrl: "",
    duration: 210,
    plays: 45600,
    explicit: true,
    releaseDate: "2026-02-01",
    isrc: "USRC11234570",
    audioFormat: "MP3",
    uploadedBy: "Storm Collective",
    description: "Hard-hitting Hip Hop with raw energy and powerful bars.",
  },
  {
    id: "5",
    title: "Ocean Breeze",
    artist: "Tidal Sound",
    genre: "Chill",
    coverUrl: "",
    duration: 312,
    plays: 6700,
    explicit: false,
    releaseDate: "2025-11-10",
    isrc: "USRC11234571",
    audioFormat: "MP3",
    uploadedBy: "Tidal Sound",
    lyrics: "Waves are crashing on the shore\nPeaceful like never before\nOcean breeze upon my face\nFound my happy place",
  },
  {
    id: "6",
    title: "Neon Pulse",
    artist: "Electra",
    genre: "Electronic",
    coverUrl: "",
    duration: 245,
    plays: 31200,
    explicit: false,
    releaseDate: "2026-01-05",
    isrc: "USRC11234572",
    audioFormat: "WAV",
    uploadedBy: "Electra",
    description: "Pulsating electronic beats that light up the dance floor.",
  },
  {
    id: "7",
    title: "Golden Hour",
    artist: "Amara Gold",
    genre: "Afropop",
    coverUrl: "",
    duration: 189,
    plays: 18400,
    explicit: false,
    releaseDate: "2025-12-20",
    isrc: "USRC11234573",
    audioFormat: "MP3",
    uploadedBy: "Amara Gold",
    lyrics: "In the golden hour we shine\nEvery moment feels divine\nHold my hand and close your eyes\nWatch the colors fill the skies",
  },
  {
    id: "8",
    title: "Velvet Night",
    artist: "Luna Wave",
    genre: "R&B",
    coverUrl: "",
    duration: 276,
    plays: 9800,
    explicit: false,
    releaseDate: "2026-02-10",
    isrc: "USRC11234574",
    audioFormat: "FLAC",
    uploadedBy: "Luna Wave",
  },
  {
    id: "9",
    title: "Fire Dance",
    artist: "Kofi Beats",
    genre: "Afrobeats",
    coverUrl: "",
    duration: 223,
    plays: 54300,
    explicit: false,
    releaseDate: "2025-10-15",
    isrc: "USRC11234575",
    audioFormat: "MP3",
    uploadedBy: "Kofi Beats",
  },
  {
    id: "10",
    title: "Starfall",
    artist: "Tidal Sound",
    genre: "Chill",
    coverUrl: "",
    duration: 298,
    plays: 7200,
    explicit: false,
    releaseDate: "2026-01-28",
    isrc: "USRC11234576",
    audioFormat: "WAV",
    uploadedBy: "Tidal Sound",
    lyrics: "Stars are falling from the sky\nMake a wish as they go by\nEvery light a story told\nMore precious than gold",
  },
];

export const MOCK_ARTISTS: Artist[] = [
  { id: "a1", name: "Luna Wave", avatarUrl: "", genre: "Afrobeats / R&B", songCount: 2, totalPlays: 22200 },
  { id: "a2", name: "Kofi Beats", avatarUrl: "", genre: "Afrobeats / Afropop", songCount: 2, totalPlays: 63200 },
  { id: "a3", name: "Amara Gold", avatarUrl: "", genre: "R&B / Afropop", songCount: 2, totalPlays: 41500 },
  { id: "a4", name: "Storm Collective", avatarUrl: "", genre: "Hip Hop", songCount: 1, totalPlays: 45600 },
  { id: "a5", name: "Tidal Sound", avatarUrl: "", genre: "Chill", songCount: 2, totalPlays: 13900 },
  { id: "a6", name: "Electra", avatarUrl: "", genre: "Electronic", songCount: 1, totalPlays: 31200 },
];

export const GENRES = [
  "All",
  "Afrobeats",
  "Afropop",
  "R&B",
  "Hip Hop",
  "Electronic",
  "Chill",
  "Gospel",
  "Pop",
  "Jazz",
];

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export function formatPlays(plays: number): string {
  if (plays >= 1000000) return `${(plays / 1000000).toFixed(1)}M`;
  if (plays >= 1000) return `${(plays / 1000).toFixed(1)}K`;
  return plays.toString();
}
