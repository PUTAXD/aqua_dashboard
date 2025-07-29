"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "./components/data-table";
import { SectionCards } from "./components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAquaData } from "@/hooks/use-aqua-data";
import { TemperatureChart } from "./components/temperature-chart";
import { AquaData } from "@/type/aquaData";

import { OzoneChart } from "./components/ozone-chart";
import { AmmoniaChart } from "./components/ammonia-chart";
import { OxygenChart } from "./components/oxygen-chart";
import { ConductivityChart } from "./components/conductivity-chart";
import { TdsChart } from "./components/tds-chart";
import { ChartLineLinear } from "./components/do-chart";

type TemperatureAquaData = {
  Date: string;
  Time: string;
  temperature: number;
};

type OzoneAquaData = {
  Date: string;
  Time: string;
  ozone: number;
};

type AmmoniaAquaData = {
  Date: string;
  Time: string;
  ammonia: number;
};

type OxygenAquaData = {
  Date: string;
  Time: string;
  oxygen: number;
};

type ConductivityAquaData = {
  Date: string;
  Time: string;
  conductivity: number;
};

type TdsAquaData = {
  Date: string;
  Time: string;
  tds: number;
};

export default function Page() {
  const aquaData = useAquaData();

  const temperatureAquaData: TemperatureAquaData[] = aquaData.map(
    (data: AquaData) => {
      const dateTime = new Date(data.terminaltime);
      const date = dateTime.toISOString().split("T")[0];
      const time = dateTime.toTimeString().split(" ")[0];
      return {
        Date: date,
        Time: time,
        temperature: data.temperature,
      };
    }
  );
  console.log("Transformed Temperature Data:", temperatureAquaData);

  const ozoneAquaData: OzoneAquaData[] = aquaData.map((data: AquaData) => {
    const dateTime = new Date(data.terminaltime);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toTimeString().split(' ')[0];
    return {
      Date: date,
      Time: time,
      ozone: data.ozone,
    };
  });
  console.log("Transformed Ozone Data:", ozoneAquaData);

  const ammoniaAquaData: AmmoniaAquaData[] = aquaData.map((data: AquaData) => {
    const dateTime = new Date(data.terminaltime);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toTimeString().split(' ')[0];
    return {
      Date: date,
      Time: time,
      ammonia: data.ammonium, // Corrected from data.ammonia to data.ammonium
    };
  });
  console.log("Transformed Ammonia Data:", ammoniaAquaData);

  const oxygenAquaData: OxygenAquaData[] = aquaData.map((data: AquaData) => {
    const dateTime = new Date(data.terminaltime);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toTimeString().split(' ')[0];
    return {
      Date: date,
      Time: time,
      oxygen: data.oxygen,
    };
  });
  console.log("Transformed Oxygen Data:", oxygenAquaData);

  const conductivityAquaData: ConductivityAquaData[] = aquaData.map((data: AquaData) => {
    const dateTime = new Date(data.terminaltime);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toTimeString().split(' ')[0];
    return {
      Date: date,
      Time: time,
      conductivity: data.conductivity,
    };
  });
  console.log("Transformed Conductivity Data:", conductivityAquaData);

  const tdsAquaData: TdsAquaData[] = aquaData.map((data: AquaData) => {
    const dateTime = new Date(data.terminaltime);
    const date = dateTime.toISOString().split('T')[0];
    const time = dateTime.toTimeString().split(' ')[0];
    return {
      Date: date,
      Time: time,
      tds: data.tds,
    };
  });
  console.log("Transformed TDS Data:", tdsAquaData);

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
                  <TemperatureChart data={temperatureAquaData} />
                </div>

                <div className="px-4 lg:px-6">
                  <OzoneChart data={ozoneAquaData} />
                </div>
                <div className="px-4 lg:px-6">
                  <AmmoniaChart data={ammoniaAquaData} />
                </div>
                <div className="px-4 lg:px-6">
                  <OxygenChart data={oxygenAquaData} />
                </div>
                <div className="px-4 lg:px-6">
                  <ConductivityChart data={conductivityAquaData} />

                <div className="w-1/2 px-4 lg:px-6">
                  <ChartLineLinear />
                </div>
                <div className="w-1/2 px-4 lg:px-6">
                  <ChartLineLinear />

                </div>
                <div className="px-4 lg:px-6">
                  <TdsChart data={tdsAquaData} />
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
