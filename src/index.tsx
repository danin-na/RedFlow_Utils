import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { CanvasMenu, CanvasTab, CanvasThemeDark, CanvasThemeLight } from "@/src/components";
import { file } from './utils/fileManager';

const App: React.FC = () =>
{

  return (

    <div className="h-screen bg-background p-2">
      <CanvasMenu></CanvasMenu>
      <CanvasTab></CanvasTab>
    </div>
  )
};

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);

