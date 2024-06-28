import Image from "next/image";
import { Button } from "@/components/ui/button"
import MainPage from "./page/mainPage";
export default function Home() {
    return (
        <>
            <div className="flex flex-col">
                <div className="max-w-full h-20 bg-slate-600 flex justify-center p-10">
                    <div className="basis-4/5 items-center flex justify-start gap-10">
                        <a className="text-white cursor-pointer">Silverwind-Dashboard</a>
                        <a className="text-white cursor-pointer" >Listener List</a>
                    </div>
                    <div className="basis-1/5 items-center flex">
                        <a className="text-white cursor-pointer" >Reset Dashboard</a>
                    </div>
                </div>
                <div className=" grid grid-cols-10 relative h-screen divide-x divide-foreground/30">
                    <div className="col-span-10"><MainPage /></div>
                </div>
            </div>
        </>
    );
}
