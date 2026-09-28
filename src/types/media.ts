export type MediaFormat =
  | "movie"
  | "tv";

export type MediaReleaseStatus =
  | "released"
  | "releasing"
  | "not_yet_released";

export interface Media {
  id: string;
  tmdb_id: number | null;

  slug: string;

  title: string;
  original_title: string | null;

  description: string | null;

  format: MediaFormat;

  release_status:
    MediaReleaseStatus;

  release_date: string | null;
  end_date: string | null;

  poster_url: string | null;
  banner_url: string | null;

  runtime_minutes: number | null;

  created_at: string;
  updated_at: string;
}

export interface Season {
  id: string;

  media_id: string;

  season_number: number;

  title: string | null;
  description: string | null;

  poster_url: string | null;
  release_date: string | null;

  created_at: string;
  updated_at: string;
}

export interface Episode {
  id: string;

  season_id: string;

  episode_number: number;

  title: string;
  description: string | null;

  runtime_minutes: number | null;

  release_date: string | null;

  still_url: string | null;

  created_at: string;
  updated_at: string;
}