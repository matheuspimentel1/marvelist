import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useNavigate } from "react-router";

import { useAuth } from "../features/auth/useAuth";

import {
  getProfileById,
  updateProfile,
} from "../services/profileService";

import {
  uploadProfileImage,
} from "../services/profileImageService";

import "../styles/auth.css";

function ProfileSettingsPage() {
  const navigate = useNavigate();

  const { user } = useAuth();

  const [username, setUsername] =
    useState("");

  const [
    displayName,
    setDisplayName,
  ] = useState("");

  const [bio, setBio] =
    useState("");

  const [avatarFile, setAvatarFile] =
    useState<File | null>(null);

  const [coverFile, setCoverFile] =
    useState<File | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      if (!user) {
        return;
      }

      try {
        const profile =
          await getProfileById(
            user.id,
          );

        if (!profile) {
          throw new Error(
            "Profile not found.",
          );
        }

        setUsername(
          profile.username,
        );

        setDisplayName(
          profile.display_name ?? "",
        );

        setBio(
          profile.bio ?? "",
        );
      } catch {
        setError(
          "Unable to load profile.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [user]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!user) {
      return;
    }

    setError(null);

    const normalizedUsername =
      username.trim().toLowerCase();

    const usernameRegex =
      /^[a-z0-9_]{3,30}$/;

    if (
      !usernameRegex.test(
        normalizedUsername,
      )
    ) {
      setError(
        "Username must contain 3 to 30 lowercase letters, numbers or underscores.",
      );

      return;
    }

    if (displayName.length > 50) {
      setError(
        "Display name must contain at most 50 characters.",
      );

      return;
    }

    if (bio.length > 500) {
      setError(
        "Bio must contain at most 500 characters.",
      );

      return;
    }

    try {
      setSaving(true);

      let avatarUrl:
        string | undefined;

      let coverUrl:
        string | undefined;

      if (avatarFile) {
        avatarUrl =
          await uploadProfileImage(
            user.id,
            avatarFile,
            "avatar",
          );
      }

      if (coverFile) {
        coverUrl =
          await uploadProfileImage(
            user.id,
            coverFile,
            "cover",
          );
      }

      const updatedProfile =
        await updateProfile(
          user.id,
          {
            username:
              normalizedUsername,

            displayName:
              displayName || null,

            bio:
              bio || null,

            avatarUrl,
            coverUrl,
          },
        );

      navigate(
        `/profile/${updatedProfile.username}`,
        {
          replace: true,
        },
      );
    } catch (caughtError) {
      if (
        caughtError instanceof Error
      ) {
        if (
          caughtError.message.includes(
            "duplicate key",
          )
        ) {
          setError(
            "This username is already taken.",
          );
        } else {
          setError(
            caughtError.message,
          );
        }
      } else {
        setError(
          "Unable to update profile.",
        );
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>Edit Profile</h1>

        <form
          className="auth-form"
          onSubmit={handleSubmit}
        >
          <label>
            Username
            <input
              value={username}
              onChange={(event) =>
                setUsername(
                  event.target.value
                    .toLowerCase(),
                )
              }
              maxLength={30}
              required
            />
          </label>

          <label>
            Display name
            <input
              value={displayName}
              onChange={(event) =>
                setDisplayName(
                  event.target.value,
                )
              }
              maxLength={50}
            />
          </label>

          <label>
            Bio
            <textarea
              value={bio}
              onChange={(event) =>
                setBio(
                  event.target.value,
                )
              }
              maxLength={500}
              rows={5}
            />
          </label>

          <label>
            Profile picture
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setAvatarFile(
                  event.target.files?.[0]
                    ?? null,
                )
              }
            />
          </label>

          <label>
            Cover image
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) =>
                setCoverFile(
                  event.target.files?.[0]
                    ?? null,
                )
              }
            />
          </label>

          {error && (
            <p className="auth-error">
              {error}
            </p>
          )}

          <button
            className="auth-primary-button"
            type="submit"
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ProfileSettingsPage;