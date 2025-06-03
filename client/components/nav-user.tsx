/** @format */
"use client";

import {
  BellIcon,
  CreditCardIcon,
  LogOutIcon,
  MoreVerticalIcon,
  UserCircleIcon,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { CustomPopover } from "@/components/ui/custom-popover";
import { Button } from "@/components/ui/button";

import { useDispatch, useSelector } from "react-redux";
import { usePathname, useRouter } from "next/navigation"; // App Router
import useLoading from "../app/hooks/useLoading";
import { logout } from "@/app/redux/slices/authSlice";
import { useState } from "react";
import { XCircle, CheckCircle2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function NavUser({
  user,
}: {
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const { isMobile } = useSidebar();
  const dispatch = useDispatch();
  const router = useRouter();
  const authState = useSelector((state: any) => state.auth);
  const { isLoading, startLoading, stopLoading } = useLoading();
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    if (authState.access_token) {
      try {
        startLoading();
        dispatch(logout());
        setIsSuccess(true);
        setError(null);
        // piccolo delay prima del reindirizzamento per mostrare il messaggio
        setTimeout(() => {
          router.push("/");
        }, 1500);
      } catch (err: any) {
        setError(err.message || "Si è verificato un errore durante il logout");
        setIsSuccess(false);
      } finally {
        stopLoading();
      }
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="h-8 w-8 rounded-lg grayscale">
                {user.avatar && (
                  <AvatarImage src={user.avatar} alt={user.name} />
                )}
                <AvatarFallback className="rounded-lg">
                  {user.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user.name}</span>
                <span className="truncate text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <MoreVerticalIcon className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-8 w-8 rounded-lg">
                  {user.avatar && (
                    <AvatarImage src={user.avatar} alt={user.name} />
                  )}
                  <AvatarFallback className="rounded-lg">
                    {user.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <UserCircleIcon />
                Account
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CreditCardIcon />
                Pagamenti
              </DropdownMenuItem>
              <DropdownMenuItem>
                <BellIcon />
                Notifiche
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <CustomPopover
              triggerText="Log out"
              triggerIcon={<LogOutIcon />}
              align="end"
              side={isMobile ? "bottom" : "right"}
            >
              <div className="flex flex-col gap-4 p-2">
                <p className="text-sm">
                  Sei sicuro di voler effettuare il logout?
                </p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Annulla
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading ? "Logout in corso..." : "Logout"}
                  </Button>
                </div>
                {error && (
                  <Alert
                    variant="destructive"
                    className="bg-red-50 border-red-200"
                  >
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-600">
                      {error}
                    </AlertDescription>
                  </Alert>
                )}

                {isSuccess && (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                      Logout effettuato. A presto!
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </CustomPopover>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
