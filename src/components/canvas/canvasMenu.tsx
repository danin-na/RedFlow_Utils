import React from "react"

import
{
    Menubar,
    MenubarCheckboxItem,
    MenubarContent,
    MenubarItem,
    MenubarMenu,
    MenubarRadioGroup,
    MenubarRadioItem,
    MenubarSeparator,
    MenubarShortcut,
    MenubarSub,
    MenubarSubContent,
    MenubarSubTrigger,
    MenubarTrigger,
} from "@/src/ui"

import { CanvasResize, CanvasThemeDark, CanvasThemeLight, ClassCreate } from "@/src/components"

export function CanvasMenu ()
{
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>App</MenubarTrigger>
                <MenubarContent>


                    <MenubarItem onClick={() => { ClassCreate() }}>
                        Install Utils <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>
                        Re-order Style <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled >New Incognito Window</MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>Share</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem disabled>Email link</MenubarItem>
                            <MenubarItem disabled>Messages</MenubarItem>
                            <MenubarItem disabled>Notes</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem disabled>
                        Print... <MenubarShortcut>⌘P</MenubarShortcut>
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger >Setting</MenubarTrigger>
                <MenubarContent>
                    <MenubarRadioGroup value="benoit">
                        <MenubarRadioItem value="andy" onClick={() => { CanvasThemeDark() }}>Dark Mode</MenubarRadioItem>
                        <MenubarRadioItem value="benoit" onClick={() => { CanvasThemeLight() }}>Light Mode</MenubarRadioItem>
                    </MenubarRadioGroup>
                    <MenubarSeparator />
                    <CanvasResize>
                        <MenubarItem onSelect={(e) => e.preventDefault()} inset>
                            Resize Canvas <MenubarShortcut>⌘T</MenubarShortcut>
                        </MenubarItem>
                    </CanvasResize>
                    <MenubarSeparator />
                    <MenubarCheckboxItem disabled >Always Show Setting Bar</MenubarCheckboxItem>
                    <MenubarCheckboxItem checked disabled >Always Show App Bar</MenubarCheckboxItem>
                    <MenubarSeparator />
                    <MenubarItem disabled inset>
                        Reload <MenubarShortcut>⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled
                        inset
                    >
                        Force Reload <MenubarShortcut>⇧⌘R</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled inset>Toggle Fullscreen</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled inset>Hide Sidebar</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
