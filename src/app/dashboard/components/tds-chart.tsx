"use client"

import * as React from "react"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format } from "date-fns";

import { useIsMobile } from "@/hooks/use-mobile"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export const description = "An interactive area chart"

type TdsDataItem = {
  Date: string;
  Time: string;
  tds: number;
};

const chartConfig = {
  tds: {
    label: "TDS",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig

type TdsChartProps = {
  data: TdsDataItem[];
};

export function TdsChart({ data }: TdsChartProps) {
  const isMobile = useIsMobile()
  const allDates = React.useMemo(() => {
    const dates = new Set(data.map(item => item.Date));
    return Array.from(dates).sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
  }, [data]);

  const [selectedDate, setSelectedDate] = React.useState<string>(allDates[allDates.length - 1] || "");

  React.useEffect(() => {
    if (allDates.length > 0 && !allDates.includes(selectedDate)) {
      setSelectedDate(allDates[allDates.length - 1]);
    }
  }, [allDates, selectedDate]);

  const filteredData = React.useMemo(() => {
    return data
      .filter(item => item.Date === selectedDate)
      .sort((a, b) => {
        const timeA = new Date(`2000-01-01T${a.Time}`);
        const timeB = new Date(`2000-01-01T${b.Time}`);
        return timeA.getTime() - timeB.getTime();
      });
  }, [data, selectedDate]);

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>TDS</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            TDS data for the selected day, every 30 minutes.
          </span>
          <span className="@[540px]/card:hidden">Daily TDS</span>
        </CardDescription>
        <CardAction>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger
              className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate"
              size="sm"
              aria-label="Select a date"
            >
              <SelectValue placeholder="Select a date" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {allDates.map((date) => (
                <SelectItem key={date} value={date} className="rounded-lg">
                  {format(new Date(date), "PPP")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTds" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-tds)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-tds)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="Time"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => format(new Date(`2000-01-01T${value}`), "HH:mm")}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => format(new Date(`2000-01-01T${value}`), "HH:mm")}
                  indicator="dot"
                />
              }
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => `${value} ppm`}
            />
            <Area
              dataKey="tds"
              type="natural"
              fill="url(#fillTds)"
              stroke="var(--color-tds)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
