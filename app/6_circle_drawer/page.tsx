"use client";

import { ChangeEvent, MouseEvent, useCallback, useEffect, useRef, useState } from "react";
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

  const [selectedCircle, setSelectedCircle] = useState<number | null>(null);

  const renderCircles = useCallback(() => {
    if (canvas.current === null) return;
    const ctx = canvas.current.getContext("2d");
    if (ctx === null) {
      alert("Error opening canvas context");
      return;
    }
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.strokeStyle = isDarkMode ? "white" : "black";
    ctx.fillStyle = "gray";
    for (const [i, { x, y, r }] of circles.entries()) {
      ctx.beginPath();
      console.log(`DRAW AT ${x},${y} with R ${r}`);
      ctx.arc(x, y, r, 0, 2 * Math.PI);
      if (i === selectedCircle) {
        ctx.fill();
      }
      ctx.stroke();
    }
  }, [circles, isDarkMode, selectedCircle]);

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
    const alreadyCircle = circles.entries().find(([_i, c]) => isPointInCircle(x, y, c));
    if (alreadyCircle === undefined) {
      setCircles((circles) => [...circles, { x: x, y: y, r: 30 }]);
    } else {
      const [i, c] = alreadyCircle;
      console.log(`SELECTED CIRCLE ${i} AT ${c.x},${c.y} WITH R ${c.r}`);
      setSelectedCircle(i);
      openDialogMenu(e);
    }
  }

  const [dialogPos, setDialogPos] = useState({ left: 0, top: 0 });
  const dialog = useRef<HTMLDialogElement>(null);

  function openDialogMenu<T>(e: MouseEvent<T>) {
    const x = e.pageX;
    const y = e.pageY;
    setDialogPos({ left: x, top: y });
    dialog.current?.showModal();
  }

  function radInputOnChange(e: ChangeEvent<HTMLInputElement>) {
    setCircles((cir) => Array.from(cir.entries().map(([i, c]) => {
      if (i === selectedCircle) return { ...c, r: Number(e.target.value) };
      else return c;
    })));
  }

  const [changingRad, setChangingRad] = useState(false);

  function dialogContent() {
    if (changingRad && selectedCircle) {
      return (
        <input type="range" className={"range w-64"} min="0" max="100" value={circles[selectedCircle].r}
               onChange={radInputOnChange}/>
      );
    } else {
      return (
        <ul>
          <li><a onClick={() => setChangingRad(true)}>Change Diameter</a></li>
        </ul>
      );
    }
  }

  function onDialogClose() {
    setChangingRad(false);
    setSelectedCircle(null);
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
        <dialog ref={dialog} className="modal backdrop:hidden" onClose={onDialogClose}>
          <div className="modal-box menu dropdown-content bg-base-100 rounded-box z-1 w-fit p-2 shadow-sm absolute"
               style={dialogPos}>
            {dialogContent()}
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </div>
    </div>
  );
}