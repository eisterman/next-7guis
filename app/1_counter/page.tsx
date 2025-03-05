"use client";

import { useState } from "react";

export default function Counter() {
  const [state, setState] = useState(0);

  return (
    <div className={"text-center"}>
      <div className="stats shadow-lg">
        <div className="stat">
          <div className="stat-title">1. Counter</div>
          <div className="stat-value">{state}</div>
          <button onClick={() => setState(state + 1)} className={"btn"}>Count</button>
        </div>
      </div>
    </div>
  );
}