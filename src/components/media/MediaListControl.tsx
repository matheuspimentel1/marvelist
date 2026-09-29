import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import { Link } from "react-router";

import { useAuth } from "../../features/auth/useAuth";

import {
  getUserMediaEntry,
  removeUserMedia,
  setUserMediaStatus,
} from "../../services/userMediaService";

import type {
  UserMediaStatus,
} from "../../types/userMedia";

import "./MediaListControl.css";

interface MediaListControlProps {
  mediaId: string;
}

function MediaListControl({
  mediaId,
}: MediaListControlProps) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [status, setStatus] =
    useState<UserMediaStatus | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadStatus() {
      if (!user) {
        setStatus(null);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        const entry =
          await getUserMediaEntry(
            user.id,
            mediaId,
          );

        setStatus(
          entry?.status ?? null,
        );
      } catch {
        setError(
          "Unable to load your list status.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadStatus();
  }, [
    user,
    mediaId,
  ]);

  async function handleStatusChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    if (!user) {
      return;
    }

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

      const updated =
        await setUserMediaStatus(
          user.id,
          mediaId,
          value,
        );

      setStatus(
        updated.status,
      );
    } catch {
      setError(
        "Unable to update your list.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!user) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      await removeUserMedia(
        user.id,
        mediaId,
      );

      setStatus(null);
    } catch {
      setError(
        "Unable to remove this title.",
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
      <div className="media-list-control">
        <Link
          to="/login"
          className="media-list-login"
        >
          Sign in to track
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="media-list-control">
        <button
          type="button"
          disabled
        >
          Loading...
        </button>
      </div>
    );
  }

  return (
    <div className="media-list-control">
      <select
        value={status ?? ""}
        onChange={
          handleStatusChange
        }
        disabled={saving}
        aria-label="List status"
      >
        <option
          value=""
          disabled
        >
          Add to List
        </option>

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

      {status && (
        <button
          type="button"
          className="media-list-remove"
          onClick={handleRemove}
          disabled={saving}
        >
          Remove
        </button>
      )}

      {error && (
        <p className="media-list-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default MediaListControl;