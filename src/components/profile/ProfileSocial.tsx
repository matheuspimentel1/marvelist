import {
  useEffect,
  useState,
} from "react";

import FollowButton
  from "../social/FollowButton";

import {
  getFollowCounts,
} from "../../services/socialService";

import type {
  FollowCounts,
} from "../../types/social";

import "./ProfileSocial.css";

interface ProfileSocialProps {
  userId: string;
  isOwner: boolean;
}

function ProfileSocial({
  userId,
  isOwner,
}: ProfileSocialProps) {
  const [counts, setCounts] =
    useState<FollowCounts | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadCounts() {
      try {
        setLoading(true);

        const result =
          await getFollowCounts(
            userId,
          );

        setCounts(result);
      } finally {
        setLoading(false);
      }
    }

    void loadCounts();
  }, [userId]);

  function handleFollowChange(
    following: boolean,
  ) {
    setCounts(
      (current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,

          followers:
            Math.max(
              0,
              current.followers +
                (
                  following
                    ? 1
                    : -1
                ),
            ),
        };
      },
    );
  }

  return (
    <div className="profile-social">
      <div className="profile-social-counts">
        <div>
          <strong>
            {loading
              ? "—"
              : counts?.followers ??
                0}
          </strong>

          <span>
            Followers
          </span>
        </div>

        <div>
          <strong>
            {loading
              ? "—"
              : counts?.following ??
                0}
          </strong>

          <span>
            Following
          </span>
        </div>
      </div>

      {!isOwner && (
        <FollowButton
          targetUserId={userId}
          onFollowChange={
            handleFollowChange
          }
        />
      )}
    </div>
  );
}

export default ProfileSocial;