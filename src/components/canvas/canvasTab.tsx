import React from "react"

import
{
    Button,
    Input,
    Label,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/src/ui"
import { ClassManager } from "@/src/components"

export function CanvasTab ()
{

    return (
        <Tabs
            defaultValue="account"
            className="w-full"
        >
            <TabsList className="flex flex-row w-full">
                <TabsTrigger disabled value="account">Class</TabsTrigger>
                <TabsTrigger disabled value="password">-</TabsTrigger>
                <TabsTrigger disabled value="class">-</TabsTrigger>
            </TabsList>
            <TabsContent value="account">
                <Card>
                    <CardHeader>
                        <CardDescription>
                            Select an element to manage their Utilities
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <ClassManager></ClassManager>
                    </CardContent>
                </Card>
            </TabsContent>
            <TabsContent value="password">
            </TabsContent>
            <TabsContent value="class">
            </TabsContent>
        </Tabs>
    )
}
