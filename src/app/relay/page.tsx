"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RelayPage() {
  const [nanoBubble, setNanoBubble] = useState(false);
  const [heater, setHeater] = useState(false);
  const [chiller, setChiller] = useState(false);
  const [feeder, setFeeder] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Relay Control</h1>
      <div className="grid grid-cols-2 gap-4">
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            nanoBubble ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => setNanoBubble(!nanoBubble)}
        >
          Nano Bubble: {nanoBubble ? "ON" : "OFF"}
        </Button>
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            heater ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => setHeater(!heater)}
        >
          Heater: {heater ? "ON" : "OFF"}
        </Button>
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            chiller ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => setChiller(!chiller)}
        >
          Chiller: {chiller ? "ON" : "OFF"}
        </Button>
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            feeder ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => setFeeder(!feeder)}
        >
          Feeder: {feeder ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
