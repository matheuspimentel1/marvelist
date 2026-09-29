export function formatRelativeTime(
  date: string,
) {
  const now =
    Date.now();

  const target =
    new Date(date).getTime();

  const differenceSeconds =
    Math.round(
      (target - now) / 1000,
    );

  const formatter =
    new Intl.RelativeTimeFormat(
      "en",
      {
        numeric: "auto",
      },
    );

  const absoluteSeconds =
    Math.abs(
      differenceSeconds,
    );

  if (absoluteSeconds < 60) {
    return formatter.format(
      differenceSeconds,
      "second",
    );
  }

  const minutes =
    Math.round(
      differenceSeconds / 60,
    );

  if (
    Math.abs(minutes) < 60
  ) {
    return formatter.format(
      minutes,
      "minute",
    );
  }

  const hours =
    Math.round(
      differenceSeconds /
        3600,
    );

  if (
    Math.abs(hours) < 24
  ) {
    return formatter.format(
      hours,
      "hour",
    );
  }

  const days =
    Math.round(
      differenceSeconds /
        86400,
    );

  if (
    Math.abs(days) < 7
  ) {
    return formatter.format(
      days,
      "day",
    );
  }

  const weeks =
    Math.round(
      differenceSeconds /
        604800,
    );

  if (
    Math.abs(weeks) < 5
  ) {
    return formatter.format(
      weeks,
      "week",
    );
  }

  const months =
    Math.round(
      differenceSeconds /
        2629800,
    );

  if (
    Math.abs(months) < 12
  ) {
    return formatter.format(
      months,
      "month",
    );
  }

  const years =
    Math.round(
      differenceSeconds /
        31557600,
    );

  return formatter.format(
    years,
    "year",
  );
}