import {
  useEffect,
  useState,
  type ChangeEvent,
} from "react";

import MediaCard from "../components/media/MediaCard";

import {
  getMediaCatalog,
} from "../services/mediaService";

import type {
  Media,
  MediaFormat,
  MediaReleaseStatus,
} from "../types/media";

import "../styles/browse.css";

type FormatFilter =
  | MediaFormat
  | "all";

type ReleaseStatusFilter =
  | MediaReleaseStatus
  | "all";

function BrowsePage() {
  const [media, setMedia] =
    useState<Media[]>([]);

  const [search, setSearch] =
    useState("");

  const [format, setFormat] =
    useState<FormatFilter>("all");

  const [
    releaseStatus,
    setReleaseStatus,
  ] =
    useState<ReleaseStatusFilter>(
      "all",
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const timeoutId =
      window.setTimeout(() => {
        async function loadMedia() {
          try {
            setLoading(true);
            setError(null);

            const catalog =
              await getMediaCatalog({
                search,
                format,
                releaseStatus,
              });

            setMedia(catalog);
          } catch {
            setError(
              "Unable to load the catalog.",
            );
          } finally {
            setLoading(false);
          }
        }

        void loadMedia();
      }, 300);

    return () => {
      window.clearTimeout(
        timeoutId,
      );
    };
  }, [
    search,
    format,
    releaseStatus,
  ]);

  function clearFilters() {
    setSearch("");
    setFormat("all");
    setReleaseStatus("all");
  }

  function handleFormatChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;

    if (
      value === "all" ||
      value === "movie" ||
      value === "tv"
    ) {
      setFormat(value);
    }
  }

  function handleReleaseStatusChange(
    event: ChangeEvent<HTMLSelectElement>,
  ) {
    const value = event.target.value;

    if (
      value === "all" ||
      value === "released" ||
      value === "releasing" ||
      value === "not_yet_released"
    ) {
      setReleaseStatus(value);
    }
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    format !== "all" ||
    releaseStatus !== "all";

  return (
    <section className="browse-page">
      <header className="browse-header">
        <div>
          <h1>Browse Marvel</h1>

          <p>
            Discover Marvel movies
            and TV shows.
          </p>
        </div>
      </header>

      <div className="browse-controls">
        <div className="browse-search">
          <label htmlFor="media-search">
            Search
          </label>

          <div className="browse-search-input">
            <input
              id="media-search"
              type="search"
              placeholder="Search movies and TV shows..."
              value={search}
              onChange={(event) =>
                setSearch(
                  event.target.value,
                )
              }
            />

            <span aria-hidden="true">
              🔍
            </span>
          </div>
        </div>

        <div className="browse-filter">
          <label htmlFor="format-filter">
            Format
          </label>

          <select
            id="format-filter"
            value={format}
            onChange={handleFormatChange}
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
        </div>

        <div className="browse-filter">
          <label htmlFor="release-filter">
            Release Status
          </label>

          <select
            id="release-filter"
            value={releaseStatus}
            onChange={handleReleaseStatusChange}
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
        </div>

        {hasActiveFilters && (
          <button
            type="button"
            className="browse-clear-button"
            onClick={clearFilters}
          >
            Clear Filters
          </button>
        )}
      </div>

      <div className="browse-results-header">
        <h2>
          {hasActiveFilters
            ? "Results"
            : "Latest Releases"}
        </h2>

        {!loading && !error && (
          <span>
            {media.length}{" "}
            {media.length === 1
              ? "title"
              : "titles"}
          </span>
        )}
      </div>

      {loading && (
        <div className="browse-state">
          <p>Loading catalog...</p>
        </div>
      )}

      {!loading && error && (
        <div className="browse-state">
          <h2>
            Something went wrong
          </h2>

          <p>{error}</p>
        </div>
      )}

      {!loading &&
        !error &&
        media.length === 0 && (
          <div className="browse-state">
            <h2>
              No titles found
            </h2>

            <p>
              Try changing your
              search or filters.
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                className="browse-clear-button"
                onClick={
                  clearFilters
                }
              >
                Clear Filters
              </button>
            )}
          </div>
        )}

      {!loading &&
        !error &&
        media.length > 0 && (
          <div className="media-grid">
            {media.map((item) => (
              <MediaCard
                key={item.id}
                media={item}
              />
            ))}
          </div>
        )}
    </section>
  );
}

export default BrowsePage;