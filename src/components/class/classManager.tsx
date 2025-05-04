import React, { useState, useEffect } from "react";
import
{
    Button,
    Command,
    CommandInput,
    CommandList,
    CommandGroup,
    CommandItem,
    CommandSeparator,
    SquareDashed,
    LetterText,
    AlignEndHorizontal,
    RulerDimensionLine,
    Asterisk,
} from "@/src/ui";
import { ClassKeys } from "@/src/components";

// grab the exact union type your Button expects
type ButtonVariant = React.ComponentProps<typeof Button>["variant"];

// define the order in which variants should appear
const variantPriority: ButtonVariant[] = [
    "red",      // 0
    "yellow",   // 1
    "emerald",  // 2
    "indigo",   // 3
    "lime",     // 4 (default)
];

export function ClassManager ()
{
    const [inputValue, setInputValue] = useState("");
    const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

    // subscribe to Webflow selection
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

    // helper to pick the right variant
    const getVariantForKey = (key: string): ButtonVariant =>
    {
        if (key.startsWith("padding-") || key.startsWith("margin-")) return "indigo";
        if (key.startsWith("height") || key.startsWith("width")) return "yellow";
        if (key.includes("text")) return "emerald";
        if (key.includes("flex")) return "red";
        return "ghost";
    };

    // helper to sort by variantPriority
    const sortByVariant = (keys: string[]) =>
    {
        return [...keys].sort(
            (a, b) =>
                variantPriority.indexOf(getVariantForKey(a)) -
                variantPriority.indexOf(getVariantForKey(b))
        );
    };

    const suggestions = inputValue
        ? ClassKeys.filter((key) =>
            key.toLowerCase().startsWith(inputValue.toLowerCase())
        )
        : [];

    const updateElementClass = async (classes: string[]) =>
    {
        const element = await webflow.getSelectedElement();
        if (!element?.customAttributes) return;
        if (classes.length) {
            await element.setCustomAttribute("class", classes.join(" "));
        } else {
            await element.removeCustomAttribute("class");
        }
    };

    const handleSelect = async (key: string) =>
    {
        if (selectedKeys.includes(key)) return;
        const updated = sortByVariant([...selectedKeys, key]);
        setSelectedKeys(updated);
        setInputValue("");
        await updateElementClass(updated);
    };

    const handleRemove = async (key: string) =>
    {
        const updated = sortByVariant(
            selectedKeys.filter((k) => k !== key)
        );
        setSelectedKeys(updated);
        await updateElementClass(updated);
    };

    return (
        <>
            <Command>
                <CommandInput
                    placeholder="search class keys..."
                    value={inputValue}
                    onValueChange={setInputValue}
                />
                <CommandList>
                    {suggestions.length > 0 && (
                        <CommandGroup heading="Suggestions">
                            {suggestions.map((key) => (
                                <CommandItem key={key} onSelect={() => handleSelect(key)}>
                                    {key}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}
                    <CommandSeparator />
                </CommandList>
            </Command>

            <div className="pt-4 flex flex-row flex-wrap gap-2">
                {selectedKeys.map((key) =>
                {
                    // pick icon & variant using the same logic
                    let Icon = Asterisk;
                    const variant = getVariantForKey(key);

                    if (variant === "indigo") Icon = SquareDashed;
                    else if (variant === "yellow") Icon = RulerDimensionLine;
                    else if (variant === "emerald") Icon = LetterText;
                    else if (variant === "red") Icon = AlignEndHorizontal;

                    return (
                        <Button
                            key={key}
                            size="sm"
                            variant={variant}
                            onClick={() => handleRemove(key)}
                            className="font-normal px-0.5 text-xs py-4 h-6"
                        >
                            <Icon size={16} className="size-3" /> {key}
                        </Button>
                    );
                })}
            </div>
        </>
    );
}
