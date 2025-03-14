"use client";

import {
  ChangeEvent,
  MouseEvent,
  Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState
} from "react";
import { useDarkMode } from 'usehooks-ts';

type Circle = {
  x: number,
  y: number,
  r: number,
};

function isPointInCircle(x: number, y: number, c: Circle): boolean {
  return Math.pow(x - c.x, 2) + Math.pow(y - c.y, 2) <= c.r * c.r;
}

function CircleDialog({ ref, position, rangeValue, onChangeRangeValue, onClose }: {
  ref?: Ref<{
    openModal: () => void
  }>,
  position: [number, number],
  rangeValue: number,
  onChangeRangeValue: (e: ChangeEvent<HTMLInputElement>) => void,
  onClose: (e: MouseEvent<HTMLDialogElement>) => void
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [changing, setChanging] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      openModal() {
        dialog.current?.showModal();
      }
    };
  });

  function onDialogClose(e: MouseEvent<HTMLDialogElement>) {
    setChanging(false);
    onClose(e);
  }

  return (
    <dialog ref={dialog} className="modal backdrop:hidden" onClose={onDialogClose}>
      <div className="modal-box menu dropdown-content bg-base-100 rounded-box z-1 w-fit p-2 shadow-sm absolute"
           style={{ left: position[0], top: position[1] }}>
        {changing ?
          <input type="range" className={"range w-64"} min="0" max="100" value={rangeValue}
                 onChange={onChangeRangeValue}/>
          :
          <ul>
            <li><a onClick={() => setChanging(true)}>Change Diameter</a></li>
          </ul>
        }
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}

// FIXME: Se al posto di method="dialog" metto un onSubmit in cui flippo la variabile modale che tiene aperto il coso,
//   ho risolto il problema! La cosa sbatti e' che devo passare value e setValue dato che la variabile e' bidirezionale.
//   Questa sembra essere "la react way"

function CircleCanvas({ circles, onChange }: { circles: Circle[], onChange: (c: Circle[]) => void }) {
  const { isDarkMode } = useDarkMode();
  const canvas = useRef<HTMLCanvasElement>(null);
  const [selectedCircle, setSelectedCircle] = useState<number | null>(null);
  const dialog = useRef<{ openModal: () => void }>(null);

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

  function onCanvasClick(e: MouseEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const alreadyCircle = circles.entries().find(([_i, c]) => isPointInCircle(x, y, c));
    if (alreadyCircle === undefined) {
      onChange([...circles, { x: x, y: y, r: 30 }]);
    } else {
      const [i, c] = alreadyCircle;
      console.log(`SELECTED CIRCLE ${i} AT ${c.x},${c.y} WITH R ${c.r}`);
      setSelectedCircle(i);
      dialog.current?.openModal();
    }
  }

  return (
    <>
      <canvas ref={canvas} width={400} height={200} className={"border w-[400px] h-[200px]"} onClick={onCanvasClick}/>
      <CircleDialog ref={dialog}/>
    </>
  );
}

export default function CircleDrawer() {
  const { isDarkMode } = useDarkMode();
  const canvas = useRef<HTMLCanvasElement>(null);
  // const [circles, setCircles] = useState<Circle[]>([]);
  const [circleStates, setCircleStates] = useState<Circle[][]>([[]]);
  const [actualState, setActualState] = useState<number>(0);

  const circles = circleStates[actualState];

  function setCircles(clbk: (prev: Circle[]) => Circle[], overwrite?: boolean) {
    const overwrt = overwrite ?? false;
    const newState = clbk(circles);
    if (overwrt) setCircleStates((p) => [newState, ...p.slice(actualState + 1)]);
    else setCircleStates((p) => [newState, ...p.slice(actualState)]);
    setActualState(0);
  }

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

  const [overwritingState, setOverwritingState] = useState<boolean>(false);

  function radInputOnChange(e: ChangeEvent<HTMLInputElement>) {
    setCircles((cir) => Array.from(cir.entries().map(([i, c]) => {
      if (i === selectedCircle) return { ...c, r: Number(e.target.value) };
      else return c;
    })), overwritingState);
    if (!overwritingState) setOverwritingState(true);
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
    setOverwritingState(false);
  }

  function undo() {
    if (actualState < circleStates.length - 1) setActualState((v) => ++v);
  }

  function redo() {
    if (actualState > 0) setActualState((v) => --v);
  }

  return (
    <div className={"card card-border shadow-xl w-min mx-auto"}>
      <div className={"card-body"}>
        <h2 className={"card-title"}>6. Circle Drawer</h2>
        <div className={"flex justify-center gap-2"}>
          <button className={"btn btn-sm"} onClick={undo}>Undo</button>
          <button className={"btn btn-sm"} onClick={redo}>Redo</button>
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