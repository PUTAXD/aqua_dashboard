"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  IconDashboard,
  IconSettings,
  IconGauge,
  IconBubble,
  IconFlame,
  IconSnowflake,
  IconBowl,
  IconClock,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
} from "@/components/ui/sidebar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { createClient } from "@/lib/supabase/client"

const data = {
  navMain: [
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <IconGauge className="!size-5" />
                <span className="text-base font-semibold">Control Panel</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2 px-4">
            <h3 className="text-sm font-semibold">Relay Control</h3>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center gap-2">
                <IconBubble className="size-5" />
                <Label htmlFor="nano-bubble">Nano Bubble</Label>
              </div>
              <Switch
                id="nano-bubble"
                checked={nanoBubble}
                onCheckedChange={(newVal: boolean) => {
                  setNanoBubble(newVal);
                  updateRelay("nano_bubble", newVal);
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center gap-2">
                <IconFlame className="size-5" />
                <Label htmlFor="heater">Heater</Label>
              </div>
              <Switch
                id="heater"
                checked={heater}
                onCheckedChange={(newVal: boolean) => {
                  setHeater(newVal);
                  updateRelay("heater", newVal);
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center gap-2">
                <IconSnowflake className="size-5" />
                <Label htmlFor="chiller">Chiller</Label>
              </div>
              <Switch
                id="chiller"
                checked={chiller}
                onCheckedChange={(newVal: boolean) => {
                  setChiller(newVal);
                  updateRelay("chiller", newVal);
                }}
              />
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center gap-2">
                <IconBowl className="size-5" />
                <Label htmlFor="feeder">Feeder</Label>
              </div>
              <Switch
                id="feeder"
                checked={feeder}
                onCheckedChange={(newVal: boolean) => {
                  setFeeder(newVal);
                  updateRelay("feeder", newVal);
                }}
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupContent className="my-4 flex flex-col gap-2 px-4">
            <h3 className="text-sm font-semibold">Automation</h3>
            <Separator />
            <div className="flex items-center justify-between space-x-2">
              <div className="flex items-center gap-2">
                <IconClock className="size-5" />
                <Label htmlFor="automation-setting">Automation Setting</Label>
              </div>
              <Switch
                id="automation-setting"
                checked={false} // Placeholder for automation state
                onCheckedChange={() => {}} // Placeholder for automation change handler
              />
            </div>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
