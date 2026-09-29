import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useAuth } from "../../features/auth/useAuth";

import {
  getWatchedEpisodeIds,
  markEpisodeWatched,
  unmarkEpisodeWatched,
} from "../../services/episodeProgressService";

import type {
  MediaDetails,
} from "../../types/media";

import ProgressBar from "./ProgressBar";

import "./EpisodeTracker.css";

interface EpisodeTrackerProps {
  media: MediaDetails;
}

function EpisodeTracker({
  media,
}: EpisodeTrackerProps) {
  const { user } = useAuth();

  const [watchedIds, setWatchedIds] =
    useState<Set<string>>(
      new Set(),
    );

  const [savingId, setSavingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const episodes =
    useMemo(
      () =>
        media.seasons.flatMap(
          (season) =>
            season.episodes,
        ),
      [media.seasons],
    );

  useEffect(() => {
    async function loadProgress() {
      if (!user) {
        setWatchedIds(
          new Set(),
        );

        return;
      }

      try {
        const ids =
          await getWatchedEpisodeIds(
            user.id,
            episodes.map(
              (episode) =>
                episode.id,
            ),
          );

        setWatchedIds(ids);
      } catch {
        setError(
          "Unable to load episode progress.",
        );
      }
    }

    void loadProgress();
  }, [
    user,
    episodes,
  ]);

  async function handleToggle(
    episodeId: string,
  ) {
    if (!user) {
      return;
    }

    const isWatched =
      watchedIds.has(
        episodeId,
      );

    try {
      setSavingId(episodeId);
      setError(null);

      if (isWatched) {
        await unmarkEpisodeWatched(
          user.id,
          media.id,
          episodeId,
        );
      } else {
        await markEpisodeWatched(
          user.id,
          media.id,
          episodeId,
        );
      }

      setWatchedIds(
        (current) => {
          const next =
            new Set(current);

          if (isWatched) {
            next.delete(
              episodeId,
            );
          } else {
            next.add(
              episodeId,
            );
          }

          return next;
        },
      );
    } catch {
      setError(
        "Unable to update episode progress.",
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="episode-tracker">
      {user && (
        <div className="episode-progress-summary">
          <ProgressBar
            current={
              watchedIds.size
            }
            total={
              episodes.length
            }
          />

          <p>
            {watchedIds.size} of{" "}
            {episodes.length}{" "}
            episodes watched
          </p>
        </div>
      )}

      {error && (
        <p className="episode-tracker-error">
          {error}
        </p>
      )}

      {media.seasons.map(
        (season) => (
          <section
            key={season.id}
            className="season-card"
          >
            <div className="season-header">
              <div>
                <h3>
                  {season.title ||
                    `Season ${season.season_number}`}
                </h3>

                <span>
                  {
                    season.episodes
                      .length
                  }{" "}
                  {season.episodes
                    .length === 1
                    ? "episode"
                    : "episodes"}
                </span>
              </div>
            </div>

            {season.episodes.length ===
            0 ? (
              <p className="media-muted">
                No episodes available.
              </p>
            ) : (
              <div className="episode-list">
                {season.episodes.map(
                  (episode) => {
                    const watched =
                      watchedIds.has(
                        episode.id,
                      );

                    return (
                      <article
                        key={
                          episode.id
                        }
                        className={`episode-card ${
                          watched
                            ? "episode-card-watched"
                            : ""
                        }`}
                      >
                        {user ? (
                          <button
                            type="button"
                            className="episode-check"
                            aria-label={
                              watched
                                ? `Mark ${episode.title} as unwatched`
                                : `Mark ${episode.title} as watched`
                            }
                            disabled={
                              savingId ===
                              episode.id
                            }
                            onClick={() =>
                              void handleToggle(
                                episode.id,
                              )
                            }
                          >
                            {watched
                              ? "✓"
                              : ""}
                          </button>
                        ) : (
                          <div className="episode-number">
                            {
                              episode.episode_number
                            }
                          </div>
                        )}

                        <div className="episode-info">
                          <h4>
                            {
                              episode.episode_number
                            }
                            .{" "}
                            {
                              episode.title
                            }
                          </h4>

                          {episode.description && (
                            <p>
                              {
                                episode.description
                              }
                            </p>
                          )}
                        </div>
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>
        ),
      )}
    </div>
  );
}

export default EpisodeTracker;