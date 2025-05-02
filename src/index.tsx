import React, { useState, useEffect, KeyboardEvent } from "react";
import ReactDOM from "react-dom/client";
import create from "./create"

const sortClasses = (arr: string[]) =>
  arr.filter(Boolean).sort((a, b) => a.localeCompare(b));

const App: React.FC = () =>
{
  const [className, setClassName] = useState("");
  const [selectedElement, setSelectedElement] = useState<any>(null);
  const [classList, setClassList] = useState<string[]>([]);

  // Subscribe & load on selection
  useEffect(() =>
  {
    const callback = async (el: any) =>
    {
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

  // Add on Enter
  const handleKeyDown = async (e: KeyboardEvent<HTMLInputElement>) =>
  {
    if (e.key !== "Enter" || !selectedElement?.getAllCustomAttributes) return;

    const attrs = (await selectedElement.getAllCustomAttributes()) || [];
    const existing = attrs.find((a: any) => a.name === "class")?.value || "";
    const combined = existing ? `${existing} ${className}` : className;

    const sorted = sortClasses(combined.split(" "));
    await selectedElement.setCustomAttribute("class", sorted.join(" "));
    setClassList(sorted);
    setClassName("");
  };

  // Remove on click
  const handleRemoveClass = async (cn: string) =>
  {
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

 // create()


  return (
    <div className="app-container">
      <button className="class-item" onClick={() => { create() }}>create</button>
      <input
        className="class-input"
        type="text"
        placeholder="Type a class and press Enter"
        value={className}
        onChange={e => setClassName(e.target.value)}
        onKeyDown={handleKeyDown}
      />

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
