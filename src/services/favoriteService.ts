import { supabase } from "../lib/supabase";

import type {
  Character,
} from "../types/character";

import type {
  Media,
} from "../types/media";

export async function isMediaFavorite(
  userId: string,
  mediaId: string,
): Promise<boolean> {
  const { data, error } =
    await supabase
      .from("favorite_media")
      .select("media_id")
      .eq("user_id", userId)
      .eq("media_id", mediaId)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}

export async function addFavoriteMedia(
  userId: string,
  mediaId: string,
) {
  const { error } =
    await supabase
      .from("favorite_media")
      .insert({
        user_id: userId,
        media_id: mediaId,
      });

  if (error) {
    throw error;
  }
}

export async function removeFavoriteMedia(
  userId: string,
  mediaId: string,
) {
  const { error } =
    await supabase
      .from("favorite_media")
      .delete()
      .eq("user_id", userId)
      .eq("media_id", mediaId);

  if (error) {
    throw error;
  }
}

export async function isCharacterFavorite(
  userId: string,
  characterId: string,
): Promise<boolean> {
  const { data, error } =
    await supabase
      .from("favorite_characters")
      .select("character_id")
      .eq("user_id", userId)
      .eq(
        "character_id",
        characterId,
      )
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data !== null;
}


export async function addFavoriteCharacter(
  userId: string,
  characterId: string,
) {
  const { error } =
    await supabase
      .from("favorite_characters")
      .insert({
        user_id: userId,
        character_id:
          characterId,
      });

  if (error) {
    throw error;
  }
}


export async function removeFavoriteCharacter(
  userId: string,
  characterId: string,
) {
  const { error } =
    await supabase
      .from("favorite_characters")
      .delete()
      .eq("user_id", userId)
      .eq(
        "character_id",
        characterId,
      );

  if (error) {
    throw error;
  }
}

export async function getFavoriteMedia(
  userId: string,
  limit = 6,
): Promise<Media[]> {
  const {
    data: favoriteData,
    error: favoriteError,
  } = await supabase
    .from("favorite_media")
    .select("media_id, created_at")
    .eq("user_id", userId)
    .order(
      "created_at",
      {
        ascending: false,
      },
    )
    .limit(limit);

  if (favoriteError) {
    throw favoriteError;
  }

  if (
    !favoriteData ||
    favoriteData.length === 0
  ) {
    return [];
  }

  const mediaIds =
    favoriteData.map(
      (favorite) =>
        favorite.media_id,
    );

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

  return mediaIds.flatMap(
    (id) => {
      const item =
        mediaMap.get(id);

      return item
        ? [item]
        : [];
    },
  );
}

export async function getFavoriteCharacters(
  userId: string,
  limit = 6,
): Promise<Character[]> {
  const {
    data: favoriteData,
    error: favoriteError,
  } = await supabase
    .from(
      "favorite_characters",
    )
    .select(
      "character_id, created_at",
    )
    .eq("user_id", userId)
    .order(
      "created_at",
      {
        ascending: false,
      },
    )
    .limit(limit);

  if (favoriteError) {
    throw favoriteError;
  }

  if (
    !favoriteData ||
    favoriteData.length === 0
  ) {
    return [];
  }

  const characterIds =
    favoriteData.map(
      (favorite) =>
        favorite.character_id,
    );

  const {
    data: characterData,
    error: characterError,
  } = await supabase
    .from("characters")
    .select("*")
    .in("id", characterIds);

  if (characterError) {
    throw characterError;
  }

  const characters =
    (characterData ??
      []) as Character[];

  const characterMap =
    new Map(
      characters.map(
        (character) => [
          character.id,
          character,
        ],
      ),
    );

  return characterIds.flatMap(
    (id) => {
      const character =
        characterMap.get(id);

      return character
        ? [character]
        : [];
    },
  );
}