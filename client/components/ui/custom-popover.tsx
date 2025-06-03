/** @format */

"use client";

import * as React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "@/lib/utils";

interface CustomPopoverProps {
  triggerText?: string;
  triggerIcon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  align?: "start" | "center" | "end";
  side?: "top" | "right" | "bottom" | "left";
}

export function CustomPopover({
  triggerText,
  triggerIcon,
  children,
  className,
  onClick,
  align = "center",
  side = "bottom",
}: CustomPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger
        className={cn("flex items-center gap-2", className)}
        onClick={onClick}
      >
        {triggerIcon}
        {triggerText}
      </PopoverTrigger>
      <PopoverContent align={align} side={side} className="w-auto p-4">
        {children}
      </PopoverContent>
    </Popover>
  );
}
