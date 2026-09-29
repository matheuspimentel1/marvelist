import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import { useAuth } from "../features/auth/useAuth";

import {
  getProfileById,
  getProfileByUsername,
} from "../services/profileService";

import type { Profile } from "../types/profile";

import ProfileFavorites
  from "../components/profile/ProfileFavorites";

import ProfileStatistics
  from "../components/profile/ProfileStatistics";

import "../styles/profile.css";

function ProfilePage() {
  const { username } = useParams();

  const { user } = useAuth();

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      try {
        setLoading(true);
        setError(null);

        let profileData: Profile | null;

        if (username) {
          profileData =
            await getProfileByUsername(
              username,
            );
        } else if (user) {
          profileData =
            await getProfileById(
              user.id,
            );
        } else {
          profileData = null;
        }

        setProfile(profileData);
      } catch {
        setError(
          "Unable to load profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [username, user]);

  if (loading) {
    return <p>Loading profile...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!profile) {
    return <h1>Profile not found</h1>;
  }

  const isOwner =
    user?.id === profile.id;

  return (
    <section className="profile-page">
      <div className="profile-cover">
        {profile.cover_url ? (
          <img
            src={profile.cover_url}
            alt=""
          />
        ) : (
          <div className="profile-cover-placeholder" />
        )}
      </div>

      <div className="profile-content">
        <aside className="profile-sidebar">
          <div className="profile-avatar">
            {profile.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={
                  profile.display_name
                    ?? profile.username
                }
              />
            ) : (
              <span>
                {profile.username
                  .charAt(0)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <h1>
            {profile.display_name
              || profile.username}
          </h1>

          <p className="profile-username">
            @{profile.username}
          </p>

          {profile.bio && (
            <p className="profile-bio">
              {profile.bio}
            </p>
          )}

          {isOwner && (
            <Link
              to="/settings/profile"
              className="profile-edit-button"
            >
              Edit Profile
            </Link>
          )}

          <ProfileFavorites
            userId={profile.id}
          />
        </aside>

        <div className="profile-main">
          <ProfileStatistics
            userId={profile.id}
          />

          <section className="profile-section">
            <h2>Activity</h2>

            <p>
              Recent activity will
              appear here.
            </p>
          </section>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;