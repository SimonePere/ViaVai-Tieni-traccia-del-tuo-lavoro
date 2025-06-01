/** @format */

"use client";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "@/app/data.json";

export default function Dashboard() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          {/* Card Riepilogo */}
          <SectionCards />
          <div className="px-4 lg:px-6">
            {/* Grafico */}
            <ChartAreaInteractive />
          </div>
          {/* Tabella con drag drop elementi */}
          <DataTable data={data} />
        </div>
      </div>
    </div>
  );
}
