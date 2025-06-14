import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/app/(app)/_components/site-header";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className="flex flex-col">
      <SiteHeader />
      <div className="flex flex-1">
        <AppSidebar />
        <SidebarInset>
          <div className="max-w-3xl px-6 py-4">{children}</div>
        </SidebarInset>
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
