"use client";

import { ChangeEvent, useState } from "react";
import { parse, format } from "date-fns";

export default function Page() {
  const initialDate = format(new Date(), 'dd/MM/yyyy');
  const [flightType, setFlightType] = useState<string>("one-way");
  const [outbound, setOutbound] = useState<string>(initialDate);
  const [retflight, setRetflight] = useState<string>(initialDate);

  function isValidDate(d: Date) {
    return !Number.isNaN(d.getDate());
  }

  const outboundDate = parse(outbound, 'dd/MM/yyyy', new Date());
  const retflightDate = parse(retflight, 'dd/MM/yyyy', new Date());
  const outboundValid = isValidDate(outboundDate) || outbound === "";
  const retflightValid = isValidDate(retflightDate) || outbound === "";

  function outboundChange(e: ChangeEvent<HTMLInputElement>) {
    setOutbound(e.target.value);
  }

  function retflightChange(e: ChangeEvent<HTMLInputElement>) {
    setRetflight(e.target.value);
  }

  function isButtonDisabled(): boolean {
    const valid = isValidDate(outboundDate) && (flightType === "return" ? isValidDate(retflightDate) && retflightDate > outboundDate : true);
    return !valid;
  }

  function buttonOnClick() {
    switch (flightType) {
      case "one-way":
        alert(`You have booked a one-way flight on ${outbound}.`);
        break;
      case "return":
        alert(`You have booked a return flight on ${outbound} and ${retflight}.`);
        break;
      default:
        alert("Unknown Status");
    }
  }

  return (
    <div className={"flex flex-col items-center gap-4 w-80 mx-auto"}>
      <select defaultValue="one-way" className="select" onChange={(e) => setFlightType(e.target.value)}>
        <option disabled={true} className={"hidden"}>Pick a flight type</option>
        <option value={"one-way"}>One-way flight</option>
        <option value={"return"}>Return flight</option>
      </select>
      <label className={`input w-full ${!outboundValid && "input-error"}`}>
        <span className={"label"}>Outbound Flight</span>
        <input
          type="text" placeholder="27/03/2025"
          value={outbound} onChange={outboundChange}
        />
      </label>
      <label className={`input w-full ${!retflightValid && "input-error"}`}>
        <span className={"label"}>Return Flight</span>
        <input
          type="text" placeholder="31/03/2025"
          value={retflight} onChange={retflightChange} disabled={flightType !== "return"}
        />
      </label>
      <button
        className={"btn btn-primary w-full"}
        disabled={isButtonDisabled()}
        onClick={buttonOnClick}
      >Book
      </button>
    </div>
  );
}