import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button"; // Import Button component
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import { useState } from "react"; // Import useState for loading state

export function SiteHeader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSignOut = async () => {
    setLoading(true); // Set loading to true when sign out starts
    try {
      const response = await fetch("/auth/signout", {
        method: "POST",
      });
      if (response.ok) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false); // Set loading to false when sign out finishes
    }
  };

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-medium">Aqua Dashboard</h1>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={handleSignOut} disabled={loading}>
            {loading ? "Signing out..." : "Sign Out"}
          </Button>
        </div>
      </div>
    </header>
  );
}
