import {
  useEffect,
  useState,
} from "react";

import {
  getCharactersForMedia,
} from "../../services/characterService";

import type {
  Character,
} from "../../types/character";

import CharacterCard
  from "./CharacterCard";

import "./MediaCharacters.css";

interface MediaCharactersProps {
  mediaId: string;
}

function MediaCharacters({
  mediaId,
}: MediaCharactersProps) {
  const [characters, setCharacters] =
    useState<Character[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadCharacters() {
      try {
        const data =
          await getCharactersForMedia(
            mediaId,
          );

        setCharacters(data);
      } finally {
        setLoading(false);
      }
    }

    void loadCharacters();
  }, [mediaId]);

  if (loading) {
    return <p>Loading characters...</p>;
  }

  if (characters.length === 0) {
    return (
      <p className="media-muted">
        Character information is
        not available yet.
      </p>
    );
  }

  return (
    <div className="media-character-grid">
      {characters.map(
        (character) => (
          <CharacterCard
            key={character.id}
            character={character}
          />
        ),
      )}
    </div>
  );
}

export default MediaCharacters;