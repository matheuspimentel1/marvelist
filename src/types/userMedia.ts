import type { Media } from "./media";

export type UserMediaStatus =
  | "plan_to_watch"
  | "watching"
  | "completed";

export interface UserMediaEntry {
  user_id: string;
  media_id: string;

  status: UserMediaStatus;

  started_at: string | null;
  completed_at: string | null;

  created_at: string;
  updated_at: string;
}

export interface UserMediaWithMedia
  extends UserMediaEntry {
  media: Media;
}