import { supabase } from "../lib/supabase";

import type {
  Episode,
  Media,
  Season,
} from "../types/media";

export async function getMediaCatalog(): Promise<Media[]> {
  const { data, error } =
    await supabase
      .from("media")
      .select("*")
      .order(
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