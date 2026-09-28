import { supabase } from "../lib/supabase";

type ProfileImageType =
  | "avatar"
  | "cover";

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

const AVATAR_MAX_SIZE =
  2 * 1024 * 1024;

const COVER_MAX_SIZE =
  5 * 1024 * 1024;

export async function uploadProfileImage(
  userId: string,
  file: File,
  type: ProfileImageType,
) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(
      "Only JPG, PNG and WebP images are allowed.",
    );
  }

  const maxSize =
    type === "avatar"
      ? AVATAR_MAX_SIZE
      : COVER_MAX_SIZE;

  if (file.size > maxSize) {
    throw new Error(
      type === "avatar"
        ? "Avatar must be smaller than 2 MB."
        : "Cover image must be smaller than 5 MB.",
    );
  }

  const filePath =
    `${userId}/${type}`;

  const { error: uploadError } =
    await supabase.storage
      .from("profile-media")
      .upload(
        filePath,
        file,
        {
          upsert: true,
          contentType: file.type,
          cacheControl: "3600",
        },
      );

  if (uploadError) {
    throw uploadError;
  }

  const { data } =
    supabase.storage
      .from("profile-media")
      .getPublicUrl(filePath);

  return (
    `${data.publicUrl}?v=${Date.now()}`
  );
}