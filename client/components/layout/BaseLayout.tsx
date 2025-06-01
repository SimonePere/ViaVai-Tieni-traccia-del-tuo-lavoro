/** @format */
"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";

const getPageTitle = (pathname: string) => {
  // Rimuove lo slash iniziale e converte in maiuscolo la prima lettera
  const title = pathname.split("/").pop() || "Home";
  return title.charAt(0).toUpperCase() + title.slice(1);
};

export default function BaseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader NavbarTitle={pageTitle} />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
