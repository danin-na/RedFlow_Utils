import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { CanvasMenu, CanvasTab, CanvasThemeDark, CanvasThemeLight } from "@/src/components";
import { memory } from "@/src/utils"


import _ from 'lodash';


// Call this on app startup
export async function initUserConfig ()
{
  // 1) Guarantee the file exists and pull in its contents
  const config = await memory.ensureMemory('RedFlow_UserConfig');

  // 2) If our key is missing, give it the default
  if (!_.has(config, 'Canvas_Setting_Theme')) {
    await memory.updateValue('RedFlow_UserConfig', {
      Canvas_Setting_Theme: 'dark'
    });
  }

  // 3) Return the (now-guaranteed) current config
  return await memory.readValue('RedFlow_UserConfig', ['Canvas_Setting_Theme']);
}

(async () =>
{
  const { Canvas_Setting_Theme } = await initUserConfig();
  console.log('Theme is:', Canvas_Setting_Theme); // → "dark" on first run

  if (Canvas_Setting_Theme == 'dark') { CanvasThemeDark() } else { CanvasThemeLight() }


})();


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

