const test = async () =>
{
    // Get the Root Element
    const rootElement = await webflow.getRootElement();
    if (rootElement) {

        const selectedElement = await webflow.setSelectedElement(rootElement);
        if (selectedElement?.children) {
            // Start building elements on the selected element
            const test = await selectedElement?.append(webflow.elementPresets.DivBlock)
            const p = await webflow.setSelectedElement(test);
        }
    }
}

export default test