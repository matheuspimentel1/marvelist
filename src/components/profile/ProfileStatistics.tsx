import {
  useEffect,
  useState,
} from "react";

import {
  getProfileStats,
} from "../../services/profileStatsService";

import type {
  ProfileStats,
} from "../../types/profileStats";

import "./ProfileStatistics.css";

interface ProfileStatisticsProps {
  userId: string;
}

function formatWatchTime(
  minutes: number,
) {
  if (minutes <= 0) {
    return "0h";
  }

  const hours =
    Math.floor(
      minutes / 60,
    );

  const remainingMinutes =
    minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (
    remainingMinutes === 0
  ) {
    return `${hours}h`;
  }

  return (
    `${hours}h ` +
    `${remainingMinutes}m`
  );
}

function ProfileStatistics({
  userId,
}: ProfileStatisticsProps) {
  const [stats, setStats] =
    useState<ProfileStats | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        setError(null);

        const data =
          await getProfileStats(
            userId,
          );

        setStats(data);
      } catch {
        setError(
          "Unable to load statistics.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadStats();
  }, [userId]);

  if (loading) {
    return (
      <section className="profile-section">
        <h2>Statistics</h2>

        <p>
          Loading statistics...
        </p>
      </section>
    );
  }

  if (
    error ||
    !stats
  ) {
    return (
      <section className="profile-section">
        <h2>Statistics</h2>

        <p>
          {error ??
            "Statistics unavailable."}
        </p>
      </section>
    );
  }

  return (
    <section className="profile-section">
      <h2>Statistics</h2>

      <div className="profile-stats-grid">
        <article className="profile-stat-card">
          <strong>
            {stats.completedMovies}
          </strong>

          <span>
            Movies Completed
          </span>
        </article>

        <article className="profile-stat-card">
          <strong>
            {stats.completedTvShows}
          </strong>

          <span>
            TV Shows Completed
          </span>
        </article>

        <article className="profile-stat-card">
          <strong>
            {stats.watchedEpisodes}
          </strong>

          <span>
            Episodes Watched
          </span>
        </article>

        <article className="profile-stat-card">
          <strong>
            {formatWatchTime(
              stats.watchedMinutes,
            )}
          </strong>

          <span>
            Watch Time
          </span>
        </article>
      </div>
    </section>
  );
}

export default ProfileStatistics;