export async function createStyles (varPrefix, stylePrefix, sizes, propsFn)
{
    const coll = await webflow.getDefaultVariableCollection()
    const entries = await Promise.all(sizes.map(async (v) => [v, await coll.getVariableByName(`${varPrefix}/${v}`)]))
    const vars = Object.fromEntries(entries)
    const el = await webflow.getSelectedElement()

    if (el?.children) {
        await Promise.all(
            sizes.map(async (size) =>
            {
                const value = vars[size]
                if (!value) return
                const style = await webflow.createStyle(`${stylePrefix}${size}`)
                await style.setProperties(propsFn(value))
                const wrapper = await el.append(webflow.elementPresets.DivBlock)
                await wrapper.setStyles([style])
            })
        )
    }
}

export async function createEnumStyles (stylePrefix, items, propsFn)
{
    const el = await webflow.getSelectedElement()

    if (el?.children) {
        await Promise.all(
            items.map(async ({ name, value }) =>
            {
                const style = await webflow.createStyle(`${stylePrefix}${name}`)
                await style.setProperties(propsFn(value))
                const wrapper = await el.append(webflow.elementPresets.DivBlock)
                await wrapper.setStyles([style])
            })
        )
    }
}

async function classGenerate ()
{
    // ----------------------------
    // TEXT

    const textColor = ["white", 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950, "black"]
    await createStyles("c", "text-c-", textColor, (v) => ({ color: v }))

    const textSizes = [50, 75, 100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350]
    await createStyles("st", "text-s-", textSizes, (v) => ({ "font-size": v }))

    const textAlignItems = [
        { name: "left", value: "left" },
        { name: "center", value: "center" },
        { name: "right", value: "right" },
        { name: "justify", value: "justify" },
    ]
    await createEnumStyles("text-a-", textAlignItems, (v) => ({ "text-align": v }))

    const textWItems = [
        { name: "100", value: "100" },
        { name: "200", value: "200" },
        { name: "300", value: "300" },
        { name: "400", value: "400" },
        { name: "500", value: "500" },
        { name: "600", value: "600" },
        { name: "700", value: "700" },
        { name: "800", value: "800" },
        { name: "900", value: "900" },
    ]
    await createEnumStyles("text-w-", textWItems, (v) => ({ "font-weight": v }))

    // ----------------------------
    // POSITION

    const posItems = [
        { name: "static", value: "static" },
        { name: "relative", value: "relative" },
        { name: "absolute", value: "absolute" },
        { name: "fixed", value: "fixed" },
        { name: "sticky", value: "sticky" },
    ]
    await createEnumStyles("pos-", posItems, (v) => ({ position: v }))

    // ----------------------------
    // OVERFLOW

    const ovfXItems = [
        { name: "visible", value: "visible" },
        { name: "hidden", value: "hidden" },
        { name: "scroll", value: "scroll" },
        { name: "auto", value: "auto" },
    ]
    await createEnumStyles("ovf-x-", ovfXItems, (v) => ({ "overflow-x": v }))

    const ovfYItems = [
        { name: "visible", value: "visible" },
        { name: "hidden", value: "hidden" },
        { name: "scroll", value: "scroll" },
        { name: "auto", value: "auto" },
    ]
    await createEnumStyles("ovf-y-", ovfYItems, (v) => ({ "overflow-y": v }))

    // ----------------------------
    // SCREEN

    const widthItems = [
        { name: "screen", value: "100svw" },
        { name: "full", value: "100%" },
    ]
    await createEnumStyles("width-", widthItems, (v) => ({ width: v }))

    const heightItems = [
        { name: "screen", value: "100svh" },
        { name: "full", value: "100%" },
    ]
    await createEnumStyles("height-", heightItems, (v) => ({ height: v }))

    const widthMaxSizes = [400, 450, 500, 550]
    await createStyles("sg", "width-max-", widthMaxSizes, (v) => ({ "max-width": v }))

    const lengthSizes = [100, 125, 150, 175, 200, 225, 250, 275, 300, 325, 350]
    await createStyles("sg", "width-", lengthSizes, (v) => ({ width: v }))
    await createStyles("sg", "height-", lengthSizes, (v) => ({ height: v }))

    // ----------------------------
    // OPACITY
    const opacityItems = [
        { name: "0", value: "0" },
        { name: "10", value: "0.1" },
        { name: "20", value: "0.2" },
        { name: "30", value: "0.3" },
        { name: "40", value: "0.4" },
        { name: "50", value: "0.5" },
        { name: "60", value: "0.6" },
        { name: "70", value: "0.7" },
        { name: "80", value: "0.8" },
        { name: "90", value: "0.9" },
        { name: "100", value: "1" },
    ]
    await createEnumStyles("opc-", opacityItems, (v) => ({ opacity: v }))

    // ----------------------------
    // FKEX

    const flexDirItems = [
        { name: "row", value: "row" },
        { name: "row-rev", value: "row-reverse" },
        { name: "col", value: "column" },
        { name: "col-rev", value: "column-reverse" },
    ]
    await createEnumStyles("flex-", flexDirItems, (v) => ({ display: "flex", "flex-direction": v }))

    const flexWrapItems = [
        { name: "wrap", value: "wrap" },
        { name: "wrap-rev", value: "wrap-reverse" },
        { name: "nowrap", value: "nowrap" },
    ]
    await createEnumStyles("flex-", flexWrapItems, (v) => ({ "flex-wrap": v }))

    const flexJustifyItems = [
        { name: "start", value: "flex-start" },
        { name: "center", value: "center" },
        { name: "end", value: "flex-end" },
        { name: "between", value: "space-between" },
        { name: "around", value: "space-around" },
        { name: "evenly", value: "space-evenly" },
    ]
    await createEnumStyles("flex-jc-", flexJustifyItems, (v) => ({ "justify-content": v }))

    const flexItemsItems = [
        { name: "start", value: "flex-start" },
        { name: "center", value: "center" },
        { name: "end", value: "flex-end" },
        { name: "baseline", value: "baseline" },
        { name: "stretch", value: "stretch" },
    ]
    await createEnumStyles("flex-ai-", flexItemsItems, (v) => ({ "align-items": v }))

    // ----------------------------
    // GAP

    const gapSizes = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450]
    await createStyles("sg", "gap-", gapSizes, (v) => ({ "grid-column-gap": v, "grid-row-gap": v }))

    // ----------------------------
    // PADDING

    const paddingSizes = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450]
    await createStyles("sg", "padding-", paddingSizes, (v) => ({
        "padding-left": v,
        "padding-right": v,
        "padding-top": v,
        "padding-bottom": v,
    }))
    await createStyles("sg", "padding-x-", paddingSizes, (v) => ({ "padding-left": v, "padding-right": v }))
    await createStyles("sg", "padding-y-", paddingSizes, (v) => ({ "padding-top": v, "padding-bottom": v }))
    await createStyles("sg", "padding-l-", paddingSizes, (v) => ({ "padding-left": v }))
    await createStyles("sg", "padding-r-", paddingSizes, (v) => ({ "padding-right": v }))
    await createStyles("sg", "padding-t-", paddingSizes, (v) => ({ "padding-top": v }))
    await createStyles("sg", "padding-b-", paddingSizes, (v) => ({ "padding-bottom": v }))

    // ----------------------------
    // MARGIN

    const marginSizes = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450]
    await createStyles("sg", "margin-", marginSizes, (v) => ({
        "margin-left": v,
        "margin-right": v,
        "margin-top": v,
        "margin-bottom": v,
    }))
    await createStyles("sg", "margin-x-", marginSizes, (v) => ({ "margin-left": v, "margin-right": v }))
    await createStyles("sg", "margin-y-", marginSizes, (v) => ({ "margin-top": v, "margin-bottom": v }))
    await createStyles("sg", "margin-l-", marginSizes, (v) => ({ "margin-left": v }))
    await createStyles("sg", "margin-r-", marginSizes, (v) => ({ "margin-right": v }))
    await createStyles("sg", "margin-t-", marginSizes, (v) => ({ "margin-top": v }))
    await createStyles("sg", "margin-b-", marginSizes, (v) => ({ "margin-bottom": v }))

    // ----------------------------
    // ROUND

    const roundSizes = [50, 75, 100, 150, 200, 250, 300, 350, 400, 450]
    await createStyles("sg", "round-", roundSizes, (v) => ({ "border-radius": v }))
    await createStyles("sg", "round-tl-", roundSizes, (v) => ({ "border-top-left-radius": v }))
    await createStyles("sg", "round-tr-", roundSizes, (v) => ({ "border-top-right-radius": v }))
    await createStyles("sg", "round-bl-", roundSizes, (v) => ({ "border-bottom-left-radius": v }))
    await createStyles("sg", "round-br-", roundSizes, (v) => ({ "border-bottom-right-radius": v }))
}

async function variableGenerate ()
{
    const newCollectionName = "redflow"

    const collections = await webflow.getAllVariableCollections()

    for (const coll of collections) {
        const name = await coll.getName()

        if (name === newCollectionName) await webflow.removeVariableCollection(coll.id)
    }

    const newCollection = await webflow.createVariableCollection(newCollectionName)

    newCollection?.createColorVariable("rf-color/white", "white")
    newCollection?.createColorVariable("rf-color/50", "whitesmoke")
    newCollection?.createColorVariable("rf-color/100", "#edcece")
    newCollection?.createColorVariable("rf-color/200", "#e5a7a7")
    newCollection?.createColorVariable("rf-color/300", "#dc8181")
    newCollection?.createColorVariable("rf-color/400", "#d45a5a")
    newCollection?.createColorVariable("rf-color/500", "#c33")
    newCollection?.createColorVariable("rf-color/600", "#aa2b2b")
    newCollection?.createColorVariable("rf-color/700", "#822")
    newCollection?.createColorVariable("rf-color/800", "#661a1a")
    newCollection?.createColorVariable("rf-color/900", "#411")
    newCollection?.createColorVariable("rf-color/950", "#220909")
    newCollection?.createColorVariable("rf-color/black", "black")

    newCollection?.createSizeVariable("rf-size-g/25", { unit: "rem", value: 0.48 })
    newCollection?.createSizeVariable("rf-size-g/50", { unit: "rem", value: 0.61 })
    newCollection?.createSizeVariable("rf-size-g/75", { unit: "rem", value: 0.78 })
    newCollection?.createSizeVariable("rf-size-g/100", { unit: "rem", value: 1 })
    newCollection?.createSizeVariable("rf-size-g/125", { unit: "rem", value: 1.28 })
    newCollection?.createSizeVariable("rf-size-g/150", { unit: "rem", value: 1.63 })
    newCollection?.createSizeVariable("rf-size-g/175", { unit: "rem", value: 2.08 })
    newCollection?.createSizeVariable("rf-size-g/200", { unit: "rem", value: 2.65 })
    newCollection?.createSizeVariable("rf-size-g/225", { unit: "rem", value: 3.38 })
    newCollection?.createSizeVariable("rf-size-g/250", { unit: "rem", value: 4.31 })
    newCollection?.createSizeVariable("rf-size-g/275", { unit: "rem", value: 5.5 })
    newCollection?.createSizeVariable("rf-size-g/300", { unit: "rem", value: 7.01 })
    newCollection?.createSizeVariable("rf-size-g/325", { unit: "rem", value: 8.94 })
    newCollection?.createSizeVariable("rf-size-g/350", { unit: "rem", value: 11.41 })
    newCollection?.createSizeVariable("rf-size-g/375", { unit: "rem", value: 14.65 })
    newCollection?.createSizeVariable("rf-size-g/400", { unit: "rem", value: 18.57 })
    newCollection?.createSizeVariable("rf-size-g/425", { unit: "rem", value: 23.68 })
    newCollection?.createSizeVariable("rf-size-g/450", { unit: "rem", value: 30.21 })
    newCollection?.createSizeVariable("rf-size-g/475", { unit: "rem", value: 38.54 })
    newCollection?.createSizeVariable("rf-size-g/500", { unit: "rem", value: 49.16 })
    newCollection?.createSizeVariable("rf-size-g/525", { unit: "rem", value: 62.72 })
    newCollection?.createSizeVariable("rf-size-g/550", { unit: "rem", value: 80 })
    newCollection?.createSizeVariable("rf-size-g/575", { unit: "rem", value: 102.06 })

    newCollection?.createSizeVariable("rf-size-t/50", { unit: "rem", value: 0.61 })
    newCollection?.createSizeVariable("rf-size-t/75", { unit: "rem", value: 0.78 })
    newCollection?.createSizeVariable("rf-size-t/100", { unit: "rem", value: 1 })
    newCollection?.createSizeVariable("rf-size-t/125", { unit: "rem", value: 1.28 })
    newCollection?.createSizeVariable("rf-size-t/150", { unit: "rem", value: 1.63 })
    newCollection?.createSizeVariable("rf-size-t/175", { unit: "rem", value: 2.08 })
    newCollection?.createSizeVariable("rf-size-t/200", { unit: "rem", value: 2.65 })
    newCollection?.createSizeVariable("rf-size-t/225", { unit: "rem", value: 3.38 })
    newCollection?.createSizeVariable("rf-size-t/250", { unit: "rem", value: 4.31 })
    newCollection?.createSizeVariable("rf-size-t/275", { unit: "rem", value: 5.5 })
    newCollection?.createSizeVariable("rf-size-t/300", { unit: "rem", value: 7.01 })
    newCollection?.createSizeVariable("rf-size-t/325", { unit: "rem", value: 8.94 })
    newCollection?.createSizeVariable("rf-size-t/350", { unit: "rem", value: 11.41 })

    return newCollection
}

async function TEST ()
{
    const memoryName = "RedFlow.txt"
    const memoryJson = `This is some placeholder text.
  You can put whatever you like here.
  – RedKet’s dummy asset`

    const memoryNew = new File([memoryJson], memoryName, { type: "text/plain" })

    try {
        await webflow.createAsset(memoryNew)

        const assets = await webflow.getAllAssets()

        for (const asset of assets) {
            if ((await asset.getName()) === memoryName) {
                const response = await fetch(await asset.getUrl())

                if (!response.ok) {
                    throw new Error(`Failed to fetch asset: ${response.status}`)
                }
                const content = await response.text()
                console.log(`Contents of ${memoryName}:\n${content}`)
            }
        }
    } catch (err) {
        webflow.notify({ type: "Error", message: err })
    }
}


export async function ClassCreate ()
{

    const rootElement = await webflow.getRootElement();
    if (rootElement) {

        const selectedElement = await webflow.setSelectedElement(rootElement);
        if (selectedElement?.children) {

            const rootChild = await selectedElement?.append(webflow.elementPresets.DivBlock)
            await webflow.setSelectedElement(rootChild);
            await classGenerate()
            webflow.notify({ type: 'Success', message: 'RedFlow utils created' });
        }
    }

}
