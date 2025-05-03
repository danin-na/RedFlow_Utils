import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { CanvasMenu } from "./components/canvas/canvasMenu";

const App: React.FC = () =>
{
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

  test()

  return (

    <div className="h-screen p-1">
      <CanvasMenu></CanvasMenu>
      test2
    </div>
  )
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
