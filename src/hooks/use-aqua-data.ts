"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AquaData } from "@/type/aquaData";

export function useAquaData() {
  const [aquaData, setAquaData] = useState<AquaData[]>([]);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();

    const checkAuthAndFetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("data_aqua")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) {
        console.error("Error fetching aqua data for dashboard:", error);
      } else {
        setAquaData(data || []);
      }
    };

    checkAuthAndFetchData();

    const channel = supabase
      .channel("realtime:data_aqua")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "data_aqua",
        },
        (payload) => {
          setAquaData((prev) => {
            const updated = [payload.new as AquaData, ...prev];
            return updated.slice(0, 50);
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return aquaData;
}
