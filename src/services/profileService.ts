import { supabase } from "../lib/supabase";

import type { Profile } from "../types/profile";

export async function getProfileByUsername(
  username: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username.toLowerCase())
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getProfileById(
  userId: string,
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

interface UpdateProfileInput {
  username: string;
  displayName: string | null;
  bio: string | null;
  avatarUrl?: string | null;
  coverUrl?: string | null;
}

export async function updateProfile(
  userId: string,
  profile: UpdateProfileInput,
): Promise<Profile> {
  const updates: Record<string, unknown> = {
    username:
      profile.username.trim().toLowerCase(),

    display_name:
      profile.displayName?.trim() || null,

    bio:
      profile.bio?.trim() || null,
  };

  if (profile.avatarUrl !== undefined) {
    updates.avatar_url =
      profile.avatarUrl;
  }

  if (profile.coverUrl !== undefined) {
    updates.cover_url =
      profile.coverUrl;
  }

  const { data, error } = await supabase
    .from("profiles")
    .update(updates)
    .eq("id", userId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}