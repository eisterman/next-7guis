"use client";

import { ChangeEvent, useEffect, useState } from "react";

export default function TimerPause() {
  const [{ duration, elapsed }, setTimer] = useState({
    duration: 150,
    elapsed: 0
  });
  const elapsedSec = (Math.min(elapsed, duration) / 10).toFixed(1);

  useEffect(() => {
    const interval = setInterval(() => setTimer((t) => {
      if (t.elapsed >= t.duration) return t;
      return { ...t, elapsed: t.elapsed + 1 };
    }), 100);
    return () => clearInterval(interval);
  }, []);

  function onSliderChange(e: ChangeEvent<HTMLInputElement>) {
    setTimer({ duration: Number(e.target.value), elapsed });
  }

  return (
    <div className={"card card-border shadow-xl w-96 mx-auto"}>
      <div className={"card-body"}>
        <h2 className={"card-title"}>4. Timer</h2>
        <div className={"grid grid-cols-[min-content_auto] gap-2"}>
          <p className={"text-nowrap"}>Elapsed Time:</p>
          <progress className="progress my-1 h-auto" value={elapsed} max={duration}></progress>
          <p className={"col-span-2"}>{elapsedSec}s</p>
          <p>Duration:</p>
          <input type="range" min="0" max="300" value={duration} onChange={onSliderChange}
                 className={"range range-xs"}/>
        </div>
        <div className={"card-actions"}>
          <button className={"btn btn-block btn-sm"} onClick={() => setTimer({ duration, elapsed: 0 })}>Reset</button>
        </div>
      </div>
    </div>
  );
}