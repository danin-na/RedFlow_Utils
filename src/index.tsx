import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { CanvasMenu, CanvasTab } from "@/src/components";
import { memoryAddValue, memoryReadValue } from "./utils/memoryManager";

async function test ()
{
  await memoryAddValue('RedFlow_File', { 'itemA': 'A', 'groupA': { 'itemB': 'B', 'itemC': { "JJJ": 10, "kkk": 69 } } });
}

const App: React.FC = () =>
{

  test()


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

