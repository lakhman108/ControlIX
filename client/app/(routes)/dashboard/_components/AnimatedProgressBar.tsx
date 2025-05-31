import { useEffect, useState } from "react";

export default function AnimatedProgressBar({ target = 75, duration = 800 }) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    const increment = target / (duration / 10); 
    const interval = window.setInterval(() => {
      setValue((prev) => {
        if (prev + increment >= target) {
          window.clearInterval(interval);
          return target;
        }
        return prev + increment;
      });
    }, 10);
    return () => window.clearInterval(interval);
  }, [target, duration]);

  return (
    <div className="mt-4">
      <div className="flex justify-between mb-1">
        <span>Monthly Goal</span>
        <span>{Math.round(value)}%</span>
      </div>
      <progress
        className="progress progress-success w-full"
        value={value}
        max={100}
      ></progress>
    </div>
  );
}