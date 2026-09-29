import "./ProgressBar.css";

interface ProgressBarProps {
  current: number;
  total: number;
}

function ProgressBar({
  current,
  total,
}: ProgressBarProps) {
  const percentage =
    total === 0
      ? 0
      : Math.round(
          (current / total) *
            100,
        );

  return (
    <div className="progress">
      <div className="progress-header">
        <span>
          {current} / {total}
        </span>

        <span>
          {percentage}%
        </span>
      </div>

      <div
        className="progress-track"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <div
          className="progress-value"
          style={{
            width:
              `${percentage}%`,
          }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;