import { supabase } from "../lib/supabase";

import {
  setUserMediaStatus,
} from "./userMediaService";

import type {
  SeriesProgress,
} from "../types/progress";

async function getEpisodeIdsForMedia(
  mediaId: string,
): Promise<string[]> {
  const {
    data: seasons,
    error: seasonsError,
  } = await supabase
    .from("seasons")
    .select("id")
    .eq("media_id", mediaId);

  if (seasonsError) {
    throw seasonsError;
  }

  if (
    !seasons ||
    seasons.length === 0
  ) {
    return [];
  }

  const seasonIds =
    seasons.map(
      (season) => season.id,
    );

  const {
    data: episodes,
    error: episodesError,
  } = await supabase
    .from("episodes")
    .select("id")
    .in("season_id", seasonIds);

  if (episodesError) {
    throw episodesError;
  }

  return (
    episodes?.map(
      (episode) => episode.id,
    ) ?? []
  );
}

export async function getWatchedEpisodeIds(
  userId: string,
  episodeIds: string[],
): Promise<Set<string>> {
  if (episodeIds.length === 0) {
    return new Set();
  }

  const { data, error } =
    await supabase
      .from(
        "user_episode_progress",
      )
      .select("episode_id")
      .eq("user_id", userId)
      .in(
        "episode_id",
        episodeIds,
      );

  if (error) {
    throw error;
  }

  return new Set(
    data?.map(
      (item) =>
        item.episode_id,
    ) ?? [],
  );
}

export async function getSeriesProgress(
  userId: string,
  mediaId: string,
): Promise<SeriesProgress> {
  const episodeIds =
    await getEpisodeIdsForMedia(
      mediaId,
    );

  if (episodeIds.length === 0) {
    return {
      watchedEpisodes: 0,
      totalEpisodes: 0,
      percentage: 0,
    };
  }

  const watchedIds =
    await getWatchedEpisodeIds(
      userId,
      episodeIds,
    );

  const watchedEpisodes =
    watchedIds.size;

  const totalEpisodes =
    episodeIds.length;

  const percentage =
    Math.round(
      (
        watchedEpisodes /
        totalEpisodes
      ) * 100,
    );

  return {
    watchedEpisodes,
    totalEpisodes,
    percentage,
  };
}

async function syncSeriesStatus(
  userId: string,
  mediaId: string,
) {
  const progress =
    await getSeriesProgress(
      userId,
      mediaId,
    );

  if (
    progress.totalEpisodes === 0
  ) {
    return;
  }

  if (
    progress.watchedEpisodes ===
    progress.totalEpisodes
  ) {
    await setUserMediaStatus(
      userId,
      mediaId,
      "completed",
    );

    return;
  }

  await setUserMediaStatus(
    userId,
    mediaId,
    "watching",
  );
}

export async function markEpisodeWatched(
  userId: string,
  mediaId: string,
  episodeId: string,
) {
  const { error } =
    await supabase
      .from(
        "user_episode_progress",
      )
      .insert({
        user_id: userId,
        episode_id: episodeId,
      });

  if (
    error &&
    error.code !== "23505"
  ) {
    throw error;
  }

  await syncSeriesStatus(
    userId,
    mediaId,
  );
}

export async function unmarkEpisodeWatched(
  userId: string,
  mediaId: string,
  episodeId: string,
) {
  const { error } =
    await supabase
      .from(
        "user_episode_progress",
      )
      .delete()
      .eq("user_id", userId)
      .eq(
        "episode_id",
        episodeId,
      );

  if (error) {
    throw error;
  }

  await syncSeriesStatus(
    userId,
    mediaId,
  );
}