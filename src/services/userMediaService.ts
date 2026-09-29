import { supabase } from "../lib/supabase";

import type { Media } from "../types/media";

import type {
  UserMediaEntry,
  UserMediaStatus,
  UserMediaWithMedia,
} from "../types/userMedia";

export async function getUserMediaEntry(
  userId: string,
  mediaId: string,
): Promise<UserMediaEntry | null> {
  const { data, error } =
    await supabase
      .from("user_media")
      .select("*")
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function setUserMediaStatus(
  userId: string,
  mediaId: string,
  status: UserMediaStatus,
): Promise<UserMediaEntry> {
  const existing =
    await getUserMediaEntry(
      userId,
      mediaId,
    );

  const now =
    new Date().toISOString();

  let startedAt =
    existing?.started_at ?? null;

  let completedAt =
    existing?.completed_at ?? null;

  if (status === "plan_to_watch") {
    startedAt = null;
    completedAt = null;
  }

  if (status === "watching") {
    startedAt =
      startedAt ?? now;

    completedAt = null;
  }

  if (status === "completed") {
    startedAt =
      startedAt ?? now;

    completedAt =
      existing?.status ===
        "completed"
        ? existing.completed_at ??
          now
        : now;
  }

  const { data, error } =
    await supabase
      .from("user_media")
      .upsert(
        {
          user_id: userId,
          media_id: mediaId,
          status,

          started_at: startedAt,
          completed_at: completedAt,
        },
        {
          onConflict:
            "user_id,media_id",
        },
      )
      .select("*")
      .single();

  if (error) {
    throw error;
  }

  return data;
}

export async function removeUserMedia(
  userId: string,
  mediaId: string,
) {
  const { error } =
    await supabase
      .from("user_media")
      .delete()
      .eq("user_id", userId)
      .eq("media_id", mediaId);

  if (error) {
    throw error;
  }
}

export async function getUserMediaList(
  userId: string,
): Promise<UserMediaWithMedia[]> {
  const {
    data: userMediaData,
    error: userMediaError,
  } = await supabase
    .from("user_media")
    .select("*")
    .eq("user_id", userId)
    .order(
      "updated_at",
      {
        ascending: false,
      },
    );

  if (userMediaError) {
    throw userMediaError;
  }

  const entries =
    (userMediaData ??
      []) as UserMediaEntry[];

  if (entries.length === 0) {
    return [];
  }

  const mediaIds = [
    ...new Set(
      entries.map(
        (entry) =>
          entry.media_id,
      ),
    ),
  ];

  const {
    data: mediaData,
    error: mediaError,
  } = await supabase
    .from("media")
    .select("*")
    .in("id", mediaIds);

  if (mediaError) {
    throw mediaError;
  }

  const media =
    (mediaData ?? []) as Media[];

  const mediaMap =
    new Map(
      media.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  return entries.flatMap(
    (entry) => {
      const mediaItem =
        mediaMap.get(
          entry.media_id,
        );

      if (!mediaItem) {
        return [];
      }

      return [
        {
          ...entry,
          media: mediaItem,
        },
      ];
    },
  );
}