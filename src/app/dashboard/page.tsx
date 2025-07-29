"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "./components/data-table";
import { SectionCards } from "./components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAquaData } from "@/hooks/use-aqua-data";

export default function Page() {
  const aquaData = useAquaData();

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
