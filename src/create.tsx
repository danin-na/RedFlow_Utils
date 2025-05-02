//–– Size constants (no more inline arrays in configs)
const var_sizeText = [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350] as const;
const var_colorText = ["white", 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, "black"] as const;
const var_sizePadding = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const;
const var_sizeMargin = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const;
const var_sizeGap = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const;
const var_sizeRound = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const;
const var_sizeMaxWidth = [400, 450, 500, 550] as const;
const var_sizeHeight = [100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350] as const;
const var_sizeTextWeight = ["100", "200", "300", "400", "500", "600"] as const;
const var_sizeTextAlign = ["left", "center", "right", "justify"] as const;
const var_flexDirection = ["row", "row-rev", "col", "col-rev"] as const;
const var_flexWrap = ["wrap", "wrap-rev", "nowrap"] as const;
const var_flexJustify = ["start", "center", "end", "between", "around", "evenly"] as const;
const var_flexAlign = ["start", "center", "end", "stretch", "baseline"] as const;
const var_positionType = ["static", "relative", "absolute", "fixed", "sticky"] as const;
const var_overflowType = ["visible", "hidden", "scroll", "auto"] as const;
const var_widthType = ["full", "screen"] as const;
const var_heightType = ["full", "screen"] as const;
const var_zIndex = [-1, 0, 1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const;

//–– Loader functions (extracted)
const load_text_c = () => loadSizeVariables("c", var_colorText);
const load_text_s = () => loadSizeVariables("st", var_sizeText);
const load_text_w = async () => ({ 100: "100", 200: "200", 300: "300", 400: "400", 500: "500", 600: "600" });
const load_text_a = async () => ({ left: "left", center: "center", right: "right", justify: "justify" });
const load_flex = async () => ({ row: "row", "row-rev": "row-reverse", col: "column", "col-rev": "column-reverse" });
const load_flex_wrap = async () => ({ wrap: "wrap", "wrap-rev": "wrap-reverse", nowrap: "nowrap" });
const load_flex_justify = async () => ({ start: "flex-start", center: "center", end: "flex-end", between: "space-between", around: "space-around", evenly: "space-evenly" });
const load_flex_align = async () => ({ start: "flex-start", center: "center", end: "flex-end", stretch: "stretch", baseline: "baseline" });
const load_width = async () => ({ full: "100%", screen: "100svw" });
const load_width_max = () => loadSizeVariables("sg", var_sizeMaxWidth);
const load_height = () => loadSizeVariables("sg", var_sizeHeight);
const load_height_t = async () => ({ full: "100%", screen: "100svh" });
const load_position = async () => ({ static: "static", relative: "relative", absolute: "absolute", fixed: "fixed", sticky: "sticky" });
const load_overflow = async () => ({ visible: "visible", hidden: "hidden", scroll: "scroll", auto: "auto" });
const load_padding = () => loadSizeVariables("sg", var_sizePadding);
const load_margin = () => loadSizeVariables("sg", var_sizeMargin);
const load_gap = () => loadSizeVariables("sg", var_sizeGap);
const load_round = () => loadSizeVariables("sg", var_sizeRound);
const load_z_index = async () => ({ [-1]: "-1", 0: "0", 1: "1", 10: "10", 20: "20", 30: "30", 40: "40", 50: "50", 60: "60", 70: "70", 80: "80", 90: "90", 100: "100" });

//–– generic loader that pulls your CSS Variables by name
async function loadSizeVariables<T extends number | string> (
    prefix: string,
    values: readonly T[]
): Promise<Record<T, SizeVariable>>
{
    const coll = await webflow.getDefaultVariableCollection();
    const map = {} as Record<T, SizeVariable>;
    for (const v of values) {
        map[v] = (await coll.getVariableByName(`${prefix}/${v}`)) as SizeVariable;
    }
    return map;
}

//–– the one “create” function
const create = async () =>
{
    const el = await webflow.getSelectedElement();
    if (!el?.children) return;

    const configs = [
        // Text
        { sizes: var_colorText, loader: load_text_c, prefix: "text-c-", props: (v: string) => ({ color: v }) },
        { sizes: var_sizeText, loader: load_text_s, prefix: "text-s-", props: (v: string) => ({ "font-size": v }) },
        { sizes: var_sizeTextWeight, loader: load_text_w, prefix: "text-w-", props: (v: string) => ({ "font-weight": v }) },
        { sizes: var_sizeTextAlign, loader: load_text_a, prefix: "text-a-", props: (v: string) => ({ "text-align": v }) },

        // Flex
        { sizes: var_flexDirection, loader: load_flex, prefix: "flex-", props: (v: string) => ({ display: "flex", "flex-direction": v }) },
        { sizes: var_flexWrap, loader: load_flex_wrap, prefix: "flex-wrap-", props: (v: string) => ({ "flex-wrap": v }) },
        { sizes: var_flexJustify, loader: load_flex_justify, prefix: "flex-justify-", props: (v: string) => ({ "justify-content": v }) },
        { sizes: var_flexAlign, loader: load_flex_align, prefix: "flex-align-", props: (v: string) => ({ "align-items": v }) },

        // Width & Max-Width
        { sizes: var_widthType, loader: load_width, prefix: "width-", props: (v: string) => ({ width: v }) },
        { sizes: var_sizeMaxWidth, loader: load_width_max, prefix: "width-max-", props: (v: string) => ({ "max-width": v }) },

        // Height
        { sizes: var_heightType, loader: load_height_t, prefix: "height-", props: (v: string) => ({ height: v }) },
        { sizes: var_sizeHeight, loader: load_height, prefix: "height-", props: (v: string) => ({ height: v }) },

        // Position
        { sizes: var_positionType, loader: load_position, prefix: "position-", props: (v: string) => ({ position: v, top: "0px" }) },

        // Overflow
        { sizes: var_overflowType, loader: load_overflow, prefix: "overflow-", props: (v: string) => ({ "overflow-x": v }) },

        // Padding
        { sizes: var_sizePadding, loader: load_padding, prefix: "padding-", props: (v: string) => ({ "padding-top": v, "padding-right": v, "padding-bottom": v, "padding-left": v }) },
        { sizes: var_sizePadding, loader: load_padding, prefix: "padding-x-", props: (v: string) => ({ "padding-left": v, "padding-right": v }) },
        { sizes: var_sizePadding, loader: load_padding, prefix: "padding-y-", props: (v: string) => ({ "padding-top": v, "padding-bottom": v }) },
        { sizes: var_sizePadding, loader: load_padding, prefix: "padding-t-", props: (v: string) => ({ "padding-top": v }) },
        { sizes: var_sizePadding, loader: load_padding, prefix: "padding-b-", props: (v: string) => ({ "padding-bottom": v }) },
        { sizes: var_sizePadding, loader: load_padding, prefix: "padding-l-", props: (v: string) => ({ "padding-left": v }) },
        { sizes: var_sizePadding, loader: load_padding, prefix: "padding-r-", props: (v: string) => ({ "padding-right": v }) },

        // Margin
        { sizes: var_sizeMargin, loader: load_margin, prefix: "margin-", props: (v: string) => ({ "margin-top": v, "margin-right": v, "margin-bottom": v, "margin-left": v }) },
        { sizes: var_sizeMargin, loader: load_margin, prefix: "margin-x-", props: (v: string) => ({ "margin-left": v, "margin-right": v }) },
        { sizes: var_sizeMargin, loader: load_margin, prefix: "margin-y-", props: (v: string) => ({ "margin-top": v, "margin-bottom": v }) },
        { sizes: var_sizeMargin, loader: load_margin, prefix: "margin-t-", props: (v: string) => ({ "margin-top": v }) },
        { sizes: var_sizeMargin, loader: load_margin, prefix: "margin-b-", props: (v: string) => ({ "margin-bottom": v }) },
        { sizes: var_sizeMargin, loader: load_margin, prefix: "margin-l-", props: (v: string) => ({ "margin-left": v }) },
        { sizes: var_sizeMargin, loader: load_margin, prefix: "margin-r-", props: (v: string) => ({ "margin-right": v }) },

        // Rounding
        { sizes: var_sizeRound, loader: load_round, prefix: "round-", props: (v: string) => ({ "border-top-left-radius": v, "border-top-right-radius": v, "border-bottom-right-radius": v, "border-bottom-left-radius": v }) },
        { sizes: var_sizeRound, loader: load_round, prefix: "round-tl-", props: (v: string) => ({ "border-top-left-radius": v }) },
        { sizes: var_sizeRound, loader: load_round, prefix: "round-tr-", props: (v: string) => ({ "border-top-right-radius": v }) },
        { sizes: var_sizeRound, loader: load_round, prefix: "round-br-", props: (v: string) => ({ "border-bottom-right-radius": v }) },
        { sizes: var_sizeRound, loader: load_round, prefix: "round-bl-", props: (v: string) => ({ "border-bottom-left-radius": v }) },

        // Gap
        { sizes: var_sizeGap, loader: load_gap, prefix: "gap-", props: (v: string) => ({ "grid-column-gap": v, "grid-row-gap": v }) },

        // Z-Index
        { sizes: var_zIndex, loader: load_z_index, prefix: "z-", props: (v: string) => ({ "z-index": v }) },
    ] as const;

    for (const { sizes, loader, prefix, props } of configs) {
        const vars = await loader();
        for (const size of sizes) {
            const value = vars[size];
            if (!value) continue;
            const style = await webflow.createStyle(`${prefix}${size}`);
            await style.setProperties(props(value));
            const wrapper = await el.append(webflow.elementPresets.DivBlock);
            await wrapper.setStyles([style]);
        }
    }
};

export default create;
