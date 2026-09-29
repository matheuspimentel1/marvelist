import {
  useEffect,
  useState,
} from "react";

import UserMediaListItem from "../components/media/UserMediaListItem";

import { useAuth } from "../features/auth/useAuth";

import {
  getUserMediaList,
} from "../services/userMediaService";

import type {
  MediaFormat,
  MediaReleaseStatus,
} from "../types/media";

import type {
  UserMediaStatus,
  UserMediaWithMedia,
} from "../types/userMedia";

import "../styles/video-list.css";

type StatusFilter =
  | UserMediaStatus
  | "all";

type FormatFilter =
  | MediaFormat
  | "all";

type ReleaseStatusFilter =
  | MediaReleaseStatus
  | "all";

const sections: Array<{
  status: UserMediaStatus;
  title: string;
}> = [
  {
    status: "watching",
    title: "Watching",
  },
  {
    status: "plan_to_watch",
    title: "Plan to Watch",
  },
  {
    status: "completed",
    title: "Completed",
  },
];

function VideoListPage() {
  const { user } = useAuth();

  const [items, setItems] =
    useState<UserMediaWithMedia[]>(
      [],
    );

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [formatFilter, setFormatFilter] =
    useState<FormatFilter>("all");

  const [
    releaseStatusFilter,
    setReleaseStatusFilter,
  ] =
    useState<ReleaseStatusFilter>(
      "all",
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadList() {
      if (!user) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const list =
          await getUserMediaList(
            user.id,
          );

        setItems(list);
      } catch {
        setError(
          "Unable to load your video list.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadList();
  }, [user]);

  function handleItemUpdate(
    mediaId: string,
    status: UserMediaStatus,
  ) {
    setItems(
      (current) =>
        current.map(
          (item) =>
            item.media_id ===
            mediaId
              ? {
                  ...item,
                  status,
                }
              : item,
        ),
    );
  }

  function handleItemRemove(
    mediaId: string,
  ) {
    setItems(
      (current) =>
        current.filter(
          (item) =>
            item.media_id !==
            mediaId,
        ),
    );
  }

  function clearFilters() {
    setStatusFilter("all");
    setFormatFilter("all");

    setReleaseStatusFilter(
      "all",
    );
  }

  const filteredItems =
    items.filter(
      (item) => {
        if (
          statusFilter !==
            "all" &&
          item.status !==
            statusFilter
        ) {
          return false;
        }

        if (
          formatFilter !==
            "all" &&
          item.media.format !==
            formatFilter
        ) {
          return false;
        }

        if (
          releaseStatusFilter !==
            "all" &&
          item.media
            .release_status !==
            releaseStatusFilter
        ) {
          return false;
        }

        return true;
      },
    );

  const hasActiveFilters =
    statusFilter !== "all" ||
    formatFilter !== "all" ||
    releaseStatusFilter !== "all";

  if (loading) {
    return (
      <p>
        Loading your list...
      </p>
    );
  }

  if (error) {
    return (
      <div>
        <h1>
          Something went wrong
        </h1>

        <p>{error}</p>
      </div>
    );
  }

  return (
    <section className="video-list-page">
      <header className="video-list-header">
        <h1>Video List</h1>

        <p>
          Track what you're watching
          across the Marvel universe.
        </p>
      </header>

      <div className="video-list-layout">
        <aside className="video-list-filters">
          <h2>Filters</h2>

          <label>
            Status

            <select
              value={
                statusFilter
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                if (
                  value ===
                    "all" ||
                  value ===
                    "watching" ||
                  value ===
                    "plan_to_watch" ||
                  value ===
                    "completed"
                ) {
                  setStatusFilter(
                    value,
                  );
                }
              }}
            >
              <option value="all">
                All
              </option>

              <option value="watching">
                Watching
              </option>

              <option value="plan_to_watch">
                Plan to Watch
              </option>

              <option value="completed">
                Completed
              </option>
            </select>
          </label>

          <label>
            Format

            <select
              value={
                formatFilter
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                if (
                  value ===
                    "all" ||
                  value ===
                    "movie" ||
                  value ===
                    "tv"
                ) {
                  setFormatFilter(
                    value,
                  );
                }
              }}
            >
              <option value="all">
                All
              </option>

              <option value="movie">
                Movie
              </option>

              <option value="tv">
                TV Show
              </option>
            </select>
          </label>

          <label>
            Release Status

            <select
              value={
                releaseStatusFilter
              }
              onChange={(event) => {
                const value =
                  event.target.value;

                if (
                  value ===
                    "all" ||
                  value ===
                    "released" ||
                  value ===
                    "releasing" ||
                  value ===
                    "not_yet_released"
                ) {
                  setReleaseStatusFilter(
                    value,
                  );
                }
              }}
            >
              <option value="all">
                All
              </option>

              <option value="released">
                Released
              </option>

              <option value="releasing">
                Releasing
              </option>

              <option value="not_yet_released">
                Not Yet Released
              </option>
            </select>
          </label>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={clearFilters}
            >
              Clear Filters
            </button>
          )}
        </aside>

        <main className="video-list-content">
          {items.length === 0 ? (
            <div className="video-list-empty">
              <h2>
                Your list is empty
              </h2>

              <p>
                Add movies and TV
                shows from Browse.
              </p>
            </div>
          ) : filteredItems.length ===
            0 ? (
            <div className="video-list-empty">
              <h2>
                No titles found
              </h2>

              <p>
                Try changing your
                filters.
              </p>
            </div>
          ) : (
            sections.map(
              (section) => {
                if (
                  statusFilter !==
                    "all" &&
                  statusFilter !==
                    section.status
                ) {
                  return null;
                }

                const sectionItems =
                  filteredItems.filter(
                    (item) =>
                      item.status ===
                      section.status,
                  );

                if (
                  sectionItems.length ===
                  0
                ) {
                  return null;
                }

                return (
                  <section
                    key={
                      section.status
                    }
                    className="video-list-section"
                  >
                    <div className="video-list-section-header">
                      <h2>
                        {
                          section.title
                        }
                      </h2>

                      <span>
                        {
                          sectionItems.length
                        }
                      </span>
                    </div>

                    <div className="video-list-items">
                      {sectionItems.map(
                        (item) => (
                          <UserMediaListItem
                            key={
                              item.media_id
                            }
                            item={item}
                            userId={
                              user!.id
                            }
                            onUpdate={
                              handleItemUpdate
                            }
                            onRemove={
                              handleItemRemove
                            }
                          />
                        ),
                      )}
                    </div>
                  </section>
                );
              },
            )
          )}
        </main>
      </div>
    </section>
  );
}

export default VideoListPage;