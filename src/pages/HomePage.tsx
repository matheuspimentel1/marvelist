import {
  useEffect,
  useState,
} from "react";

import ActivityCard
  from "../components/activity/ActivityCard";

import { useAuth } from "../features/auth/useAuth";

import {
  getFollowingActivities,
  getGlobalActivities,
} from "../services/activityService";

import type {
  ActivityFeedItem,
} from "../types/activity";

import "../styles/home.css";

type FeedType =
  | "global"
  | "following";

function HomePage() {
  const { user } = useAuth();

  const [feedType, setFeedType] =
    useState<FeedType>(
      "global",
    );

  const [activities, setActivities] =
    useState<ActivityFeedItem[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadActivities() {
      try {
        setLoading(true);
        setError(null);

        const result =
          feedType === "global"
            ? await getGlobalActivities()
            : user
              ? await getFollowingActivities(
                  user.id,
                )
              : [];

        if (!cancelled) {
          setActivities(
            result,
          );
        }
      } catch {
        if (!cancelled) {
          setError(
            "Unable to load activity feed.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadActivities();

    return () => {
      cancelled = true;
    };
  }, [
    feedType,
    user,
  ]);

  return (
    <section className="home-page">
      <header className="home-header">
        <h1>Home</h1>

        <p>
          See what the Marvelist
          community is watching.
        </p>
      </header>

      <div className="activity-tabs">
        <button
          type="button"
          className={
            feedType === "global"
              ? "active"
              : ""
          }
          onClick={() =>
            setFeedType(
              "global",
            )
          }
        >
          Global Activity
        </button>

        <button
          type="button"
          className={
            feedType ===
            "following"
              ? "active"
              : ""
          }
          onClick={() =>
            setFeedType(
              "following",
            )
          }
        >
          Following Activity
        </button>
      </div>

      {loading && (
        <div className="home-state">
          Loading activity...
        </div>
      )}

      {!loading && error && (
        <div className="home-state">
          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        activities.length ===
          0 && (
          <div className="home-state">
            <h2>
              {feedType ===
              "following"
                ? "No following activity yet"
                : "No activity yet"}
            </h2>

            <p>
              {feedType ===
              "following"
                ? "Follow other users to see their activity here."
                : "Activity will appear when users start tracking Marvel titles."}
            </p>
          </div>
        )}

      {!loading &&
        !error &&
        activities.length >
          0 && (
          <div className="activity-feed">
            {activities.map(
              (activity) => (
                <ActivityCard
                  key={
                    activity.id
                  }
                  activity={
                    activity
                  }
                />
              ),
            )}
          </div>
        )}
    </section>
  );
}

export default HomePage;