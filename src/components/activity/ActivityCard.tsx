import { Link } from "react-router";

import {
  formatRelativeTime,
} from "../../lib/formatRelativeTime";

import type {
  ActivityFeedItem,
} from "../../types/activity";

import "./ActivityCard.css";

interface ActivityCardProps {
  activity: ActivityFeedItem;
}

const actionLabels = {
  plan_to_watch:
    "added to Plan to Watch",

  watching:
    "started watching",

  completed:
    "completed",
};

function ActivityCard({
  activity,
}: ActivityCardProps) {
  const {
    profile,
    media,
  } = activity;

  return (
    <article className="activity-card">
      <Link
        to={
          `/profile/${profile.username}`
        }
        className="activity-avatar"
      >
        {profile.avatar_url ? (
          <img
            src={
              profile.avatar_url
            }
            alt={
              profile.display_name ??
              profile.username
            }
          />
        ) : (
          <span>
            {profile.username
              .charAt(0)
              .toUpperCase()}
          </span>
        )}
      </Link>

      <div className="activity-content">
        <p>
          <Link
            to={
              `/profile/${profile.username}`
            }
            className="activity-user"
          >
            {profile.display_name ||
              profile.username}
          </Link>{" "}

          <span>
            {
              actionLabels[
                activity.action
              ]
            }
          </span>{" "}

          <Link
            to={
              `/media/${media.slug}`
            }
            className="activity-media"
          >
            {media.title}
          </Link>
        </p>

        <time
          dateTime={
            activity.created_at
          }
        >
          {formatRelativeTime(
            activity.created_at,
          )}
        </time>
      </div>

      <Link
        to={`/media/${media.slug}`}
        className="activity-poster"
        aria-label={
          `Open ${media.title}`
        }
      >
        {media.poster_url ? (
          <img
            src={
              media.poster_url
            }
            alt=""
          />
        ) : (
          <span>
            {media.title
              .charAt(0)
              .toUpperCase()}
          </span>
        )}
      </Link>
    </article>
  );
}

export default ActivityCard;