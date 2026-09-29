import { supabase } from "../lib/supabase";

import {
  getFollowingUserIds,
} from "./socialService";

import type {
  Activity,
  ActivityFeedItem,
} from "../types/activity";

import type {
  Media,
} from "../types/media";

import type {
  Profile,
} from "../types/profile";

async function hydrateActivities(
  activities: Activity[],
): Promise<ActivityFeedItem[]> {
  if (activities.length === 0) {
    return [];
  }

  const userIds = [
    ...new Set(
      activities.map(
        (activity) =>
          activity.user_id,
      ),
    ),
  ];

  const mediaIds = [
    ...new Set(
      activities.map(
        (activity) =>
          activity.media_id,
      ),
    ),
  ];

  const [
    profilesResult,
    mediaResult,
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .in("id", userIds),

    supabase
      .from("media")
      .select("*")
      .in("id", mediaIds),
  ]);

  if (profilesResult.error) {
    throw profilesResult.error;
  }

  if (mediaResult.error) {
    throw mediaResult.error;
  }

  const profiles =
    (profilesResult.data ??
      []) as Profile[];

  const media =
    (mediaResult.data ??
      []) as Media[];

  const profileMap =
    new Map(
      profiles.map(
        (profile) => [
          profile.id,
          profile,
        ],
      ),
    );

  const mediaMap =
    new Map(
      media.map(
        (item) => [
          item.id,
          item,
        ],
      ),
    );

  return activities.flatMap(
    (activity) => {
      const profile =
        profileMap.get(
          activity.user_id,
        );

      const mediaItem =
        mediaMap.get(
          activity.media_id,
        );

      if (
        !profile ||
        !mediaItem
      ) {
        return [];
      }

      return [
        {
          ...activity,
          profile,
          media: mediaItem,
        },
      ];
    },
  );
}

export async function getGlobalActivities(
  limit = 25,
): Promise<ActivityFeedItem[]> {
  const { data, error } =
    await supabase
      .from("activities")
      .select("*")
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(limit);

  if (error) {
    throw error;
  }

  return hydrateActivities(
    (data ?? []) as Activity[],
  );
}

export async function getFollowingActivities(
  userId: string,
  limit = 25,
): Promise<ActivityFeedItem[]> {
  const followingIds =
    await getFollowingUserIds(
      userId,
    );

  if (
    followingIds.length === 0
  ) {
    return [];
  }

  const { data, error } =
    await supabase
      .from("activities")
      .select("*")
      .in(
        "user_id",
        followingIds,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(limit);

  if (error) {
    throw error;
  }

  return hydrateActivities(
    (data ?? []) as Activity[],
  );
}

export async function getUserActivities(
  userId: string,
  limit = 10,
): Promise<ActivityFeedItem[]> {
  const { data, error } =
    await supabase
      .from("activities")
      .select("*")
      .eq(
        "user_id",
        userId,
      )
      .order(
        "created_at",
        {
          ascending: false,
        },
      )
      .limit(limit);

  if (error) {
    throw error;
  }

  return hydrateActivities(
    (data ?? []) as Activity[],
  );
}