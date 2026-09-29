import {
  useEffect,
  useState,
} from "react";

import { Link } from "react-router";

import { useAuth } from "../../features/auth/useAuth";

import {
  followUser,
  isFollowingUser,
  unfollowUser,
} from "../../services/socialService";

import "./FollowButton.css";

interface FollowButtonProps {
  targetUserId: string;

  onFollowChange?: (
    following: boolean,
  ) => void;
}

function FollowButton({
  targetUserId,
  onFollowChange,
}: FollowButtonProps) {
  const {
    user,
    loading: authLoading,
  } = useAuth();

  const [following, setFollowing] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadFollowState() {
      if (
        !user ||
        user.id === targetUserId
      ) {
        setFollowing(false);
        setLoading(false);

        return;
      }

      try {
        setLoading(true);

        const result =
          await isFollowingUser(
            user.id,
            targetUserId,
          );

        setFollowing(result);
      } catch {
        setError(
          "Unable to load follow status.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadFollowState();
  }, [
    user,
    targetUserId,
  ]);

  if (authLoading) {
    return null;
  }

  if (
    user?.id === targetUserId
  ) {
    return null;
  }

  if (!user) {
    return (
      <Link
        to="/login"
        className="follow-login"
      >
        Sign in to Follow
      </Link>
    );
  }

  async function handleToggle() {
    if (!user) {
      return;
    }

    try {
      setSaving(true);
      setError(null);

      const nextFollowing =
        !following;

      if (following) {
        await unfollowUser(
          user.id,
          targetUserId,
        );
      } else {
        await followUser(
          user.id,
          targetUserId,
        );
      }

      setFollowing(
        nextFollowing,
      );

      onFollowChange?.(
        nextFollowing,
      );
    } catch {
      setError(
        "Unable to update follow.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="follow-control">
      <button
        type="button"
        className={`follow-button ${
          following
            ? "follow-button-active"
            : ""
        }`}
        disabled={
          loading || saving
        }
        aria-pressed={following}
        onClick={() =>
          void handleToggle()
        }
      >
        {loading
          ? "Loading..."
          : following
            ? "Following"
            : "Follow"}
      </button>

      {error && (
        <p className="follow-error">
          {error}
        </p>
      )}
    </div>
  );
}

export default FollowButton;