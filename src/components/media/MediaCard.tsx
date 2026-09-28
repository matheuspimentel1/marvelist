import type { Media } from "../../types/media";

import "./MediaCard.css";

interface MediaCardProps {
  media: Media;
}

function MediaCard({
  media,
}: MediaCardProps) {
  const releaseYear =
    media.release_date
      ? new Date(
          `${media.release_date}T00:00:00`,
        ).getFullYear()
      : null;

  const formatLabel =
    media.format === "movie"
      ? "Movie"
      : "TV Show";

  return (
    <article className="media-card">
      <div className="media-card-poster">
        {media.poster_url ? (
          <img
            src={media.poster_url}
            alt={`${media.title} poster`}
            loading="lazy"
          />
        ) : (
          <div className="media-card-placeholder">
            <span>
              {media.title
                .charAt(0)
                .toUpperCase()}
            </span>
          </div>
        )}

        <span className="media-card-format">
          {formatLabel}
        </span>
      </div>

      <div className="media-card-content">
        <h2>{media.title}</h2>

        <div className="media-card-meta">
          {releaseYear && (
            <span>{releaseYear}</span>
          )}

          <span>
            {formatLabel}
          </span>
        </div>
      </div>
    </article>
  );
}

export default MediaCard;