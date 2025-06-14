import { SiteHeader } from "@/app/(app)/_components/site-header";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/toaster";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen min-w-screen flex-col">
        <SiteHeader />
        {children}
        <Toaster />
      </div>
    </SidebarProvider>
  );
}
