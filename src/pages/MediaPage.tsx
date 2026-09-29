import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import {
  getMediaDetailsBySlug,
} from "../services/mediaService";

import type {
  MediaDetails,
  MediaReleaseStatus,
} from "../types/media";

import MediaListControl
  from "../components/media/MediaListControl";

import "../styles/media-page.css";

const releaseStatusLabels:
  Record<
    MediaReleaseStatus,
    string
  > = {
    released: "Released",
    releasing: "Releasing",
    not_yet_released:
      "Not Yet Released",
  };

function formatDate(
  date: string | null,
) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  ).format(
    new Date(
      `${date}T00:00:00`,
    ),
  );
}

function formatRuntime(
  minutes: number | null,
) {
  if (!minutes) {
    return null;
  }

  const hours =
    Math.floor(minutes / 60);

  const remainingMinutes =
    minutes % 60;

  if (hours === 0) {
    return `${remainingMinutes}m`;
  }

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return (
    `${hours}h ` +
    `${remainingMinutes}m`
  );
}

function MediaPage() {
  const { slug } = useParams();

  const [media, setMedia] =
    useState<MediaDetails | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadMedia() {
      if (!slug) {
        setError(
          "Invalid media URL.",
        );

        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const mediaDetails =
          await getMediaDetailsBySlug(
            slug,
          );

        setMedia(mediaDetails);
      } catch {
        setError(
          "Unable to load this title.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadMedia();
  }, [slug]);

  if (loading) {
    return (
      <div className="media-page-state">
        Loading title...
      </div>
    );
  }

  if (error) {
    return (
      <div className="media-page-state">
        <h1>
          Something went wrong
        </h1>

        <p>{error}</p>

        <Link to="/browse">
          Back to Browse
        </Link>
      </div>
    );
  }

  if (!media) {
    return (
      <div className="media-page-state">
        <h1>
          Title not found
        </h1>

        <p>
          This movie or TV show
          does not exist in the
          Marvelist catalog.
        </p>

        <Link to="/browse">
          Back to Browse
        </Link>
      </div>
    );
  }

  const releaseDate =
    formatDate(
      media.release_date,
    );

  const runtime =
    formatRuntime(
      media.runtime_minutes,
    );

  const formatLabel =
    media.format === "movie"
      ? "Movie"
      : "TV Show";

  const seasonCount =
    media.seasons.length;

  return (
    <article className="media-page">
      <Link
        to="/browse"
        className="media-back-link"
      >
        ← Back to Browse
      </Link>

      <section className="media-hero">
        <div className="media-hero-background">
          {media.banner_url ? (
            <img
              src={media.banner_url}
              alt=""
            />
          ) : (
            <div className="media-banner-placeholder" />
          )}

          <div className="media-hero-overlay" />
        </div>

        <div className="media-hero-content">
          <div className="media-page-poster">
            {media.poster_url ? (
              <img
                src={media.poster_url}
                alt={`${media.title} poster`}
              />
            ) : (
              <div className="media-page-poster-placeholder">
                {media.title
                  .charAt(0)
                  .toUpperCase()}
              </div>
            )}
          </div>

          <div className="media-page-info">
            <span className="media-page-format">
              {formatLabel}
            </span>

            <h1>
              {media.title}
            </h1>

            {media.original_title &&
              media.original_title !==
                media.title && (
                <p className="media-original-title">
                  {
                    media.original_title
                  }
                </p>
              )}

            <div className="media-page-meta">
              <span>
                {
                  releaseStatusLabels[
                    media.release_status
                  ]
                }
              </span>

              {releaseDate && (
                <span>
                  {releaseDate}
                </span>
              )}

              {runtime &&
                media.format ===
                  "movie" && (
                  <span>
                    {runtime}
                  </span>
                )}

              {media.format ===
                "tv" &&
                seasonCount > 0 && (
                  <span>
                    {seasonCount}{" "}
                    {seasonCount === 1
                      ? "Season"
                      : "Seasons"}
                  </span>
                )}
            </div>

            <MediaListControl
              mediaId={media.id}
            />
          </div>
        </div>
      </section>

      <div className="media-page-layout">
        <main className="media-page-main">
          <section className="media-section">
            <h2>Overview</h2>

            <p>
              {media.description ||
                "No description available yet."}
            </p>
          </section>

          {media.format ===
            "tv" && (
            <section className="media-section">
              <h2>Episodes</h2>

              {media.seasons
                .length === 0 ? (
                <p className="media-muted">
                  Season information
                  is not available yet.
                </p>
              ) : (
                <div className="season-list">
                  {media.seasons.map(
                    (season) => (
                      <section
                        key={
                          season.id
                        }
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
                                season
                                  .episodes
                                  .length
                              }{" "}
                              {season
                                .episodes
                                .length ===
                              1
                                ? "episode"
                                : "episodes"}
                            </span>
                          </div>
                        </div>

                        {season
                          .description && (
                          <p>
                            {
                              season.description
                            }
                          </p>
                        )}

                        {season
                          .episodes
                          .length ===
                        0 ? (
                          <p className="media-muted">
                            No episodes
                            available.
                          </p>
                        ) : (
                          <div className="episode-list">
                            {season.episodes.map(
                              (
                                episode,
                              ) => (
                                <article
                                  key={
                                    episode.id
                                  }
                                  className="episode-card"
                                >
                                  <div className="episode-number">
                                    {
                                      episode.episode_number
                                    }
                                  </div>

                                  <div className="episode-info">
                                    <h4>
                                      {
                                        episode.title
                                      }
                                    </h4>

                                    <div className="episode-meta">
                                      {episode.release_date && (
                                        <span>
                                          {formatDate(
                                            episode.release_date,
                                          )}
                                        </span>
                                      )}

                                      {episode.runtime_minutes && (
                                        <span>
                                          {formatRuntime(
                                            episode.runtime_minutes,
                                          )}
                                        </span>
                                      )}
                                    </div>

                                    {episode.description && (
                                      <p>
                                        {
                                          episode.description
                                        }
                                      </p>
                                    )}
                                  </div>
                                </article>
                              ),
                            )}
                          </div>
                        )}
                      </section>
                    ),
                  )}
                </div>
              )}
            </section>
          )}

          <section className="media-section">
            <h2>Characters</h2>

            <p className="media-muted">
              Character information
              will be added in a
              future update.
            </p>
          </section>

          <section className="media-section">
            <h2>Related</h2>

            <p className="media-muted">
              Related Marvel titles
              will be added in a
              future update.
            </p>
          </section>
        </main>

        <aside className="media-page-sidebar">
          <section className="media-sidebar-card">
            <h2>Information</h2>

            <dl>
              <div>
                <dt>Format</dt>
                <dd>
                  {formatLabel}
                </dd>
              </div>

              <div>
                <dt>Status</dt>
                <dd>
                  {
                    releaseStatusLabels[
                      media
                        .release_status
                    ]
                  }
                </dd>
              </div>

              <div>
                <dt>Release Date</dt>
                <dd>
                  {releaseDate ||
                    "Unknown"}
                </dd>
              </div>

              {media.end_date && (
                <div>
                  <dt>End Date</dt>
                  <dd>
                    {formatDate(
                      media.end_date,
                    )}
                  </dd>
                </div>
              )}

              {runtime && (
                <div>
                  <dt>Runtime</dt>
                  <dd>
                    {runtime}
                  </dd>
                </div>
              )}

              {media.format ===
                "tv" && (
                <div>
                  <dt>Seasons</dt>
                  <dd>
                    {
                      seasonCount
                    }
                  </dd>
                </div>
              )}
            </dl>
          </section>
        </aside>
      </div>
    </article>
  );
}

export default MediaPage;