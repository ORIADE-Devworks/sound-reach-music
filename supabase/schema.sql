-- ============================================================
-- SoundReach Music — Full Supabase Schema
-- ============================================================
-- Run this in Supabase SQL Editor to set up the entire backend.
-- Make sure to enable the required extensions first.

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- 1. PROFILES
-- ============================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'artist', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Anyone can read profiles
CREATE POLICY "profiles_select" ON public.profiles
  FOR SELECT USING (true);

-- Users can update only their own profile
CREATE POLICY "profiles_update" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can insert their own profile (on signup)
CREATE POLICY "profiles_insert" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. SONGS
-- ============================================================
CREATE TABLE public.songs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uploader_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  isrc TEXT UNIQUE,
  genre TEXT NOT NULL,
  description TEXT,
  lyrics TEXT,
  cover_url TEXT,          -- Signed R2 URL (stored as key path)
  audio_url TEXT,          -- Signed R2 URL (stored as key path)
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  explicit BOOLEAN NOT NULL DEFAULT false,
  release_date DATE,
  play_count BIGINT NOT NULL DEFAULT 0,
  duration_seconds INTEGER,
  file_size_bytes BIGINT,
  audio_format TEXT,       -- mp3, wav, flac, aac
  rejection_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  approved_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.songs ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved songs
CREATE POLICY "songs_select_approved" ON public.songs
  FOR SELECT USING (status = 'approved');

-- Artists can read their own uploads (any status)
CREATE POLICY "songs_select_own" ON public.songs
  FOR SELECT USING (auth.uid() = uploader_id);

-- Artists can insert their own songs
CREATE POLICY "songs_insert" ON public.songs
  FOR INSERT WITH CHECK (auth.uid() = uploader_id);

-- Artists can update their own pending songs
CREATE POLICY "songs_update_own" ON public.songs
  FOR UPDATE USING (auth.uid() = uploader_id AND status = 'pending')
  WITH CHECK (auth.uid() = uploader_id);

-- Admins can update any song (approve/reject)
CREATE POLICY "songs_admin_update" ON public.songs
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Admins can delete any song
CREATE POLICY "songs_admin_delete" ON public.songs
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Artists can delete their own pending songs
CREATE POLICY "songs_delete_own" ON public.songs
  FOR DELETE USING (auth.uid() = uploader_id AND status = 'pending');

-- ============================================================
-- 3. FAVORITES / LIKES
-- ============================================================
CREATE TABLE public.favorites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, song_id)
);

ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;

CREATE POLICY "favorites_select" ON public.favorites
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "favorites_insert" ON public.favorites
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "favorites_delete" ON public.favorites
  FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- 4. PLAY HISTORY (for tracking plays securely)
-- ============================================================
CREATE TABLE public.play_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  played_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.play_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "play_history_insert" ON public.play_history
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "play_history_select_own" ON public.play_history
  FOR SELECT USING (auth.uid() = user_id);

-- ============================================================
-- 5. REPORTS (flagged content)
-- ============================================================
CREATE TABLE public.reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  details TEXT,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'reviewed', 'dismissed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;

CREATE POLICY "reports_insert" ON public.reports
  FOR INSERT WITH CHECK (auth.uid() = reporter_id);

CREATE POLICY "reports_admin_select" ON public.reports
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 6. AUDIT LOGS
-- ============================================================
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,        -- 'approve_song', 'reject_song', 'delete_song', 'ban_user', etc.
  target_type TEXT,            -- 'song', 'user', 'report'
  target_id UUID,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "audit_logs_admin_select" ON public.audit_logs
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "audit_logs_admin_insert" ON public.audit_logs
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================================
-- 7. TRIGGERS
-- ============================================================

-- Set approved_at when song status changes to 'approved'
CREATE OR REPLACE FUNCTION public.on_song_status_change()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND (OLD.status IS DISTINCT FROM 'approved') THEN
    NEW.approved_at = now();
  END IF;
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER song_status_change
  BEFORE UPDATE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION public.on_song_status_change();

-- Log admin actions on songs
CREATE OR REPLACE FUNCTION public.log_song_admin_action()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (auth.uid(), 'delete_song', 'song', OLD.id, jsonb_build_object('title', OLD.title));
    RETURN OLD;
  END IF;

  IF OLD.status IS DISTINCT FROM NEW.status THEN
    INSERT INTO public.audit_logs (actor_id, action, target_type, target_id, metadata)
    VALUES (
      auth.uid(),
      CASE WHEN NEW.status = 'approved' THEN 'approve_song'
           WHEN NEW.status = 'rejected' THEN 'reject_song'
           ELSE 'update_song' END,
      'song',
      NEW.id,
      jsonb_build_object('title', NEW.title, 'old_status', OLD.status, 'new_status', NEW.status)
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER song_admin_audit
  AFTER UPDATE OR DELETE ON public.songs
  FOR EACH ROW EXECUTE FUNCTION public.log_song_admin_action();

-- ============================================================
-- 8. RPC: Increment play count (prevents client-side manipulation)
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_play_count(song_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE public.songs
  SET play_count = play_count + 1
  WHERE id = song_id AND status = 'approved';

  INSERT INTO public.play_history (user_id, song_id)
  VALUES (auth.uid(), song_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 9. INDEXES
-- ============================================================
CREATE INDEX idx_songs_status ON public.songs(status);
CREATE INDEX idx_songs_genre ON public.songs(genre);
CREATE INDEX idx_songs_uploader ON public.songs(uploader_id);
CREATE INDEX idx_songs_play_count ON public.songs(play_count DESC);
CREATE INDEX idx_songs_created_at ON public.songs(created_at DESC);
CREATE INDEX idx_favorites_user ON public.favorites(user_id);
CREATE INDEX idx_play_history_song ON public.play_history(song_id);
CREATE INDEX idx_audit_logs_created ON public.audit_logs(created_at DESC);

-- ============================================================
-- 10. DOWNLOADS TRACKING
-- ============================================================
CREATE TABLE public.downloads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  downloaded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "downloads_insert" ON public.downloads
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "downloads_select_own" ON public.downloads
  FOR SELECT USING (auth.uid() = user_id);

CREATE INDEX idx_downloads_song ON public.downloads(song_id);
CREATE INDEX idx_downloads_user ON public.downloads(user_id);

-- ============================================================
-- 11. SHARE TRACKING
-- ============================================================
CREATE TABLE public.shares (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  song_id UUID NOT NULL REFERENCES public.songs(id) ON DELETE CASCADE,
  platform TEXT,  -- 'copy', 'native_share', etc.
  shared_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.shares ENABLE ROW LEVEL SECURITY;

CREATE POLICY "shares_insert" ON public.shares
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE INDEX idx_shares_song ON public.shares(song_id);

-- ============================================================
-- 12. RPC: Generate signed download URL (placeholder — use Edge Function)
-- ============================================================
-- In production, implement as a Supabase Edge Function that:
-- 1. Verifies the song exists and is approved
-- 2. Checks if downloads are allowed
-- 3. Generates a signed R2 URL with 5-min expiry
-- 4. Logs the download in the downloads table
-- 5. Returns the signed URL to the client

-- ============================================================
-- 13. THEME PREFERENCE (stored in profiles)
-- ============================================================
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'dark' CHECK (theme_preference IN ('dark', 'light'));

-- ============================================================
-- 14. ALLOW DOWNLOADS FLAG ON SONGS
-- ============================================================
ALTER TABLE public.songs ADD COLUMN IF NOT EXISTS allow_downloads BOOLEAN NOT NULL DEFAULT false;
