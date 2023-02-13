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

  const yMax = 250;
  const yMid = yMax / 2;
  const y1 = 2;
  const y2 = yMid - 60;
  const y3 = yMid - 25;
  const y4 = yMid - 5;
  const y5 = yMid + 5;
  const y6 = yMid + 25;
  const y7 = yMid + 60;
  const y8 = yMax - y1;

  const xMax = 100;
  const xMid = xMax / 2;
  const x1 = xMid - 10;
  const x2 = xMid + 10;
  const xc1 = xMid - 2;
  const xc2 = xMid + 2;

  const glassThickness = 3;
  const sandHeight = yMid - 10 - glassThickness;

  const hourglassPath =
    `M 0 0 ` +
    `L 0 ${y1} ` +
    `C 0 ${y2} 0 ${y3} ${x1} ${y4} ` +
    `C ${xc1} ${yMid} ${xc1} ${yMid} ${x1} ${y5} ` +
    `C 0 ${y6} 0 ${y7} 0 ${y8} ` +
    `L 0 ${yMax} ` +
    `L ${xMax} ${yMax} ` + // bottom line
    `L ${xMax} ${y8} ` +
    `C ${xMax} ${y7} ${xMax} ${y6} ${x2} ${y5} ` +
    `C ${xc2} ${yMid} ${xc2} ${yMid} ${x2} ${y4} ` +
    `C ${xMax} ${y3} ${xMax} ${y2} ${xMax} ${y1} ` +
    `L ${xMax} 0 ` +
    `Z`;

  return (
    <div className="p-2 flex flex-col gap-4">
      <svg
        shapeRendering="geometricPrecision"
        viewBox={`0 0 ${xMax} ${yMax}`}
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
              strokeWidth={glassThickness * 2}
            />
          </mask>

          <path d={hourglassPath} className="stroke-none fill-white" />

          <rect
            x={0}
            y={lerp(yMid - sandHeight, yMid, 1 - percentRemaining)}
            width={xMax}
            height={lerp(0, sandHeight, percentRemaining)}
            mask="url(#hourglass)"
            className="stroke-none fill-orange-300"
          />
          <rect
            x={0}
            y={lerp(
              yMax - glassThickness - sandHeight,
              yMax - glassThickness,
              percentRemaining
            )}
            height={lerp(0, sandHeight, 1 - percentRemaining)}
            width={xMax}
            mask="url(#hourglass)"
            className="stroke-none fill-orange-300"
          />
          <line
            x1={xMid}
            y1={yMid}
            x2={xMid}
            y2={yMax}
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
