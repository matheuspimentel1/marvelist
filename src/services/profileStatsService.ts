import { supabase } from "../lib/supabase";

import type {
  ProfileStats,
} from "../types/profileStats";

interface ProfileStatsRow {
  completed_movies: number | string;
  completed_tv_shows: number | string;
  watched_episodes: number | string;
  watched_minutes: number | string;
}

export async function getProfileStats(
  userId: string,
): Promise<ProfileStats> {
  const { data, error } =
    await supabase
      .rpc(
        "get_profile_stats",
        {
          target_user_id: userId,
        },
      )
      .single();

  if (error) {
    throw error;
  }

  const row =
    data as ProfileStatsRow;

  return {
    completedMovies:
      Number(
        row.completed_movies,
      ),

    completedTvShows:
      Number(
        row.completed_tv_shows,
      ),

    watchedEpisodes:
      Number(
        row.watched_episodes,
      ),

    watchedMinutes:
      Number(
        row.watched_minutes,
      ),
  };
}