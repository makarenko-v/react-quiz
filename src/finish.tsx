interface FinishProps {
  points: number;
  totalPoints: number;
  onRestart: () => void;
}

export function Finish({ points, totalPoints, onRestart }: FinishProps) {
  const percentage = Math.round((points / totalPoints) * 100);

  let emoji: string;

  if (percentage >= 90) {
    emoji = "🥇";
  } else if (percentage >= 70) {
    emoji = "🎉";
  } else if (percentage >= 50) {
    emoji = "🙃";
  } else {
    emoji = "🤦‍♂️";
  }

  return (
    <div className="text-3xl text-center">
      <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
      {totalPoints} ({percentage}%)
      <button onClick={onRestart} type="button">
        restart
      </button>
    </div>
  );
}
