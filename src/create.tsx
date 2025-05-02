//–– your size‐constants (no more separate file)
const sizeText = [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350] as const
const sizePadding = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const
const sizeMargin = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const
const sizeGap = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const
const sizeRound = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450] as const
const sizeMaxWidth = [400, 450, 500, 550] as const
const sizeHeight = [100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350]

//–– your five loaders
const loadText = () => loadSizeVariables("st", sizeText)
const loadPadding = () => loadSizeVariables("sg", sizePadding)
const loadMargin = () => loadSizeVariables("sg", sizeMargin)
const loadGap = () => loadSizeVariables("sg", sizeGap)
const loadRound = () => loadSizeVariables("sg", sizeRound)
const loadMaxWidth = () => loadSizeVariables("sg", sizeMaxWidth)
const loadHeight = () => loadSizeVariables("sg", sizeHeight)

//–– generic loader that pulls your CSS Variables by name
async function loadSizeVariables<T extends number>(
	prefix: string,
	values: readonly T[]
): Promise<Record<T, SizeVariable>> {
	const coll = await webflow.getDefaultVariableCollection()
	const map = {} as Record<T, SizeVariable>
	for (const v of values) {
		map[v] = (await coll.getVariableByName(`${prefix}/${v}`)) as SizeVariable
	}
	return map
}

//–– the one “create” function
const create = async () => {
	const el = await webflow.getSelectedElement()
	if (!el?.children) return

	const configs = [
		{
			// just “display: flex”
			sizes: [""] as const,
			loader: async () => ({ "": "flex" }),
			prefix: "flex",
			props: () => ({ display: "flex" }),
		},

		//–– FLEX DIRECTION
		{
			sizes: ["row", "row-rev", "col", "col-rev"] as const,
			loader: async () => ({
				row: "row",
				"row-rev": "row-reverse",
				col: "column",
				"col-rev": "column-reverse",
			}),
			prefix: "flex",
			props: (v: string) => ({ "flex-direction": v }),
		},

		//–– FLEX WRAP
		{
			sizes: ["wrap", "wrap-rev", "nowrap"] as const,
			loader: async () => ({
				wrap: "wrap",
				"wrap-rev": "wrap-reverse",
				nowrap: "nowrap",
			}),
			prefix: "flex-wrap",
			props: (v: string) => ({ "flex-wrap": v }),
		},

		//–– JUSTIFY CONTENT
		{
			sizes: ["start", "center", "end", "between", "around", "evenly"] as const,
			loader: async () => ({
				start: "flex-start",
				center: "center",
				end: "flex-end",
				between: "space-between",
				around: "space-around",
				evenly: "space-evenly",
			}),
			prefix: "flex-jc",
			props: (v: string) => ({ "justify-content": v }),
		},

		//–– ALIGN ITEMS
		{
			sizes: ["start", "center", "end", "stretch", "baseline"] as const,
			loader: async () => ({
				start: "flex-start",
				center: "center",
				end: "flex-end",
				stretch: "stretch",
				baseline: "baseline",
			}),
			prefix: "flex-ai",
			props: (v: string) => ({ "align-items": v }),
		},

		// WIDTH
		{
			sizes: ["full", "screen"],
			loader: async () => ({ full: "100%", screen: "100svw" }),
			prefix: "width",
			props: (v: string) => ({ width: v }),
		},
		{
			sizes: sizeMaxWidth,
			loader: loadMaxWidth,
			prefix: "width-max",
			props: (v: string) => ({ "max-width": v }),
		},
		// HEIGHT
		{
			sizes: ["full", "screen"] as const,
			loader: async () => ({ full: "100%", screen: "100svh" }),
			prefix: "height",
			props: (v: string) => ({ height: v }),
		},
		{
			sizes: sizeHeight,
			loader: loadHeight,
			prefix: "height",
			props: (v: string) => ({ height: v }),
		},
		{
			sizes: sizeText,
			loader: loadText,
			prefix: "text-s",
			props: (v: string) => ({ "font-size": v }),
		},
		// POSITION
		{
			sizes: ["static", "relative", "absolute", "fixed", "sticky"] as const,
			loader: async () => ({
				static: "static",
				relative: "relative",
				absolute: "absolute",
				fixed: "fixed",
				sticky: "sticky",
			}),
			prefix: "pos",
			props: (v: string) => ({ position: v, top: "0px" }),
		},
		// OVERFLOW
		{
			sizes: ["visible", "hidden", "scroll", "auto"] as const,
			loader: async () => ({ visible: "visible", hidden: "hidden", scroll: "scroll", auto: "auto" }),
			prefix: "ovf",
			props: (v: string) => ({ "overflow-x": v }),
		},

		// -----------------------------------
		// -- Padding
        // -----------------------------------


		{
			sizes: sizePadding,
			loader: loadPadding,
			prefix: "padding",
			props: (v: string) => ({ "padding-top": v, "padding-right": v, "padding-bottom": v, "padding-left": v }),
		},
		{
			sizes: sizePadding,
			loader: loadPadding,
			prefix: "padding-x",
			props: (v: string) => ({ "padding-left": v, "padding-right": v }),
		},
		{
			sizes: sizePadding,
			loader: loadPadding,
			prefix: "padding-y",
			props: (v: string) => ({ "padding-top": v, "padding-bottom": v }),
		},
		{
			sizes: sizePadding,
			loader: loadPadding,
			prefix: "padding-t",
			props: (v: string) => ({ "padding-top": v }),
		},
		{
			sizes: sizePadding,
			loader: loadPadding,
			prefix: "padding-b",
			props: (v: string) => ({ "padding-bottom": v }),
		},
		{
			sizes: sizePadding,
			loader: loadPadding,
			prefix: "padding-l",
			props: (v: string) => ({ "padding-left": v }),
		},
		{
			sizes: sizePadding,
			loader: loadPadding,
			prefix: "padding-r",
			props: (v: string) => ({ "padding-right": v }),
		},

		// -----------------------------------
		// -- Margin
        // -----------------------------------

		{
			sizes: sizeMargin,
			loader: loadMargin,
			prefix: "margin",
			props: (v: string) => ({ "margin-top": v, "margin-right": v, "margin-bottom": v, "margin-left": v }),
		},
		{
			sizes: sizeMargin,
			loader: loadMargin,
			prefix: "margin-x",
			props: (v: string) => ({ "margin-left": v, "margin-right": v }),
		},
		{
			sizes: sizeMargin,
			loader: loadMargin,
			prefix: "margin-y",
			props: (v: string) => ({ "margin-top": v, "margin-bottom": v }),
		},
		{
			sizes: sizeMargin,
			loader: loadMargin,
			prefix: "margin-t",
			props: (v: string) => ({ "margin-top": v }),
		},
		{
			sizes: sizeMargin,
			loader: loadMargin,
			prefix: "margin-b",
			props: (v: string) => ({ "margin-bottom": v }),
		},
		{
			sizes: sizeMargin,
			loader: loadMargin,
			prefix: "margin-l",
			props: (v: string) => ({ "margin-left": v }),
		},
		{
			sizes: sizeMargin,
			loader: loadMargin,
			prefix: "margin-r",
			props: (v: string) => ({ "margin-right": v }),
		},

        		// -----------------------------------
		// -- Round
        // -----------------------------------

		{
			sizes: sizeRound,
			loader: loadRound,
			prefix: "round",
			props: (v: string) => ({
				"border-top-left-radius": v,
				"border-top-right-radius": v,
				"border-bottom-right-radius": v,
				"border-bottom-left-radius": v,
			}),
		},
		{
			sizes: sizeRound,
			loader: loadRound,
			prefix: "round-tl",
			props: (v: string) => ({ "border-top-left-radius": v }),
		},
		{
			sizes: sizeRound,
			loader: loadRound,
			prefix: "round-tr",
			props: (v: string) => ({ "border-top-right-radius": v }),
		},
		{
			sizes: sizeRound,
			loader: loadRound,
			prefix: "round-br",
			props: (v: string) => ({ "border-bottom-right-radius": v }),
		},
		{
			sizes: sizeRound,
			loader: loadRound,
			prefix: "round-bl",
			props: (v: string) => ({ "border-bottom-left-radius": v }),
		},

        // -----------------------------------
		// -- Gap
        // -----------------------------------

		{
			sizes: sizeGap,
			loader: loadGap,
			prefix: "gap",
			props: (v: string) => ({ "grid-column-gap": v, "grid-row-gap": v }),
		},

        		// -----------------------------------
		// -- Z-Index
        // -----------------------------------

		{
			sizes: [-1, 0, 1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100] as const,
			loader: async () => ({
				[-1]: "-1",
				0: "0",
				1: "1",
				10: "10",
				20: "20",
				30: "30",
				40: "40",
				50: "50",
				60: "60",
				70: "70",
				80: "80",
				90: "90",
				100: "100",
			}),
			prefix: "z",
			props: (v: string) => ({ "z-index": v }),
		},

	] as const

	for (const { sizes, loader, prefix, props } of configs) {
		const vars = await loader()
		for (const size of sizes) {
			const value = vars[size]
			if (!value) continue
			const style = await webflow.createStyle(`${prefix}-${size}`)
			await style.setProperties(props(value))
			const wrapper = await el.append(webflow.elementPresets.DivBlock)
			await wrapper.setStyles([style])
		}
	}
}

export default create
