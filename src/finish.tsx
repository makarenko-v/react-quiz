import { Button } from "./shared/ui/button";

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
    <div className="text-3xl text-center flex flex-col gap-8">
      <p>
        <span>{emoji}</span> You scored <strong>{points}</strong> out of{" "}
        {totalPoints} ({percentage}%)
      </p>
      <Button onClick={onRestart}>Restart</Button>
    </div>
  );
}
