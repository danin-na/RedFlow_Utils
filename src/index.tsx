import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { CanvasMenu, CanvasTab } from "@/src/components";
import { memoryAddValue, memoryReadValue } from "./utils/memoryManager";

async function test ()
{

  await memoryAddValue('userPrefs2', {
    'font-size': 16,
    'theme.color': 'blue',            // nested via dot-notation
    'test': { 'test2': 'font-100' }
  });


  const settings = await memoryReadValue('userPrefs2', ['fontSize', 'enabled2', 'test']);
  console.log(settings)

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

