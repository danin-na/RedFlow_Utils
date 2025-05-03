import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { MailOpen } from "lucide-react";
import { Button } from "./components/ui/button_copy";
import
{
  Command,
  CommandInput,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandSeparator,
} from "./components/ui/command";

import { SquareDashed, LetterText, AlignEndHorizontal, RulerDimensionLine, Asterisk } from "lucide-react";

import KEYS_LIST from "./keys";

const App: React.FC = () =>
{
  const [inputValue, setInputValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  // Load existing classes when element selection changes
  useEffect(() =>
  {
    const handleSelection = async (element: any) =>
    {
      if (element?.customAttributes) {
        const existing = (await element.getCustomAttribute("class")) || "";
        setSelectedKeys(existing.split(" ").filter(Boolean));
      } else {
        setSelectedKeys([]);
      }
    };

    const unsubscribe = webflow.subscribe("selectedelement", handleSelection);
    return unsubscribe;
  }, []);

  // Suggestion list based on input
  const suggestions = inputValue
    ? KEYS_LIST.filter(key =>
      key.toLowerCase().startsWith(inputValue.toLowerCase())
    )
    : [];

  // Update selected element's class attribute
  const updateElementClass = async (classes: string[]) =>
  {
    const element = await webflow.getSelectedElement();
    if (element?.customAttributes) {
      if (classes.length) {
        await element.setCustomAttribute("class", classes.join(" "));
      } else {
        await element.removeCustomAttribute("class");
      }
    }
  };

  const handleSelect = async (key: string) =>
  {
    if (selectedKeys.includes(key)) return;
    const updated = [...selectedKeys, key];
    setSelectedKeys(updated);
    setInputValue("");
    await updateElementClass(updated);
  };

  const handleRemove = async (key: string) =>
  {
    const updated = selectedKeys.filter(k => k !== key);
    setSelectedKeys(updated);
    await updateElementClass(updated);
  };

  return (
    <div className="text-red-50">
      <Command>
        <CommandInput
          placeholder="Type to search class keys..."
          value={inputValue}
          onValueChange={setInputValue}
        />
        <CommandList>
          {suggestions.length > 0 && (
            <CommandGroup heading="Suggestions">
              {suggestions.map(key => (
                <CommandItem key={key} onSelect={() => handleSelect(key)}>
                  {key}
                </CommandItem>
              ))}
            </CommandGroup>
          )}
          <CommandSeparator />
        </CommandList>
      </Command>

      <div className="p-4 flex flex-row flex-wrap gap-2">

        {selectedKeys.map((key) =>
        {
          // pick icon based on key
          let Icon = Asterisk;
          if (key.startsWith("padding-") || key.startsWith("margin-")) {
            Icon = SquareDashed;
          } else if (key.startsWith("height") || key.startsWith("width")) {
            Icon = RulerDimensionLine;
          } else if (key.includes("text")) {
            Icon = LetterText;
          } else if (key.includes("flex")) {
            Icon = AlignEndHorizontal;
          } else if (key.includes("test")) {
            Icon = AlignEndHorizontal;
          }

          // pick variant based on prefix
          const variant =
            key.startsWith("padding-") || key.startsWith("margin-")
              ? "red"
              : key.startsWith("height") || key.startsWith("width")
                ? "lime"
                : "sky";

          return (
            <Button
              key={key}
              size="sm"
              variant={variant}
              onClick={() => handleRemove(key)}
            >
              <Icon size={10} className="text-xs " /> {key}
            </Button>
          );
        })}

      </div>
    </div>
  );
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
