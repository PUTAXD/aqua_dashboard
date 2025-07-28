"use client";

import { createClient } from "@/lib/supabase/client";
import { AquaData } from "@/type/aquaData"; // Import AquaData type

import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function SectionCards({ latestData }: { latestData: AquaData | null }) {
  if (!latestData) {
    return <div>Loading...</div>;
  }
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3 @7xl/main:grid-cols-6">
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Temperature</CardDescription>
        </CardHeader>
        <CardTitle className="ml-6 text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {latestData.temperature !== undefined
            ? `${latestData.temperature} °C`
            : "N/A"}
        </CardTitle>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Optimal range for most aquaculture species.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Ozone</CardDescription>
        </CardHeader>
        <CardTitle className="ml-6 text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {latestData.ozone !== undefined ? `${latestData.ozone} ppm` : "N/A"}
        </CardTitle>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Low levels indicate good water quality.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Ammonia</CardDescription>
        </CardHeader>
        <CardTitle className="ml-6 text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {latestData.ammonium !== undefined
            ? `${latestData.ammonium} mg/L`
            : "N/A"}
        </CardTitle>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Critical for fish health, monitor closely.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Dissolved Oxygen (DO)</CardDescription>
        </CardHeader>
        <CardTitle className="ml-6 text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {latestData.oxygen !== undefined
            ? `${latestData.oxygen} mg/L`
            : "N/A"}
        </CardTitle>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Essential for aquatic life, maintain high levels.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>Conductivity</CardDescription>
        </CardHeader>
        <CardTitle className="ml-6 text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {latestData.conductivity !== undefined
            ? `${latestData.conductivity} µS/cm`
            : "N/A"}
        </CardTitle>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Indicates water purity and mineral content.
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardDescription>TDS</CardDescription>
        </CardHeader>
        <CardTitle className="ml-6 text-3xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {latestData.tds !== undefined ? `${latestData.tds} mg/L` : "N/A"}
        </CardTitle>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="text-muted-foreground">
            Measure of all dissolved substances in water.
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
