/** @format */

"use client";

import * as React from "react";
import {
  ArrowUpCircleIcon,
  BarChartIcon,
  CameraIcon,
  ClipboardListIcon,
  DatabaseIcon,
  FileCodeIcon,
  FileIcon,
  FileTextIcon,
  FolderIcon,
  HelpCircleIcon,
  LayoutDashboardIcon,
  ListIcon,
  LogInIcon,
  SearchIcon,
  SettingsIcon,
  UserPlusIcon,
  UsersIcon,
} from "lucide-react";

import { NavDocuments } from "@/components/nav-documents";
import { NavMain } from "@/components/nav-main";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import dotenv from "dotenv";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "@/app/redux/slices/authSlice";

dotenv.config();
const LOCAL_HOST = process.env.NEXT_PUBLIC_LOCAL_HOST;

// Dati statici per la navigazione e l'utente di default
// Questi dati vengono utilizzati quando l'utente non è autenticato
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Trasporti",
      url: "/lista-trasporti",
      icon: ListIcon,
    },
    {
      title: "Analisi",
      url: "#",
      icon: BarChartIcon,
    },
    {
      title: "Archivio",
      url: "#",
      icon: FolderIcon,
    },
    {
      title: "Utenti",
      url: "/lista-utenti",
      icon: UsersIcon,
    },
    {
      title: "Log In",
      url: "/login-user",
      icon: LogInIcon,
    },
    {
      title: "Registrati",
      url: "/register-user",
      icon: UserPlusIcon,
    },
  ],
  navClouds: [
    {
      title: "Capture",
      icon: CameraIcon,
      isActive: true,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Proposal",
      icon: FileTextIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
    {
      title: "Prompts",
      icon: FileCodeIcon,
      url: "#",
      items: [
        {
          title: "Active Proposals",
          url: "#",
        },
        {
          title: "Archived",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: "Impostazioni",
      url: "#",
      icon: SettingsIcon,
    },
    {
      title: "Aiuto",
      url: "#",
      icon: HelpCircleIcon,
    },
    {
      title: "Cerca",
      url: "#",
      icon: SearchIcon,
    },
  ],
  documents: [
    {
      name: "Libreria Dati",
      url: "#",
      icon: DatabaseIcon,
    },
    {
      name: "Appunti",
      url: "#",
      icon: ClipboardListIcon,
    },
    {
      name: "Assistant",
      url: "#",
      icon: FileIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Hook per dispatchare azioni Redux
  const dispatch = useDispatch();

  // Selezione dello stato Redux
  // 1. authState: contiene i dati dell'autenticazione (user, email, token, ecc.)
  // 2. allState: contiene l'intero stato dell'applicazione per debug
  const authState = useSelector((state: any) => state.auth);
  const allState = useSelector((state: any) => state);

  // Debug degli stati
  // Questi log ci aiutano a capire:
  // - Se lo stato Redux è stato inizializzato correttamente
  // - Se i dati dell'utente sono presenti
  // - Se l'utente è autenticato
  console.log("TUTTO LO STATO REDUX:", allState);
  console.log("AUTH STATE:", authState);

  // Creazione dell'oggetto userInfo per il componente NavUser
  // Questo oggetto viene creato in base allo stato di autenticazione:
  // - Se l'utente è autenticato: usa i dati dallo stato Redux
  // - Se l'utente non è autenticato: usa valori di default
  const userInfo = {
    name: authState?.user || "Utente non loggato",
    email: authState?.email || "Nessuna email",
  };

  console.log("USER INFO CREATA:", userInfo);

  // Verifica dello stato di autenticazione
  // Questo blocco ci aiuta a capire se:
  // - L'utente è autenticato (isAuthenticated === true)
  // - I dati dell'utente sono disponibili (user ed email)
  if (authState?.isAuthenticated) {
    console.log("Utente autenticato, dati:", {
      name: authState.user,
      email: authState.email,
    });
  } else {
    console.log("Utente non autenticato");
  }

  // Renderizzazione del componente
  // Il componente NavUser riceve i dati dell'utente attraverso la prop user
  // Questi dati possono essere:
  // - I dati reali dell'utente se autenticato
  // - I valori di default se non autenticato
  return (
    <Sidebar collapsible="offcanvas" {...props} className="">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <ArrowUpCircleIcon className="h-5 w-5" />
                <span className="text-base font-semibold">ViaVai</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavDocuments items={data.documents} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        {/* Passaggio dei dati dell'utente al componente NavUser */}
        <NavUser user={userInfo} />
      </SidebarFooter>
    </Sidebar>
  );
}
