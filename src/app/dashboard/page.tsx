"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "./components/data-table";
import { AquaData } from "@/type/aquaData";
import { SectionCards } from "./components/section-cards"; // Corrected import path
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/client";

export default function Page() {
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
        .limit(50);

      if (error) {
        console.error("Error fetching aqua data for dashboard:", error);
      } else {
        setAquaData(data || []);
      }
    };

    checkAuthAndFetchData();
  }, [router]);

  console.log(aquaData);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      {/* <AppSidebar variant="inset" /> */}
      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <h1 className="ml-8 text-2xl font-semibold tracking-tight md:text-4xl">
                Sensors Data :
              </h1>
              <SectionCards
                latestData={aquaData.length > 0 ? aquaData[0] : null}
              />
              <div className="space-y-6">
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
              </div>
              <DataTable data={aquaData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
