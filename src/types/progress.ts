export interface EpisodeProgress {
  user_id: string;
  episode_id: string;

  watched_at: string;
  created_at: string;
}

export interface SeriesProgress {
  watchedEpisodes: number;
  totalEpisodes: number;
  percentage: number;
}