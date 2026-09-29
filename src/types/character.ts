import type { Media } from "./media";

export interface Character {
  id: string;

  slug: string;

  name: string;
  real_name: string | null;

  aliases: string[];

  description: string | null;

  image_url: string | null;

  birth_date: string | null;
  death_date: string | null;

  height_cm: number | null;
  weight_kg: number | null;

  created_at: string;
  updated_at: string;
}

export interface CharacterRelation {
  id: string;

  relationType: string;

  description: string | null;

  character: Character;
}

export interface CharacterDetails {
  character: Character;
  media: Media[];
  relations: CharacterRelation[];
}