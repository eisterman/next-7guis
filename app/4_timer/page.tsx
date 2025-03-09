"use client";

import { ChangeEvent, useEffect, useState } from "react";

export default function Timer() {
  const [duration, setDuration] = useState(150);
  const [elapsed, setElapsed] = useState(0);
  // In the example there is this logic, but on the problem description talk about suspending and resuming the timer.
  // I'll make a second version with effective timer suspension.
  const elapsedSec = (Math.min(elapsed, duration) / 10).toFixed(1);

  useEffect(() => {
    const interval = setInterval(() => setElapsed((p) => p + 1), 100);
    return () => clearInterval(interval);
  }, []);

  function onSliderChange(e: ChangeEvent<HTMLInputElement>) {
    setDuration(Number(e.target.value));
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
          <button className={"btn btn-block btn-sm"} onClick={() => setElapsed(0)}>Reset</button>
        </div>
      </div>
    </div>
  );
}