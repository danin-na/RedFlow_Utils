import React from "react"

import
{
    Button,
    Input,
    Label,
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/src/ui"

interface CanvasResizeProps
{
    children: React.ReactNode
}

export function CanvasResize ({ children }: CanvasResizeProps)
{
    const [open, setOpen] = React.useState(false)
    const [width, setWidth] = React.useState<number>(320)
    const [height, setHeight] = React.useState<number>(560)
    // flip this to true when user submits
    const [shouldResize, setShouldResize] = React.useState(false)

    // only runs when shouldResize goes from false → true
    React.useEffect(() =>
    {
        if (!shouldResize) return

        const resize = async () =>
        {
            try {
                await webflow.setExtensionSize({ width, height })
                console.log(
                    `Extension UI size set to → { width: ${width}, height: ${height} }`
                )
                setOpen(false)
            } catch (err) {
                console.error("Failed to set extension size", err)
            } finally {
                // reset the flag so effect won't run again until next submit
                setShouldResize(false)
            }
        }

        resize()
    }, [shouldResize, width, height])

    const handleSubmit = (e: React.FormEvent) =>
    {
        e.preventDefault()
        // only trigger effect if both fields are valid
        if (width >= 200 && height >= 200) {
            setShouldResize(true)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent className="bg-card">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <DialogHeader>
                        <DialogTitle className="py-2">Resize Canvas</DialogTitle>
                        <DialogDescription>
                            Enter a custom width & height (in pixels) to resize the app
                        </DialogDescription>
                    </DialogHeader>

                    <div className="grid gap-4 py-2">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="width" className="text-right">
                                Width
                            </Label>
                            <Input
                                id="width"
                                min={200}
                                value={width}
                                onChange={(e) => setWidth(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="height" className="text-right">
                                Height
                            </Label>
                            <Input
                                id="height"
                                min={200}
                                value={height}
                                onChange={(e) => setHeight(Number(e.target.value))}
                                className="col-span-3"
                            />
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="submit"
                            disabled={width < 200 || height < 200}
                        >
                            Apply size
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
