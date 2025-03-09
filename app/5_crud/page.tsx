"use client";

import { ChangeEvent, useReducer, useState } from "react";
import { Action, AppState, Entry } from "@/app/5_crud/types";

function appReducer(state: AppState, action: Action) {
  switch (action.type) {
    case 'create':
      return {
        ...state,
        entries: { ...state.entries, [state.nextIndex]: action.entry },
        nextIndex: state.nextIndex + 1,
      };
    case 'update':
      state.entries[action.entryId] = action.newEntry;
      return {
        ...state,
        entries: { ...state.entries, [action.entryId]: action.newEntry }
      };
    case 'delete':
      const { [action.entryId]: _, ...newEntries } = state.entries;
      return {
        ...state,
        entries: newEntries,
      };
    default:
      throw new Error("Unknown Action in Reducer");
  }
}

export default function CRUD() {
  const [state, dispatch] = useReducer(appReducer, {
    entries: {
      "1": { name: "Hans", surname: "Wittenberg" },
      "2": { name: "Max", surname: "Neumann" },
      "3": { name: "Romano", surname: "Prodi" }
    }, nextIndex: 4
  });
  const [selectedId, setSelectedId] = useState<string | "none">("none");
  const [inputEntry, setInputEntry] = useState<Entry>({ name: "", surname: "" });
  const [filterStr, setFilterStr] = useState<string>("");

  const entryOptions = Object.entries(state.entries).filter(([_, e]) => {
    return e.name.includes(filterStr) || e.surname.includes(filterStr);
  }).map(([key, e]: [key: string, e: Entry]) => {
    return <option value={key} key={key}>{e.surname}, {e.name}</option>;
  });

  function changeSelected(e: ChangeEvent<HTMLSelectElement>) {
    setSelectedId(e.target.value);
    const entry = state.entries[e.target.value];
    setInputEntry(entry);
  }

  return (
    <div className={"card card-border shadow-xl w-200 mx-auto"}>
      <div className={"card-body"}>
        <h2 className={"card-title"}>5. CRUD</h2>
        <div className={"grid grid-cols-2 gap-2"}>
          <div className={"inline-flex"}>
            <label className={"label text-nowrap mr-2"}>Filter prefix:</label>
            <input type="text" className={"input w-fill"} value={filterStr}
                   onChange={(e) => setFilterStr(e.target.value)}/>
          </div>
          <p></p>
          <div>
            <label className={"label"}>Surname, Name</label>
            <select
              className={"input h-auto cursor-auto w-full"} size={10}
              value={selectedId} onChange={changeSelected}
            >
              <option hidden value={"none"}>None</option>
              {entryOptions}
            </select>
          </div>
          <div className={"grid grid-cols-[min-content_auto] gap-2 mb-auto"}>
            <label className={"label"}>Name:</label>
            <input className={"input"} type="text" value={inputEntry.name}
                   onChange={(e) => setInputEntry({ ...inputEntry, name: e.target.value })}/>
            <label className={"label"}>Surname:</label>
            <input className={"input"} type="text" value={inputEntry.surname}
                   onChange={(e) => setInputEntry({ ...inputEntry, surname: e.target.value })}/>
          </div>
        </div>
        <div className={"card-actions"}>
          <button className={"btn btn-primary"} onClick={() => dispatch({ type: 'create', entry: inputEntry })}>
            Create
          </button>
          <button
            className={"btn btn-warning"} disabled={selectedId === "none"}
            onClick={() => dispatch({ type: 'update', entryId: selectedId, newEntry: inputEntry })}
          >Update
          </button>
          <button
            className={`btn btn-error`} disabled={selectedId === "none"}
            onClick={() => {
              dispatch({ type: 'delete', entryId: selectedId });
              setSelectedId("none");
            }}>Delete
          </button>
        </div>
      </div>
    </div>
  );
}