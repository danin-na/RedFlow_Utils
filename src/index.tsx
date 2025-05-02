import React, { useState, useEffect, KeyboardEvent } from "react";
import ReactDOM from "react-dom/client";
import create from "./create"
import KEYS_LIST from "./keys";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "./components/ui/command"



const sortClasses = (arr: string[]) =>
  arr.filter(Boolean).sort((a, b) => a.localeCompare(b));

const App: React.FC = () => {
  const [className, setClassName] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlighted, setHighlighted] = useState(0);
  const [classList, setClassList] = useState<string[]>([]);
  const [selectedElement, setSelectedElement] = useState<any>(null);

  const setup = async () => {
    await webflow.setExtensionSize({width: 200, height: 500});
  }

  setup()

  // subscribe to selected element (your existing logic)
  useEffect(() => {
    const callback = async (el: any) => {
      setSelectedElement(el);
      if (el?.getAllCustomAttributes) {
        const attrs = (await el.getAllCustomAttributes()) || [];
        const cls = attrs.find((a: any) => a.name === "class")?.value || "";
        setClassList(sortClasses(cls.split(" ")));
      } else {
        setClassList([]);
      }
    };
    const unsubscribe = webflow.subscribe("selectedelement", callback);
    return () => unsubscribe();
  }, []);

  // recalc suggestions on input change
  useEffect(() => {
    if (!className) return setSuggestions([]);
    const matches = KEYS_LIST
      .filter(k => k.startsWith(className) && k !== className)
    setSuggestions(matches);
    setHighlighted(0);
  }, [className]);

  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) => {
    // Arrow nav
    if (e.key === "ArrowDown" && suggestions.length) {
      e.preventDefault();
      setHighlighted(h => Math.min(h + 1, suggestions.length - 1));
      return;
    }
    if (e.key === "ArrowUp" && suggestions.length) {
      e.preventDefault();
      setHighlighted(h => Math.max(h - 1, 0));
      return;
    }

    // Tab = immediate autocomplete
    if (e.key === "Tab" && suggestions.length) {
      e.preventDefault();
      setClassName(suggestions[highlighted]);
      return;
    }

    // Enter = first autocomplete, then commit
    if (e.key === "Enter") {
      e.preventDefault();
      // if there's a suggestion AND input ≠ that suggestion → autocomplete
      if (suggestions.length && className !== suggestions[highlighted]) {
        setClassName(suggestions[highlighted]);
        return;
      }
      // else → commit to element
      if (!selectedElement?.getAllCustomAttributes) return;
      const attrs = (await selectedElement.getAllCustomAttributes()) || [];
      const existing = attrs.find((a: any) => a.name === "class")?.value || "";
      const combined = existing
        ? `${existing} ${className}`
        : className;
      const sorted = sortClasses(combined.split(" "));
      await selectedElement.setCustomAttribute("class", sorted.join(" "));
      setClassList(sorted);
      setClassName("");
      setSuggestions([]);
    }
  };

  const handleRemoveClass = async (cn: string) => {
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
      <button className="text-red-50" onClick={() => create()}>TEST6</button>

      <Command>
  <CommandInput placeholder="Type a command or search..." />
  <CommandList>
    <CommandEmpty>No results found.</CommandEmpty>
    <CommandGroup heading="Suggestions">
      <CommandItem>Calendar</CommandItem>
      <CommandItem>Search Emoji</CommandItem>
      <CommandItem>Calculator</CommandItem>
    </CommandGroup>
    <CommandSeparator />
    <CommandGroup heading="Settings">
      <CommandItem>Profile</CommandItem>
      <CommandItem>Billing</CommandItem>
      <CommandItem>Settings</CommandItem>
    </CommandGroup>
  </CommandList>
</Command>

      <div style={{ position: "relative", margin: "0.5rem 0" }}>

        <input
          className="class-input"
          type="text"
          placeholder="Type a class…"
          value={className}
          onChange={e => setClassName(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
        />

        {suggestions.length > 0 && (
          <ul className="app-input-popup">
            {suggestions.map((s, i) => (
              <li
                key={s}
                onMouseDown={() => setClassName(s)}
                style={{
                  marginTop:"3px",
                  padding: "8px 8px",
                  background:
                    i === highlighted ? "var(--background1)" : "transparent",
                  cursor: "pointer",
                }}
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
            <button
              className="remove-btn"
              onClick={() => handleRemoveClass(c)}
              aria-label={`Remove ${c}`}
            >
              ✕
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
