import {
  useEffect,
  useState,
} from "react";

import {
  getSeriesProgress,
} from "../../services/episodeProgressService";

import type {
  Media,
} from "../../types/media";

import type {
  UserMediaStatus,
} from "../../types/userMedia";

import ProgressBar
  from "./ProgressBar";

interface MediaProgressProps {
  userId: string;
  media: Media;
  status: UserMediaStatus;
}

function MediaProgress({
  userId,
  media,
  status,
}: MediaProgressProps) {
  const [current, setCurrent] =
    useState(
      media.format === "movie" &&
        status === "completed"
        ? 1
        : 0,
    );

  const [total, setTotal] =
    useState(
      media.format === "movie"
        ? 1
        : 0,
    );

  useEffect(() => {
    async function loadProgress() {
      if (
        media.format === "movie"
      ) {
        setCurrent(
          status === "completed"
            ? 1
            : 0,
        );

        setTotal(1);

        return;
      }

      try {
        const progress =
          await getSeriesProgress(
            userId,
            media.id,
          );

        setCurrent(
          progress.watchedEpisodes,
        );

        setTotal(
          progress.totalEpisodes,
        );
      } catch {
        setCurrent(0);
        setTotal(0);
      }
    }

    void loadProgress();
  }, [
    userId,
    media.id,
    media.format,
    status,
  ]);

  return (
    <ProgressBar
      current={current}
      total={total}
    />
  );
}

export default MediaProgress;