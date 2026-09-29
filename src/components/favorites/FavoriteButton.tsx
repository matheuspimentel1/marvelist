import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router";

import { useAuth } from "../../features/auth/useAuth";

import {
  addFavoriteCharacter,
  addFavoriteMedia,
  isCharacterFavorite,
  isMediaFavorite,
  removeFavoriteCharacter,
  removeFavoriteMedia,
} from "../../services/favoriteService";

import "./FavoriteButton.css";

type FavoriteType =
  | "media"
  | "character";

interface FavoriteButtonProps {
  type: FavoriteType;
  entityId: string;
}

function FavoriteButton({
  type,
  entityId,
}: FavoriteButtonProps) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [
    favorited,
    setFavorited,
  ] = useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadFavorite() {
      if (!user) {
        setFavorited(false);
        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        const result =
          type === "media"
            ? await isMediaFavorite(
                user.id,
                entityId,
              )
            : await isCharacterFavorite(
                user.id,
                entityId,
              );

        setFavorited(result);
      } catch {
        setError(
          "Unable to load favorite status.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFavorite();
  }, [
    user,
    type,
    entityId,
  ]);

  async function handleToggle() {
    if (!user) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      if (favorited) {
        if (type === "media") {
          await removeFavoriteMedia(
            user.id,
            entityId,
          );
        } else {
          await removeFavoriteCharacter(
            user.id,
            entityId,
          );
        }

        setFavorited(false);
      } else {
        if (type === "media") {
          await addFavoriteMedia(
            user.id,
            entityId,
          );
        } else {
          await addFavoriteCharacter(
            user.id,
            entityId,
          );
        }

        setFavorited(true);
      }
    } catch {
      setError(
        "Unable to update favorite.",
      );
    } finally {
      setSaving(false);
    }
  }

  if (authLoading) {
    return null;
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="favorite-login"
      >
        ♡ Sign in to favorite
      </Link>
    );
  }

  if (loading) {
    return (
      <button
        type="button"
        className="favorite-button"
        disabled
      >
        Loading...
      </button>
    );
  }

  return (
    <div className="favorite-control">
      <button
        type="button"
        className={`favorite-button ${
          favorited
            ? "favorite-button-active"
            : ""
        }`}
        aria-pressed={favorited}
        disabled={saving}
        onClick={() =>
          void handleToggle()
        }
      >
        {favorited
          ? "♥ Favorited"
          : "♡ Favorite"}
      </button>

      {error && (
        <p className="favorite-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FavoriteButton;