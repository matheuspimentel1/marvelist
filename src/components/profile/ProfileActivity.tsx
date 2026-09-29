import {
  useEffect,
  useState,
} from "react";

import ActivityCard
  from "../activity/ActivityCard";

import {
  getUserActivities,
} from "../../services/activityService";

import type {
  ActivityFeedItem,
} from "../../types/activity";

interface ProfileActivityProps {
  userId: string;
}

function ProfileActivity({
  userId,
}: ProfileActivityProps) {
  const [activities, setActivities] =
    useState<ActivityFeedItem[]>(
      [],
    );

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadActivities() {
      try {
        const data =
          await getUserActivities(
            userId,
            10,
          );

        setActivities(data);
      } finally {
        setLoading(false);
      }
    }

    void loadActivities();
  }, [userId]);

  return (
    <section className="profile-section">
      <h2>Activity</h2>

      {loading ? (
        <p>
          Loading activity...
        </p>
      ) : activities.length ===
        0 ? (
        <p>
          No recent activity yet.
        </p>
      ) : (
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

export default ProfileActivity;