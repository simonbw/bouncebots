import React, { useEffect, useState } from "react";
import { clamp, lerp } from "../utility/MathUtil";
import { classNames } from "./classNames";

export function Hourglass() {
  const [duration, setDuration] = useState(60);

  const { startTimer, stopTimer, percentRemaining, timeRemaining } = useTimer({
    duration,
    onEnd: () => console.log("timer ended"),
  });

  const [flipped, setFlipped] = useState(false);

  const hourglassPath = `M 0 0 L 0 100 L 48 150 L 0 200 L 0 300 L 100 300 L 100 200 L 52 150 L 100 100 L 100 0 Z`;

  return (
    <div className="p-2 flex flex-col gap-4">
      <svg
        shapeRendering="geometricPrecision"
        viewBox="0 0 100 300"
        onClick={() => {
          setFlipped(!flipped);
          startTimer();
        }}
        className={classNames(
          "inline-block cursor-pointer hover:scale-105 active:scale-110 transition-transform origin-center",
          flipped ? "rotate-180" : ""
        )}
      >
        <g className={classNames("origin-center", flipped ? "rotate-180" : "")}>
          <mask id="hourglass" maskUnits="userSpaceOnUse">
            <path
              d={hourglassPath}
              fill={"white"}
              stroke="black"
              strokeWidth={5}
            />
          </mask>

          <path d={hourglassPath} className="stroke-none fill-white" />

          <rect
            x={0}
            y={lerp(1, 150, 1 - percentRemaining)}
            width={100}
            height={lerp(0, 140, percentRemaining)}
            mask="url(#hourglass)"
            className="stroke-none fill-orange-300"
          />
          <rect
            x={0}
            y={lerp(160, 300, percentRemaining)}
            height={lerp(0, 140, 1 - percentRemaining)}
            width={100}
            mask="url(#hourglass)"
            className="stroke-none fill-orange-300"
          />
          <line
            x1={50}
            y1={150}
            x2={50}
            y2={300}
            mask="url(#hourglass)"
            className={classNames(
              "stroke-orange-300 transition-all duration-500",
              timeRemaining > 0.4 ? "stroke-[3]" : "stroke-0"
            )}
          />
        </g>
      </svg>

      <label className="block text-gray-700 text-xs">
        <div className="flex items-end">
          <input
            className="px-2 py-1 rounded inline-block w-12"
            type="number"
            defaultValue={duration}
            onChange={(event) => {
              setDuration(Number(event.target.value));
              stopTimer();
            }}
          />
          <span className="inline-block pl-1"> seconds</span>
        </div>
      </label>
    </div>
  );
}

interface TimerOptions {
  duration?: number;
  onEnd?: () => void;
}
function useTimer({ duration = 60, onEnd }: TimerOptions) {
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(() => Date.now());

  const started = startedAt != null;

  useEffect(() => {
    let ref: number;
    if (started) {
      const tick = () => {
        const now = Date.now();
        if (now - startedAt < duration * 1000) {
          setCurrentTime(now);
          ref = requestAnimationFrame(tick);
        } else {
          setStartedAt(null);
          onEnd?.();
        }
      };
      tick();
    }

    return () => {
      console.log("cancelling animation frame");
      cancelAnimationFrame(ref);
    };
  }, [startedAt, duration]);

  const timeRemaining = started
    ? clamp(duration - (currentTime - startedAt) / 1000, 0, duration)
    : 0;
  const percentRemaining = timeRemaining / duration;

  return {
    startTimer: () => setStartedAt(Date.now()),
    stopTimer: () => setStartedAt(null),
    timerStarted: started,
    timeRemaining,
    percentRemaining,
  };
}
