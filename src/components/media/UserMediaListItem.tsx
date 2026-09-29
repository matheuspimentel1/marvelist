import {
  useState,
  type ChangeEvent,
} from "react";

import { Link } from "react-router";

import {
  removeUserMedia,
  setUserMediaStatus,
} from "../../services/userMediaService";

import type {
  UserMediaStatus,
  UserMediaWithMedia,
} from "../../types/userMedia";

import "./UserMediaListItem.css";

interface UserMediaListItemProps {
  item: UserMediaWithMedia;

  userId: string;

  onUpdate:
    (
      mediaId: string,
      updatedStatus:
        UserMediaStatus,
    ) => void;

  onRemove:
    (mediaId: string) => void;
}

function UserMediaListItem({
  item,
  userId,
  onUpdate,
  onRemove,
}: UserMediaListItemProps) {
  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleStatusChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const value =
      event.target.value;

    if (
      value !==
        "plan_to_watch" &&
      value !== "watching" &&
      value !== "completed"
    ) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await setUserMediaStatus(
        userId,
        item.media_id,
        value,
      );

      onUpdate(
        item.media_id,
        value,
      );
    } catch {
      setError(
        "Unable to update status.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    try {
      setSaving(true);
      setError(null);

      await removeUserMedia(
        userId,
        item.media_id,
      );

      onRemove(
        item.media_id,
      );
    } catch {
      setError(
        "Unable to remove title.",
      );
    } finally {
      setSaving(false);
    }
  }

  const formatLabel =
    item.media.format ===
      "movie"
      ? "Movie"
      : "TV Show";

  const releaseYear =
    item.media.release_date
      ? new Date(
          `${item.media.release_date}T00:00:00`,
        ).getFullYear()
      : null;

  return (
    <article className="user-media-item">
      <Link
        to={`/media/${item.media.slug}`}
        className="user-media-poster"
      >
        {item.media.poster_url ? (
          <img
            src={
              item.media.poster_url
            }
            alt={`${item.media.title} poster`}
          />
        ) : (
          <div className="user-media-poster-placeholder">
            {item.media.title
              .charAt(0)
              .toUpperCase()}
          </div>
        )}
      </Link>

      <div className="user-media-info">
        <Link
          to={`/media/${item.media.slug}`}
          className="user-media-title"
        >
          {item.media.title}
        </Link>

        <div className="user-media-meta">
          <span>
            {formatLabel}
          </span>

          {releaseYear && (
            <span>
              {releaseYear}
            </span>
          )}
        </div>

        {error && (
          <p className="user-media-error">
            {error}
          </p>
        )}
      </div>

      <div className="user-media-actions">
        <select
          value={item.status}
          onChange={
            handleStatusChange
          }
          disabled={saving}
        >
          <option
            value="plan_to_watch"
          >
            Plan to Watch
          </option>

          <option value="watching">
            Watching
          </option>

          <option value="completed">
            Completed
          </option>
        </select>

        <button
          type="button"
          onClick={handleRemove}
          disabled={saving}
        >
          Remove
        </button>
      </div>
    </article>
  );
}

export default UserMediaListItem;