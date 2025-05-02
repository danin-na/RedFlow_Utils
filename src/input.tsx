import React, { useState, useEffect, KeyboardEvent } from "react";

const keysList = [
  "p-50","p-75","p-100","m-50","m-75","m-100",
  "g-50","g-75","g-100",
  "s-100","s-125","s-150","ts-50","ts-75",
  /* …etc… */
];

export const ClassInput: React.FC<{
  onAdd: (cn: string) => void;
}> = ({ onAdd }) => {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);

  // update suggestions as you type
  useEffect(() => {
    if (!value) return setSuggestions([]);
    const v = value.toLowerCase();
    setSuggestions(
      keysList
        .filter(k => k.startsWith(v))
        .sort((a, b) => a.localeCompare(b))
    );
  }, [value]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Tab" && suggestions.length) {
      e.preventDefault();
      setValue(suggestions[0]);        // fill first match
      return;
    }
    if (e.key === "Enter" && value.trim()) {
      e.preventDefault();
      onAdd(value.trim());
      setValue("");
      setSuggestions([]);
    }
  };

  return (
    <div style={{ position: "relative" }}>
      <input
        type="text"
        placeholder="Type a class…"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: 450, padding: "8px" }}
      />
      {suggestions.length > 0 && (
        <ul
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            margin: 0,
            padding: "4px 0",
            listStyle: "none",
            background: "#333",
            border: "1px solid #ccc",
            maxHeight: 150,
            overflowY: "auto",
            zIndex: 10
          }}
        >
          {suggestions.map((s, i) => (
            <li
              key={s}
              onMouseDown={() => {
                onAdd(s);
                setValue("");
                setSuggestions([]);
              }}
              style={{
                padding: "4px 8px",
                cursor: "pointer"
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};