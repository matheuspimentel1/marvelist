import { supabase } from "../lib/supabase";

import type {
  Episode,
  Media,
  MediaDetails,
  MediaFormat,
  MediaReleaseStatus,
  Season,
  SeasonWithEpisodes,
} from "../types/media";

export interface MediaCatalogFilters {
  search?: string;

  format?: MediaFormat | "all";

  releaseStatus?:
    | MediaReleaseStatus
    | "all";
}

export async function getMediaCatalog(
  filters: MediaCatalogFilters = {},
): Promise<Media[]> {
  let query = supabase
    .from("media")
    .select("*");

  const search =
    filters.search?.trim();

  if (search) {
    query = query.ilike(
      "title",
      `%${search}%`,
    );
  }

  if (
    filters.format &&
    filters.format !== "all"
  ) {
    query = query.eq(
      "format",
      filters.format,
    );
  }

  if (
    filters.releaseStatus &&
    filters.releaseStatus !== "all"
  ) {
    query = query.eq(
      "release_status",
      filters.releaseStatus,
    );
  }

  const { data, error } =
    await query.order(
      "release_date",
      {
        ascending: false,
        nullsFirst: false,
      },
    );

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getMediaBySlug(
  slug: string,
): Promise<Media | null> {
  const { data, error } =
    await supabase
      .from("media")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getSeasonsByMediaId(
  mediaId: string,
): Promise<Season[]> {
  const { data, error } =
    await supabase
      .from("seasons")
      .select("*")
      .eq("media_id", mediaId)
      .order(
        "season_number",
        {
          ascending: true,
        },
      );

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getEpisodesBySeasonId(
  seasonId: string,
): Promise<Episode[]> {
  const { data, error } =
    await supabase
      .from("episodes")
      .select("*")
      .eq("season_id", seasonId)
      .order(
        "episode_number",
        {
          ascending: true,
        },
      );

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getMediaDetailsBySlug(
  slug: string,
): Promise<MediaDetails | null> {
  const media =
    await getMediaBySlug(slug);

  if (!media) {
    return null;
  }

  if (media.format === "movie") {
    return {
      ...media,
      seasons: [],
    };
  }

  const seasons =
    await getSeasonsByMediaId(
      media.id,
    );

  const seasonsWithEpisodes:
    SeasonWithEpisodes[] =
      await Promise.all(
        seasons.map(
          async (season) => {
            const episodes =
              await getEpisodesBySeasonId(
                season.id,
              );

            return {
              ...season,
              episodes,
            };
          },
        ),
      );

  return {
    ...media,
    seasons:
      seasonsWithEpisodes,
  };
}