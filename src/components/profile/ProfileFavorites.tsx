import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router";

import {
  getFavoriteCharacters,
  getFavoriteMedia,
} from "../../services/favoriteService";

import type {
  Character,
} from "../../types/character";

import type {
  Media,
} from "../../types/media";

import "./ProfileFavorites.css";

interface ProfileFavoritesProps {
  userId: string;
}

function ProfileFavorites({
  userId,
}: ProfileFavoritesProps) {
  const [media, setMedia] =
    useState<Media[]>([]);

  const [
    characters,
    setCharacters,
  ] =
    useState<Character[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const [
          favoriteMedia,
          favoriteCharacters,
        ] = await Promise.all([
          getFavoriteMedia(
            userId,
          ),

          getFavoriteCharacters(
            userId,
          ),
        ]);

        setMedia(favoriteMedia);

        setCharacters(
          favoriteCharacters,
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFavorites();
  }, [userId]);

  if (loading) {
    return (
      <p>Loading favorites...</p>
    );
  }

  return (
    <div className="profile-favorites">
      <section className="profile-favorite-panel">
        <h2>
          Favorite Media
        </h2>

        {media.length === 0 ? (
          <p className="profile-favorite-empty">
            No favorite titles yet.
          </p>
        ) : (
          <div className="profile-favorite-grid">
            {media.map(
              (item) => (
                <Link
                  key={item.id}
                  to={
                    `/media/${item.slug}`
                  }
                  title={
                    item.title
                  }
                  className="profile-favorite-item"
                >
                  {item.poster_url ? (
                    <img
                      src={
                        item.poster_url
                      }
                      alt={
                        item.title
                      }
                    />
                  ) : (
                    <span>
                      {item.title
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </Link>
              ),
            )}
          </div>
        )}
      </section>

      <section className="profile-favorite-panel">
        <h2>
          Favorite Characters
        </h2>

        {characters.length ===
        0 ? (
          <p className="profile-favorite-empty">
            No favorite characters
            yet.
          </p>
        ) : (
          <div className="profile-favorite-grid profile-character-favorites">
            {characters.map(
              (character) => (
                <Link
                  key={
                    character.id
                  }
                  to={
                    `/character/${character.slug}`
                  }
                  title={
                    character.name
                  }
                  className="profile-favorite-item"
                >
                  {character.image_url ? (
                    <img
                      src={
                        character.image_url
                      }
                      alt={
                        character.name
                      }
                    />
                  ) : (
                    <span>
                      {character.name
                        .charAt(0)
                        .toUpperCase()}
                    </span>
                  )}
                </Link>
              ),
            )}
          </div>
        )}
      </section>
    </div>
  );
}

export default ProfileFavorites;