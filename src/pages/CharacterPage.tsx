import {
  useEffect,
  useState,
} from "react";

import {
  Link,
  useParams,
} from "react-router";

import MediaCard
  from "../components/media/MediaCard";

import {
  getCharacterDetailsBySlug,
} from "../services/characterService";

import type {
  CharacterDetails,
} from "../types/character";

import "../styles/character-page.css";

function formatRelation(
  relation: string,
) {
  return relation
    .replaceAll("_", " ")
    .replace(
      /\b\w/g,
      (letter) =>
        letter.toUpperCase(),
    );
}

function CharacterPage() {
  const { slug } = useParams();

  const [details, setDetails] =
    useState<CharacterDetails | null>(
      null,
    );

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function loadCharacter() {
      if (!slug) {
        setError(
          "Invalid character URL.",
        );

        setLoading(false);
        return;
      }

      try {
        const data =
          await getCharacterDetailsBySlug(
            slug,
          );

        setDetails(data);
      } catch {
        setError(
          "Unable to load this character.",
        );
      } finally {
        setLoading(false);
      }
    }

    void loadCharacter();
  }, [slug]);

  if (loading) {
    return (
      <p>Loading character...</p>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!details) {
    return (
      <div className="character-state">
        <h1>
          Character not found
        </h1>

        <Link to="/browse">
          Back to Browse
        </Link>
      </div>
    );
  }

  const {
    character,
    media,
    relations,
  } = details;

  return (
    <article className="character-page">
      <section className="character-hero">
        <div className="character-image">
          {character.image_url ? (
            <img
              src={
                character.image_url
              }
              alt={
                character.name
              }
            />
          ) : (
            <span>
              {character.name
                .charAt(0)
                .toUpperCase()}
            </span>
          )}
        </div>

        <div>
          <h1>
            {character.name}
          </h1>

          {character.real_name && (
            <p className="character-real-name">
              {
                character.real_name
              }
            </p>
          )}

          {character.aliases.length >
            0 && (
            <p>
              <strong>
                Also known as:
              </strong>{" "}
              {character.aliases.join(
                ", ",
              )}
            </p>
          )}
        </div>
      </section>

      <div className="character-layout">
        <main className="character-main">
          <section className="character-section">
            <h2>Background</h2>

            <p>
              {character.description ||
                "No background information available yet."}
            </p>
          </section>

          <section className="character-section">
            <h2>Appearances</h2>

            {media.length === 0 ? (
              <p>
                No appearances
                registered yet.
              </p>
            ) : (
              <div className="character-media-grid">
                {media.map(
                  (item) => (
                    <MediaCard
                      key={item.id}
                      media={item}
                    />
                  ),
                )}
              </div>
            )}
          </section>

          <section className="character-section">
            <h2>Relationships</h2>

            {relations.length ===
            0 ? (
              <p>
                No relationships
                registered yet.
              </p>
            ) : (
              <div className="character-relations">
                {relations.map(
                  (relation) => (
                    <Link
                      key={
                        relation.id
                      }
                      to={
                        `/character/${relation.character.slug}`
                      }
                      className="character-relation"
                    >
                      <strong>
                        {
                          relation
                            .character
                            .name
                        }
                      </strong>

                      <span>
                        {formatRelation(
                          relation.relationType,
                        )}
                      </span>
                    </Link>
                  ),
                )}
              </div>
            )}
          </section>
        </main>

        <aside className="character-sidebar">
          <section className="character-section">
            <h2>Information</h2>

            <dl>
              <div>
                <dt>Real Name</dt>
                <dd>
                  {character.real_name ||
                    "Unknown"}
                </dd>
              </div>

              <div>
                <dt>Birth Date</dt>
                <dd>
                  {character.birth_date ||
                    "Unknown"}
                </dd>
              </div>

              <div>
                <dt>Height</dt>
                <dd>
                  {character.height_cm
                    ? `${character.height_cm} cm`
                    : "Unknown"}
                </dd>
              </div>

              <div>
                <dt>Weight</dt>
                <dd>
                  {character.weight_kg
                    ? `${character.weight_kg} kg`
                    : "Unknown"}
                </dd>
              </div>
            </dl>
          </section>
        </aside>
      </div>
    </article>
  );
}

export default CharacterPage;