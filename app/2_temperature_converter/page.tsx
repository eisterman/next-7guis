"use client";

import { ChangeEvent, useState } from "react";

function isNumeric(n: string): boolean {
  return !isNaN(parseFloat(n)) && isFinite(Number(n));
}

export default function Page() {
  const [celsius, setCelsius] = useState("");
  const [fahrenheit, setFahrenheit] = useState("");
  // C = (F - 32) * (5/9)
  // F = C * (9/5) + 32.

  function brackgroundClass(mine: string, other: string): string {
    if (mine === '') return '';  // No BG if I'm empty
    if (!isNumeric(mine)) return "bg-blue-400"; // Cyan if I'm not numeric
    if (!isNumeric(other)) return "bg-gray-400"; // Gray if I'm OK but other not (I'm unanchored)
    return ''; // No BG if all fine
  }

  function onCelsiusChange(e: ChangeEvent<HTMLInputElement>) {
    setCelsius(e.target.value);
    if (!isNumeric(celsius)) return;
    const c = parseFloat(celsius);
    setFahrenheit(Math.round(c * (9 / 5) + 32).toString());
  }

  function onFahrenheitChange(e: ChangeEvent<HTMLInputElement>) {
    setFahrenheit(e.target.value);
    if (!isNumeric(fahrenheit)) return;
    const f = parseFloat(fahrenheit);
    setCelsius(Math.round((f - 32) * (5 / 9)).toString());
  }

  return (
    <div className={"text-center"}>
      <input
        className={`input w-24 mx-2 ${brackgroundClass(celsius, fahrenheit)}`}
        type={"text"}
        value={celsius}
        onChange={onCelsiusChange}
      />
      <span>Celsius = </span>
      <input
        className={`input w-24 mx-2 ${brackgroundClass(fahrenheit, celsius)}`}
        type={"text"}
        value={fahrenheit}
        onChange={onFahrenheitChange}
      />
      <span>Fahreneit</span>
    </div>
  );
}