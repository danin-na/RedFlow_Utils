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

import { CanvasResize, ClassCreate } from "@/src/components"

export function CanvasMenu ()
{
    return (
        <Menubar>
            <MenubarMenu>
                <MenubarTrigger>Setting</MenubarTrigger>
                <MenubarContent>
                    <CanvasResize>
                        <MenubarItem onSelect={(e) => e.preventDefault()}>
                            Resize Canvas <MenubarShortcut>⌘T</MenubarShortcut>
                        </MenubarItem>
                    </CanvasResize>

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
                <MenubarTrigger disabled>Edit</MenubarTrigger>
                <MenubarContent>
                    <MenubarItem disabled>
                        Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem disabled>
                        Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarSub>
                        <MenubarSubTrigger>Find</MenubarSubTrigger>
                        <MenubarSubContent>
                            <MenubarItem disabled>Search the web</MenubarItem>
                            <MenubarSeparator />
                            <MenubarItem disabled>Find...</MenubarItem>
                            <MenubarItem disabled>Find Next</MenubarItem>
                            <MenubarItem disabled>Find Previous</MenubarItem>
                        </MenubarSubContent>
                    </MenubarSub>
                    <MenubarSeparator />
                    <MenubarItem disabled>Cut</MenubarItem>
                    <MenubarItem disabled>Copy</MenubarItem>
                    <MenubarItem disabled>Paste</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
            <MenubarMenu>
                <MenubarTrigger disabled>View</MenubarTrigger>
                <MenubarContent>
                    <MenubarCheckboxItem>Always Show Bookmarks Bar</MenubarCheckboxItem>
                    <MenubarCheckboxItem checked>Always Show Full URLs</MenubarCheckboxItem>
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
            <MenubarMenu>
                <MenubarTrigger disabled>Profiles</MenubarTrigger>
                <MenubarContent>
                    <MenubarRadioGroup value="benoit">
                        <MenubarRadioItem value="andy">Andy</MenubarRadioItem>
                        <MenubarRadioItem value="benoit">Benoit</MenubarRadioItem>
                        <MenubarRadioItem value="Luis">Luis</MenubarRadioItem>
                    </MenubarRadioGroup>
                    <MenubarSeparator />
                    <MenubarItem disabled inset>Edit...</MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem disabled inset>Add Profile...</MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar>
    )
}
