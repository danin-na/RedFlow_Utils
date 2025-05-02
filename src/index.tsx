import React, { useState, useEffect, KeyboardEvent } from "react";
import ReactDOM from "react-dom/client";
import create from "./create";
import KEYS_LIST from "./keys";

// Utility to sort and clean class names
const sortClasses = (classes: string[]): string[] =>
  classes.filter(Boolean).sort((a, b) => a.localeCompare(b));

const App: React.FC = () => {
  const [className, setClassName] = useState<string>("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(0);
  const [classList, setClassList] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<any>(null);

  // Subscribe to selected element changes
  useEffect(() => {
    const callback = async (el: any) => {
      setSelectedElement(el);
      if (el?.getAllCustomAttributes) {
        const attrs = (await el.getAllCustomAttributes()) || [];
        const classAttr = attrs.find((a: any) => a.name === "class")?.value || "";
        setClassList(sortClasses(classAttr.split(" ")));
      } else {
        setClassList([]);
      }
    };
    const unsubscribe = webflow.subscribe("selectedelement", callback);
    return unsubscribe;
  }, []);

  // Update suggestions based on input
  useEffect(() => {
    if (!className) {
      setSuggestions([]);
      return;
    }
    const matches = KEYS_LIST.filter(
      key => key.startsWith(className) && key !== className
    );
    setSuggestions(matches);
    setHighlightedIndex(0);
  }, [className]);

  // Handle keyboard interactions
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setHighlightedIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setHighlightedIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Tab" && suggestions.length) {
      e.preventDefault();
      setClassName(suggestions[highlightedIndex]);
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (suggestions.length && className !== suggestions[highlightedIndex]) {
        setClassName(suggestions[highlightedIndex]);
      } else if (selectedElement?.getAllCustomAttributes) {
        const attrs = (await selectedElement.getAllCustomAttributes()) || [];
        const existing = attrs.find((a: any) => a.name === "class")?.value || "";
        const combined = existing ? `${existing} ${className}` : className;
        const sorted = sortClasses(combined.split(" "));
        await selectedElement.setCustomAttribute("class", sorted.join(" "));
        setClassList(sorted);
        setClassName("");
        setSuggestions([]);
      }
    }
  };

  // Remove a class from the element
  const removeClass = async (cn: string) => {
    if (!selectedElement?.getAllCustomAttributes) return;
    const attrs = (await selectedElement.getAllCustomAttributes()) || [];
    const existing = attrs.find((a: any) => a.name === "class")?.value || "";
    const filtered = existing.split(" ").filter(item => item !== cn);
    if (filtered.length) {
      const sorted = sortClasses(filtered);
      await selectedElement.setCustomAttribute("class", sorted.join(" "));
      setClassList(sorted);
    } else {
      await selectedElement.removeCustomAttribute("class");
      setClassList([]);
    }
  };

  return (
    <div className="app-container">
      <button onClick={create}>Install</button>

      <div className="input-wrapper">
        <input
          type="text"
          placeholder="Type a class…"
          value={className}
          onChange={e => setClassName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((s, i) => (
              <li
                key={s}
                onMouseDown={() => setClassName(s)}
                className={i === highlightedIndex ? "highlighted" : ""}
              >
                {s}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ul className="class-list">
        {classList.map(c => (
          <li key={c} className="class-item">
            <span>{c}</span>
            <button onClick={() => removeClass(c)} aria-label={`Remove ${c}`}>
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const rootElement = document.getElementById("root");
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
