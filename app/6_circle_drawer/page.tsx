"use client";

import { useRef, useState, useEffect, useCallback, MouseEvent } from "react";
import { useDarkMode } from 'usehooks-ts';

type Circle = {
  x: number,
  y: number,
  r: number,
};

export default function CircleDrawer() {
  const { isDarkMode } = useDarkMode();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [circles, setCircles] = useState<Circle[]>([]);

  const renderCircles = useCallback(() => {
    if (canvas.current === null) return;
    const ctx = canvas.current.getContext("2d");
    if (ctx === null) {
      alert("Error opening canvas context");
      return;
    }
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.strokeStyle = isDarkMode ? "white" : "black";
    for (const { x, y, r } of circles) {
      ctx.beginPath();
      console.log(`DRAW AT ${x},${y} with R ${r}`);
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      ctx.stroke();
    }
  }, [circles, isDarkMode]);

  useEffect(() => {
    if (canvas.current === null) return;
    renderCircles();
  }, [renderCircles]);

  function isPointInCircle(x: number, y: number, c: Circle): boolean {
    return Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2) <= c.r * c.r;
  }

  function onCanvasClick(e: MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const alreadyCircle = circles.find((c) => isPointInCircle(x, y, c));
    if (alreadyCircle === undefined) {
      setCircles((circles) => [...circles, { x: x, y: y, r: 30 }]);
    } else {
      console.log(`SELECTED CIRCLE AT ${alreadyCircle.x},${alreadyCircle.y} WITH R ${alreadyCircle.r}`);
    }
  }

  return (
    <div className={"card card-border shadow-xl w-min mx-auto"}>
      <div className={"card-body"}>
        <h2 className={"card-title"}>6. Circle Drawer</h2>
        <div className={"flex justify-center gap-2"}>
          <button className={"btn btn-sm"}>Undo</button>
          <button className={"btn btn-sm"}>Redo</button>
        </div>
        <canvas ref={canvas} width={400} height={200} className={"border w-[400px] h-[200px]"} onClick={onCanvasClick}/>
      </div>
    </div>
  );
}