import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { BaseInfoPage } from "./testPage1";
export default function MainPage() {

    return (
        <Tabs defaultValue="text" className="w-full  h-[calc(100vh-60px)] p-10 flex flex-col	" >
            <TabsList className="grid w-1/2 grid-cols-4 flex-initial" >
                <TabsTrigger value="text">aaa</TabsTrigger>
                <TabsTrigger value="image">bbb</TabsTrigger>
                <TabsTrigger value="halftofull">ccc</TabsTrigger>
                <TabsTrigger value="regex">ddd</TabsTrigger>
            </TabsList>
            <TabsContent value="text" className="w-full h-full"><BaseInfoPage /></TabsContent>
            <TabsContent value="image" className="w-full h-full"><BaseInfoPage /></TabsContent>
            <TabsContent value="halftofull" className="w-full h-full"><BaseInfoPage /></TabsContent>
            <TabsContent value="regex" className="w-full h-full"><BaseInfoPage /></TabsContent>

        </Tabs>
    );
}