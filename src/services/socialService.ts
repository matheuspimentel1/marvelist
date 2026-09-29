import { supabase } from "../lib/supabase";

import type {
  FollowCounts,
} from "../types/social";

export async function isFollowingUser(
  followerId: string,
  followingId: string,
): Promise<boolean> {
  const { data, error } =
    await supabase
      .from("follows")
      .select("following_id")
      .eq(
        "follower_id",
        followerId,
      )
      .eq(
        "following_id",
        followingId,
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}

export async function followUser(
  followerId: string,
  followingId: string,
) {
  if (
    followerId === followingId
  ) {
    throw new Error(
      "You cannot follow yourself.",
    );
  }

  const { error } =
    await supabase
      .from("follows")
      .insert({
        follower_id:
          followerId,

        following_id:
          followingId,
      });

  if (error) {
    throw error;
  }
}

export async function unfollowUser(
  followerId: string,
  followingId: string,
) {
  const { error } =
    await supabase
      .from("follows")
      .delete()
      .eq(
        "follower_id",
        followerId,
      )
      .eq(
        "following_id",
        followingId,
      );

  if (error) {
    throw error;
  }
}

export async function getFollowCounts(
  userId: string,
): Promise<FollowCounts> {
  const [
    followersResult,
    followingResult,
  ] = await Promise.all([
    supabase
      .from("follows")
      .select(
        "follower_id",
        {
          count: "exact",
          head: true,
        },
      )
      .eq(
        "following_id",
        userId,
      ),

    supabase
      .from("follows")
      .select(
        "following_id",
        {
          count: "exact",
          head: true,
        },
      )
      .eq(
        "follower_id",
        userId,
      ),
  ]);

  if (followersResult.error) {
    throw followersResult.error;
  }

  if (followingResult.error) {
    throw followingResult.error;
  }

  return {
    followers:
      followersResult.count ?? 0,

    following:
      followingResult.count ?? 0,
  };
}

export async function getFollowingUserIds(
  userId: string,
): Promise<string[]> {
  const { data, error } =
    await supabase
      .from("follows")
      .select("following_id")
      .eq(
        "follower_id",
        userId,
      );

  if (error) {
    throw error;
  }

  return (
    data?.map(
      (follow) =>
        follow.following_id,
    ) ?? []
  );
}