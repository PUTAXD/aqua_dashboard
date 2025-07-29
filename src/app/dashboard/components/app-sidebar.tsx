// "use client"

"use client"

import * as React from "react"
import { useEffect, useState } from "react"
import {
  IconDashboard,
  IconSettings,
  IconInnerShadowTop,
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
                <IconInnerShadowTop className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <SidebarGroup>
          <SidebarGroupContent className="flex flex-col gap-2 px-4">
            <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Relay Control</h3>
            <div className="flex items-center justify-between space-x-2">
              <Label htmlFor="nano-bubble">Nano Bubble</Label>
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
              <Label htmlFor="heater">Heater</Label>
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
              <Label htmlFor="chiller">Chiller</Label>
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
              <Label htmlFor="feeder">Feeder</Label>
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
      </SidebarContent>
      <SidebarFooter>
      </SidebarFooter>
    </Sidebar>
  )
}
