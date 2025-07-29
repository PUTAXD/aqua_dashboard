"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function RelayPage() {
  const supabase = createClient();

  const [nanoBubble, setNanoBubble] = useState(false);
  const [heater, setHeater] = useState(false);
  const [chiller, setChiller] = useState(false);
  const [feeder, setFeeder] = useState(false);

  // Ambil data awal
  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from("relay_data")
        .select("*")
        .limit(1)
        .single();

      if (error) {
        console.error("Gagal mengambil data awal:", error);
        return;
      }

      setNanoBubble(data.nano_bubble === 1);
      setHeater(data.heater === 1);
      setChiller(data.chiller === 1);
      setFeeder(data.feeder === 1);
    };

    fetchData();
  }, [supabase]);

  // Realtime listener
  useEffect(() => {
    const channel = supabase
      .channel("realtime:relay_data")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "relay_data",
        },
        (payload) => {
          const updated = payload.new;
          setNanoBubble(updated.nano_bubble === 1);
          setHeater(updated.heater === 1);
          setChiller(updated.chiller === 1);
          setFeeder(updated.feeder === 1);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  // Fungsi untuk update relay
  const updateRelay = async (field: string, value: boolean) => {
    const { error } = await supabase
      .from("relay_data")
      .update({ [field]: value ? 1 : 0 })
      .eq("id", "7a00854c-687a-4742-8c88-1f982b257c26"); // Ganti dengan ID sebenarnya atau ambil dari user session

    if (error) {
      console.error(`Gagal update ${field}:`, error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-8">Relay Control</h1>
      <div className="grid grid-cols-2 gap-4">
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            nanoBubble
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => {
            const newVal = !nanoBubble;
            setNanoBubble(newVal);
            updateRelay("nano_bubble", newVal);
          }}
        >
          Nano Bubble: {nanoBubble ? "ON" : "OFF"}
        </Button>
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            heater
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => {
            const newVal = !heater;
            setHeater(newVal);
            updateRelay("heater", newVal);
          }}
        >
          Heater: {heater ? "ON" : "OFF"}
        </Button>
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            chiller
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => {
            const newVal = !chiller;
            setChiller(newVal);
            updateRelay("chiller", newVal);
          }}
        >
          Chiller: {chiller ? "ON" : "OFF"}
        </Button>
        <Button
          className={cn(
            "w-40 h-20 text-lg",
            feeder
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          )}
          onClick={() => {
            const newVal = !feeder;
            setFeeder(newVal);
            updateRelay("feeder", newVal);
          }}
        >
          Feeder: {feeder ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  );
}
