import { Link } from "react-router";

import type {
  Character,
} from "../../types/character";

import "./CharacterCard.css";

interface CharacterCardProps {
  character: Character;
}

function CharacterCard({
  character,
}: CharacterCardProps) {
  return (
    <Link
      to={
        `/character/${character.slug}`
      }
      className="character-card"
    >
      <div className="character-card-image">
        {character.image_url ? (
          <img
            src={character.image_url}
            alt={character.name}
            loading="lazy"
          />
        ) : (
          <span>
            {character.name
              .charAt(0)
              .toUpperCase()}
          </span>
        )}
      </div>

      <strong>
        {character.name}
      </strong>
    </Link>
  );
}

export default CharacterCard;