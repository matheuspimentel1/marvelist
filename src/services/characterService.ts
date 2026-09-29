import { supabase } from "../lib/supabase";

import type {
  Character,
  CharacterDetails,
  CharacterRelation,
} from "../types/character";

import type { Media } from "../types/media";

export async function getCharacterBySlug(
  slug: string,
): Promise<Character | null> {
  const { data, error } =
    await supabase
      .from("characters")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();

  if (error) {
    throw error;
  }

  return data;
}

export async function getCharactersForMedia(
  mediaId: string,
): Promise<Character[]> {
  const {
    data: linksData,
    error: linksError,
  } = await supabase
    .from("media_characters")
    .select(
      "character_id, sort_order",
    )
    .eq("media_id", mediaId)
    .order(
      "sort_order",
      {
        ascending: true,
      },
    );

  if (linksError) {
    throw linksError;
  }

  const links = (
    linksData ?? []
  ) as Array<{
    character_id: string;
    sort_order: number;
  }>;

  if (links.length === 0) {
    return [];
  }

  const characterIds =
    links.map(
      (link) =>
        link.character_id,
    );

  const {
    data: charactersData,
    error: charactersError,
  } = await supabase
    .from("characters")
    .select("*")
    .in("id", characterIds);

  if (charactersError) {
    throw charactersError;
  }

  const characters =
    (charactersData ??
      []) as Character[];

  const orderMap =
    new Map(
      links.map(
        (link) => [
          link.character_id,
          link.sort_order,
        ],
      ),
    );

  return characters.sort(
    (a, b) =>
      (orderMap.get(a.id) ?? 0) -
      (orderMap.get(b.id) ?? 0),
  );
}

async function getMediaForCharacter(
  characterId: string,
): Promise<Media[]> {
  const {
    data: linksData,
    error: linksError,
  } = await supabase
    .from("media_characters")
    .select(
      "media_id, sort_order",
    )
    .eq(
      "character_id",
      characterId,
    )
    .order(
      "sort_order",
      {
        ascending: true,
      },
    );

  if (linksError) {
    throw linksError;
  }

  const links = (
    linksData ?? []
  ) as Array<{
    media_id: string;
    sort_order: number;
  }>;

  if (links.length === 0) {
    return [];
  }

  const mediaIds =
    links.map(
      (link) =>
        link.media_id,
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

  const orderMap =
    new Map(
      links.map(
        (link) => [
          link.media_id,
          link.sort_order,
        ],
      ),
    );

  return media.sort(
    (a, b) =>
      (orderMap.get(a.id) ?? 0) -
      (orderMap.get(b.id) ?? 0),
  );
}

async function getCharacterRelations(
  characterId: string,
): Promise<CharacterRelation[]> {
  const { data, error } =
    await supabase
      .from(
        "character_relations",
      )
      .select("*")
      .or(
        `source_character_id.eq.${characterId},target_character_id.eq.${characterId}`,
      );

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    return [];
  }

  const relatedIds =
    data.map((relation) =>
      relation.source_character_id ===
      characterId
        ? relation.target_character_id
        : relation.source_character_id,
    );

  const {
    data: characters,
    error: charactersError,
  } = await supabase
    .from("characters")
    .select("*")
    .in("id", relatedIds);

  if (charactersError) {
    throw charactersError;
  }

  const characterMap =
    new Map(
      (characters ?? []).map(
        (character) => [
          character.id,
          character as Character,
        ],
      ),
    );

  return data.flatMap(
    (relation) => {
      const isSource =
        relation.source_character_id ===
        characterId;

      const relatedId =
        isSource
          ? relation.target_character_id
          : relation.source_character_id;

      const character =
        characterMap.get(
          relatedId,
        );

      if (!character) {
        return [];
      }

      return [
        {
          id: relation.id,

          relationType:
            isSource
              ? relation.source_relation_type
              : relation.target_relation_type,

          description:
            relation.description,

          character,
        },
      ];
    },
  );
}

export async function getCharacterDetailsBySlug(
  slug: string,
): Promise<CharacterDetails | null> {
  const character =
    await getCharacterBySlug(
      slug,
    );

  if (!character) {
    return null;
  }

  const [
    media,
    relations,
  ] = await Promise.all([
    getMediaForCharacter(
      character.id,
    ),

    getCharacterRelations(
      character.id,
    ),
  ]);

  return {
    character,
    media,
    relations,
  };
}